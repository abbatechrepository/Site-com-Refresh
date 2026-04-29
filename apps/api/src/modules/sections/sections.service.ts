import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma.service";

type UpsertSectionInput = {
  name: string;
  slug?: string;
  description?: string;
  order?: number;
  visibleInMenu?: boolean;
  isActive?: boolean;
  parentId?: string | null;
};

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  private async nextSequenceNumber() {
    const aggregate = await this.prisma.section.aggregate({
      _max: {
        displayId: true
      }
    });

    return (aggregate._max.displayId ?? 0) + 1;
  }

  async listTree() {
    return this.prisma.section.findMany({
      where: { parentId: null, isActive: true },
      include: {
        children: {
          orderBy: { order: "asc" }
        }
      },
      orderBy: { order: "asc" }
    });
  }

  async listAdmin() {
    return this.prisma.section.findMany({
      include: {
        parent: true,
        _count: {
          select: {
            children: true,
            contents: true
          }
        }
      },
      orderBy: [{ path: "asc" }]
    });
  }

  async create(payload: UpsertSectionInput) {
    const parent = await this.getParent(payload.parentId);
    const slug = this.toSlug(payload.slug ?? payload.name);
    const path = this.buildPath(parent?.path, slug);

    await this.ensureUniqueSlugAndPath(slug, path);

    return this.prisma.section.create({
      data: {
        displayId: await this.nextSequenceNumber(),
        name: payload.name,
        slug,
        path,
        description: payload.description,
        order: payload.order ?? 0,
        visibleInMenu: payload.visibleInMenu ?? true,
        isActive: payload.isActive ?? true,
        parentId: parent?.id ?? null
      }
    });
  }

  async update(id: string, payload: UpsertSectionInput) {
    const current = await this.prisma.section.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Secao nao encontrada.");
    }

    const parent = await this.getParent(payload.parentId ?? current.parentId);
    const slug = this.toSlug(payload.slug ?? current.slug ?? payload.name);
    const path = this.buildPath(parent?.path, slug);

    await this.ensureUniqueSlugAndPath(slug, path, id);

    const section = await this.prisma.section.update({
      where: { id },
      data: {
        name: payload.name,
        slug,
        path,
        description: payload.description,
        order: payload.order ?? current.order,
        visibleInMenu: payload.visibleInMenu ?? current.visibleInMenu,
        isActive: payload.isActive ?? current.isActive,
        parentId: parent?.id ?? null
      }
    });

    await this.rebuildChildPaths(section.id, section.path);

    return section;
  }

  async remove(id: string) {
    const current = await this.prisma.section.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            children: true,
            contents: true
          }
        }
      }
    });

    if (!current) {
      throw new NotFoundException("Secao nao encontrada.");
    }

    if (current._count.children > 0 || current._count.contents > 0) {
      throw new BadRequestException("Nao e possivel excluir secoes com filhos ou conteudos associados.");
    }

    return this.prisma.section.delete({
      where: { id }
    });
  }

  private async getParent(parentId?: string | null) {
    if (!parentId) {
      return null;
    }

    const parent = await this.prisma.section.findUnique({
      where: { id: parentId }
    });

    if (!parent) {
      throw new BadRequestException("Secao pai nao encontrada.");
    }

    return parent;
  }

  private buildPath(parentPath: string | undefined, slug: string) {
    const base = parentPath?.replace(/\/+$/, "") ?? "";
    return `${base}/${slug}`;
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

  private async ensureUniqueSlugAndPath(slug: string, path: string, currentId?: string) {
    const existing = await this.prisma.section.findFirst({
      where: {
        OR: [{ slug }, { path }],
        ...(currentId ? { NOT: { id: currentId } } : {})
      }
    });

    if (existing) {
      throw new BadRequestException("Ja existe uma secao com o mesmo slug ou path.");
    }
  }

  private async rebuildChildPaths(parentId: string, parentPath: string) {
    const children = await this.prisma.section.findMany({
      where: { parentId },
      orderBy: { order: "asc" }
    });

    for (const child of children) {
      const nextPath = this.buildPath(parentPath, child.slug);
      await this.prisma.section.update({
        where: { id: child.id },
        data: {
          path: nextPath
        }
      });

      await this.rebuildChildPaths(child.id, nextPath);
    }
  }
}
