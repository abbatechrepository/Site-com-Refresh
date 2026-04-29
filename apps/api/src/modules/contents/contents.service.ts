import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma.service";
import type { AuthenticatedUser } from "../auth/auth.types";

type UpsertContentInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  status?: string;
  visibility?: string;
  sectionId: string;
  contentTypeId: string;
  templateId?: string | null;
  featuredMediaId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonicalUrl?: string;
  seoRobots?: string;
};

@Injectable()
export class ContentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async nextSequenceNumber() {
    const aggregate = await this.prisma.content.aggregate({
      _max: {
        displayId: true
      }
    });

    return (aggregate._max.displayId ?? 0) + 1;
  }

  async listPublished() {
    return this.prisma.content.findMany({
      where: { status: "published" },
      include: {
        section: true,
        seo: true,
        template: true
      },
      orderBy: { publishedAt: "desc" },
      take: 20
    });
  }

  async findBySlug(slug: string) {
    const content = await this.prisma.content.findUnique({
      where: { slug },
      include: {
        section: true,
        seo: true,
        template: true,
        featuredMedia: true
      }
    });

    if (!content) {
      throw new NotFoundException("Conteudo nao encontrado.");
    }

    return content;
  }

  async listAdmin(user: AuthenticatedUser) {
    const scope = await this.getRoleScope(user.roleId);

    return this.prisma.content.findMany({
      where: {
        ...(scope.sectionIds ? { sectionId: { in: scope.sectionIds } } : {}),
        ...(scope.contentTypeIds ? { contentTypeId: { in: scope.contentTypeIds } } : {})
      },
      include: {
        section: true,
        seo: true,
        template: true,
        contentType: true,
        author: true
      },
      orderBy: [{ updatedAt: "desc" }]
    });
  }

  async getEditorMeta(user: AuthenticatedUser) {
    const scope = await this.getRoleScope(user.roleId);
    const [sections, templates, contentTypes] = await Promise.all([
      this.prisma.section.findMany({
        where: {
          isActive: true,
          ...(scope.sectionIds ? { id: { in: scope.sectionIds } } : {})
        },
        orderBy: [{ path: "asc" }]
      }),
      this.prisma.template.findMany({
        where: { isActive: true },
        orderBy: [{ name: "asc" }]
      }),
      this.prisma.contentType.findMany({
        where: scope.contentTypeIds ? { id: { in: scope.contentTypeIds } } : undefined,
        orderBy: [{ name: "asc" }]
      })
    ]);

    return {
      sections,
      templates,
      contentTypes
    };
  }

  async create(user: AuthenticatedUser, payload: UpsertContentInput) {
    await this.ensureRelations(payload, user.roleId);

    const slug = await this.resolveUniqueSlug(payload.slug ?? payload.title);
    const seo = await this.upsertSeo(undefined, payload);

    const content = await this.prisma.content.create({
      data: {
        displayId: await this.nextSequenceNumber(),
        title: payload.title,
        slug,
        excerpt: payload.excerpt,
        body: payload.body,
        status: payload.status ?? "draft",
        visibility: payload.visibility ?? "public",
        publishedAt: payload.status === "published" ? new Date() : null,
        sectionId: payload.sectionId,
        contentTypeId: payload.contentTypeId,
        templateId: payload.templateId || null,
        featuredMediaId: payload.featuredMediaId || null,
        authorId: user.sub,
        seoId: seo?.id ?? null
      },
      include: {
        section: true,
        seo: true,
        template: true,
        contentType: true
      }
    });

    await this.createRevision(content.id, user.sub, content);

    return content;
  }

  async update(id: string, user: AuthenticatedUser, payload: UpsertContentInput) {
    const existing = await this.prisma.content.findUnique({
      where: { id },
      include: {
        seo: true
      }
    });

    if (!existing) {
      throw new NotFoundException("Conteudo nao encontrado.");
    }

    await this.ensureRelations(payload, user.roleId);

    const slug = await this.resolveUniqueSlug(payload.slug ?? existing.slug, id);
    const seo = await this.upsertSeo(existing.seoId, payload);
    const nextStatus = payload.status ?? existing.status;

    const content = await this.prisma.content.update({
      where: { id },
      data: {
        title: payload.title,
        slug,
        excerpt: payload.excerpt,
        body: payload.body,
        status: nextStatus,
        visibility: payload.visibility ?? existing.visibility,
        publishedAt:
          nextStatus === "published"
            ? existing.publishedAt ?? new Date()
            : payload.status === "draft"
              ? null
              : existing.publishedAt,
        sectionId: payload.sectionId,
        contentTypeId: payload.contentTypeId,
        templateId: payload.templateId || null,
        featuredMediaId: payload.featuredMediaId || null,
        seoId: seo?.id ?? null
      },
      include: {
        section: true,
        seo: true,
        template: true,
        contentType: true
      }
    });

    await this.createRevision(content.id, user.sub, content);

    return content;
  }

  async remove(id: string) {
    const existing = await this.prisma.content.findUnique({
      where: { id },
      include: {
        revisions: true
      }
    });

    if (!existing) {
      throw new NotFoundException("Conteudo nao encontrado.");
    }

    await this.prisma.contentRevision.deleteMany({
      where: { contentId: id }
    });

    return this.prisma.content.delete({
      where: { id }
    });
  }

  private async ensureRelations(payload: UpsertContentInput, roleId?: string) {
    const [section, contentType] = await Promise.all([
      this.prisma.section.findUnique({
        where: { id: payload.sectionId }
      }),
      this.prisma.contentType.findUnique({
        where: { id: payload.contentTypeId }
      })
    ]);

    if (!section) {
      throw new BadRequestException("Secao invalida.");
    }

    if (!contentType) {
      throw new BadRequestException("Tipo de conteudo invalido.");
    }

    const scope = await this.getRoleScope(roleId);

    if (scope.sectionIds && !scope.sectionIds.includes(payload.sectionId)) {
      throw new ForbiddenException("Este perfil nao pode publicar na secao selecionada.");
    }

    if (scope.contentTypeIds && !scope.contentTypeIds.includes(payload.contentTypeId)) {
      throw new ForbiddenException("Este perfil nao pode usar a mascara selecionada.");
    }

    if (payload.templateId) {
      const template = await this.prisma.template.findUnique({
        where: { id: payload.templateId }
      });

      if (!template) {
        throw new BadRequestException("Template invalido.");
      }
    }
  }

  private async upsertSeo(existingSeoId: string | null | undefined, payload: UpsertContentInput) {
    const seoData = {
      title: payload.seoTitle || payload.title,
      description: payload.seoDescription || payload.excerpt || payload.title,
      keywords: payload.seoKeywords || "abbatech, portal, conteudo",
      canonicalUrl: payload.seoCanonicalUrl,
      robots: payload.seoRobots || "index,follow"
    };

    if (existingSeoId) {
      return this.prisma.seoMetadata.update({
        where: { id: existingSeoId },
        data: seoData
      });
    }

    return this.prisma.seoMetadata.create({
      data: seoData
    });
  }

  private async createRevision(contentId: string, editorId: string, snapshot: unknown) {
    await this.prisma.contentRevision.create({
      data: {
        contentId,
        editorId,
        snapshot: JSON.parse(JSON.stringify(snapshot))
      }
    });
  }

  private async resolveUniqueSlug(value: string, currentId?: string) {
    const baseSlug = this.toSlug(value);
    let candidate = baseSlug;
    let suffix = 1;

    while (true) {
      const existing = await this.prisma.content.findFirst({
        where: {
          slug: candidate,
          ...(currentId ? { NOT: { id: currentId } } : {})
        }
      });

      if (!existing) {
        return candidate;
      }

      suffix += 1;
      candidate = `${baseSlug}-${suffix}`;
    }
  }

  private toSlug(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  private async getRoleScope(roleId?: string) {
    if (!roleId) {
      return {
        sectionIds: null as string[] | null,
        contentTypeIds: null as string[] | null
      };
    }

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        sectionAccesses: {
          include: {
            section: true
          }
        },
        contentTypeAccesses: true
      }
    });

    if (!role) {
      return {
        sectionIds: [] as string[],
        contentTypeIds: [] as string[]
      };
    }

    const normalizedRoleName = role.name.toLowerCase();
    const normalizedFunctionName = role.functionName?.toLowerCase() ?? "";
    const isUnrestrictedRole =
      normalizedRoleName.includes("administrador") ||
      normalizedRoleName.includes("desenvolvedor") ||
      normalizedFunctionName.includes("administrador") ||
      normalizedFunctionName.includes("desenvolvedor");

    if (isUnrestrictedRole) {
      return {
        sectionIds: null as string[] | null,
        contentTypeIds: null as string[] | null
      };
    }

    let sectionIds: string[] | null = [];
    if (role.sectionAccesses.length > 0) {
      const allowedPaths = role.sectionAccesses.map(
        (entry: (typeof role.sectionAccesses)[number]) => entry.section.path
      );
      const allowedSections = await this.prisma.section.findMany({
        where: {
          OR: allowedPaths.flatMap((path: string) => [{ path }, { path: { startsWith: `${path}/` } }])
        },
        select: { id: true }
      });
      sectionIds = allowedSections.map((entry: (typeof allowedSections)[number]) => entry.id);
    }

    const contentTypeIds =
      role.contentTypeAccesses.length > 0
        ? role.contentTypeAccesses.map(
            (entry: (typeof role.contentTypeAccesses)[number]) => entry.contentTypeId
          )
        : [];

    return {
      sectionIds,
      contentTypeIds
    };
  }
}
