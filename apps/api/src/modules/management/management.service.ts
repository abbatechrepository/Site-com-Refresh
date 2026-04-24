import { Injectable, NotFoundException } from "@nestjs/common";
import { hash } from "argon2";
import { PrismaService } from "../../infra/prisma.service";
import { buildManagementBootstrap } from "./management.bootstrap";
import {
  UpsertApplicationInput,
  UpsertContentTypeInput,
  UpsertElementInput,
  UpsertNewsletterGroupInput,
  UpsertPermissionInput,
  UpsertRoleApplicationAccessInput,
  UpsertRoleInput,
  UpsertSystemEmailInput,
  UpsertTemplateInput,
  UpsertUserInput
} from "./management.types";
import { normalizeCpf, toSlug } from "./management.utils";
import { ManagementValidationService } from "./management.validation.service";

@Injectable()
export class ManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validation: ManagementValidationService
  ) {}

  private async nextSequenceNumberFor<
    TModelName extends
      | "contentType"
      | "permission"
      | "legacyApplication"
      | "roleApplicationAccess"
      | "role"
      | "user"
      | "template"
      | "element"
      | "newsletterGroup"
      | "systemEmail"
  >(modelName: TModelName) {
    const aggregatePromise = (() => {
      switch (modelName) {
        case "contentType":
          return this.prisma.contentType.aggregate({ _max: { legacyId: true } });
        case "permission":
          return this.prisma.permission.aggregate({ _max: { legacyId: true } });
        case "legacyApplication":
          return this.prisma.legacyApplication.aggregate({ _max: { legacyId: true } });
        case "roleApplicationAccess":
          return this.prisma.roleApplicationAccess.aggregate({ _max: { legacyId: true } });
        case "role":
          return this.prisma.role.aggregate({ _max: { legacyId: true } });
        case "user":
          return this.prisma.user.aggregate({ _max: { legacyId: true } });
        case "template":
          return this.prisma.template.aggregate({ _max: { legacyId: true } });
        case "element":
          return this.prisma.element.aggregate({ _max: { legacyId: true } });
        case "newsletterGroup":
          return this.prisma.newsletterGroup.aggregate({ _max: { legacyId: true } });
        case "systemEmail":
          return this.prisma.systemEmail.aggregate({ _max: { legacyId: true } });
      }
    })();

    const aggregate = await aggregatePromise;
    return (aggregate._max.legacyId ?? 0) + 1;
  }

  async bootstrap() {
    return buildManagementBootstrap(this.prisma);
  }

  async createContentType(payload: UpsertContentTypeInput) {
    const slug = toSlug(payload.slug ?? payload.name);
    await this.validation.ensureUniqueContentType(slug);

    return this.prisma.contentType.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("contentType"),
        name: payload.name,
        slug,
        description: payload.description,
        allowRichText: payload.allowRichText ?? true,
        allowFeaturedMedia: payload.allowFeaturedMedia ?? true,
        schemaJson: (payload.schemaJson ?? { fields: ["title", "excerpt", "body", "seo"] }) as never
      }
    });
  }

  async updateContentType(id: string, payload: UpsertContentTypeInput) {
    const current = await this.prisma.contentType.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Mascara nao encontrada.");
    }

    const slug = toSlug(payload.slug ?? current.slug);
    await this.validation.ensureUniqueContentType(slug, id);

    return this.prisma.contentType.update({
      where: { id },
      data: {
        name: payload.name,
        slug,
        description: payload.description,
        allowRichText: payload.allowRichText ?? current.allowRichText,
        allowFeaturedMedia: payload.allowFeaturedMedia ?? current.allowFeaturedMedia,
        schemaJson: (payload.schemaJson ?? current.schemaJson) as never
      }
    });
  }

  async deleteContentType(id: string) {
    return this.prisma.contentType.delete({
      where: { id }
    });
  }

  async createPermission(payload: UpsertPermissionInput) {
    const code = payload.code.trim().toLowerCase();
    await this.validation.ensureUniquePermission(code);

    return this.prisma.permission.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("permission"),
        code,
        description: payload.description
      }
    });
  }

  async updatePermission(id: string, payload: UpsertPermissionInput) {
    const current = await this.prisma.permission.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Permissao nao encontrada.");
    }

    const code = payload.code.trim().toLowerCase();
    await this.validation.ensureUniquePermission(code, id);

    return this.prisma.permission.update({
      where: { id },
      data: {
        code,
        description: payload.description
      }
    });
  }

  async deletePermission(id: string) {
    return this.prisma.permission.delete({
      where: { id }
    });
  }

  async createApplication(payload: UpsertApplicationInput) {
    await this.validation.ensureUniqueApplicationName(payload.name);

    return this.prisma.legacyApplication.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("legacyApplication"),
        name: payload.name,
        area: payload.area,
        link: payload.link,
        description: payload.description
      }
    });
  }

  async updateApplication(id: string, payload: UpsertApplicationInput) {
    const current = await this.prisma.legacyApplication.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Aplicativo nao encontrado.");
    }

    await this.validation.ensureUniqueApplicationName(payload.name, id);

    return this.prisma.legacyApplication.update({
      where: { id },
      data: {
        name: payload.name,
        area: payload.area,
        link: payload.link,
        description: payload.description
      }
    });
  }

  async deleteApplication(id: string) {
    return this.prisma.legacyApplication.delete({
      where: { id }
    });
  }

  async createRoleApplicationAccess(payload: UpsertRoleApplicationAccessInput) {
    await this.validation.ensureRoleApplication(payload.roleId, payload.appId);

    return this.prisma.roleApplicationAccess.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("roleApplicationAccess"),
        roleId: payload.roleId,
        appId: payload.appId,
        canCreate: payload.canCreate ?? false,
        canUpdate: payload.canUpdate ?? false,
        canDelete: payload.canDelete ?? false,
        canAccess: payload.canAccess ?? true
      }
    });
  }

  async updateRoleApplicationAccess(id: string, payload: UpsertRoleApplicationAccessInput) {
    let current = await this.prisma.roleApplicationAccess.findUnique({
      where: { id }
    });

    if (!current) {
      current = await this.prisma.roleApplicationAccess.findFirst({
        where: {
          roleId: payload.roleId,
          appId: payload.appId
        }
      });
    }

    if (!current) {
      throw new NotFoundException("Permissao administrativa nao encontrada.");
    }

    await this.validation.ensureRoleApplication(payload.roleId, payload.appId, current.id);

    return this.prisma.roleApplicationAccess.update({
      where: { id: current.id },
      data: {
        roleId: payload.roleId,
        appId: payload.appId,
        canCreate: payload.canCreate ?? current.canCreate,
        canUpdate: payload.canUpdate ?? current.canUpdate,
        canDelete: payload.canDelete ?? current.canDelete,
        canAccess: payload.canAccess ?? current.canAccess
      }
    });
  }

  async deleteRoleApplicationAccess(id: string) {
    return this.prisma.roleApplicationAccess.delete({
      where: { id }
    });
  }

  async createRole(payload: UpsertRoleInput) {
    await this.validation.ensureRolePermissions(payload.permissionIds ?? []);
    await this.validation.ensureParentRole(payload.parentRoleId);
    await this.validation.ensureSectionIds(payload.sectionIds ?? []);
    await this.validation.ensureContentTypeIds(payload.contentTypeIds ?? []);
    this.validation.ensureRoleMenus(payload.menuAccesses ?? []);
    const appAccesses = await this.validation.resolveRoleApplicationAccesses(payload);

    return this.prisma.role.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("role"),
        name: payload.name,
        description: payload.description,
        functionName: payload.functionName,
        status: payload.status ?? "Ativo",
        parentRoleId: payload.parentRoleId,
        permissions: {
          create: (payload.permissionIds ?? []).map((permissionId) => ({
            permissionId
          }))
        },
        menuAccesses: {
          create: (payload.menuAccesses ?? []).map((menuAccess) => ({
            topMenu: menuAccess.topMenu,
            viewKey: menuAccess.viewKey
          }))
        },
        sectionAccesses: {
          create: (payload.sectionIds ?? []).map((sectionId) => ({
            sectionId
          }))
        },
        contentTypeAccesses: {
          create: (payload.contentTypeIds ?? []).map((contentTypeId) => ({
            contentTypeId
          }))
        },
        appAccesses: {
          create: appAccesses
        }
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        menuAccesses: true
      }
    });
  }

  async updateRole(id: string, payload: UpsertRoleInput) {
    const current = await this.prisma.role.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Grupo nao encontrado.");
    }

    await this.validation.ensureRolePermissions(payload.permissionIds ?? []);
    await this.validation.ensureParentRole(payload.parentRoleId, id);
    await this.validation.ensureSectionIds(payload.sectionIds ?? []);
    await this.validation.ensureContentTypeIds(payload.contentTypeIds ?? []);
    this.validation.ensureRoleMenus(payload.menuAccesses ?? []);
    const appAccesses = await this.validation.resolveRoleApplicationAccesses(payload);

    return this.prisma.role.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description,
        functionName: payload.functionName,
        status: payload.status ?? current.status,
        parentRoleId: payload.parentRoleId,
        permissions: {
          deleteMany: {},
          create: (payload.permissionIds ?? []).map((permissionId) => ({
            permissionId
          }))
        },
        menuAccesses: {
          deleteMany: {},
          create: (payload.menuAccesses ?? []).map((menuAccess) => ({
            topMenu: menuAccess.topMenu,
            viewKey: menuAccess.viewKey
          }))
        },
        sectionAccesses: {
          deleteMany: {},
          create: (payload.sectionIds ?? []).map((sectionId) => ({
            sectionId
          }))
        },
        contentTypeAccesses: {
          deleteMany: {},
          create: (payload.contentTypeIds ?? []).map((contentTypeId) => ({
            contentTypeId
          }))
        },
        appAccesses: {
          deleteMany: {},
          create: appAccesses
        }
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        menuAccesses: true
      }
    });
  }

  async deleteRole(id: string) {
    return this.prisma.role.delete({
      where: { id }
    });
  }

  async createUser(payload: UpsertUserInput) {
    await this.validation.ensureRoleIds(payload.roleIds ?? []);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedUsername = payload.username?.trim().toLowerCase() || null;
    const normalizedCpf = normalizeCpf(payload.cpf);
    await this.validation.ensureUniqueUserIdentity({
      email: normalizedEmail,
      username: normalizedUsername,
      cpf: normalizedCpf
    });

    const legacyStatus = payload.status?.trim() || "Novo";
    const isActive = !["Inativo", "Excluído"].includes(legacyStatus);

    const passwordHash = await hash(payload.password ?? "123456");

    return this.prisma.user.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("user"),
        name: payload.name,
        email: normalizedEmail,
        username: normalizedUsername,
        cpf: normalizedCpf,
        cnh: payload.cnh?.trim() || null,
        legacyStatus,
        company: payload.company?.trim() || null,
        jobTitle: payload.jobTitle?.trim() || null,
        phone: payload.phone?.trim() || null,
        address: payload.address?.trim() || null,
        zipCode: payload.zipCode?.trim() || null,
        city: payload.city?.trim() || null,
        state: payload.state?.trim() || null,
        secondaryAddress: payload.secondaryAddress?.trim() || null,
        secondaryNumber: payload.secondaryNumber?.trim() || null,
        secondaryComplement: payload.secondaryComplement?.trim() || null,
        neighborhood: payload.neighborhood?.trim() || null,
        notes: payload.notes?.trim() || null,
        facebook: payload.facebook?.trim() || null,
        instagram: payload.instagram?.trim() || null,
        youtube: payload.youtube?.trim() || null,
        forcePasswordChange: payload.forcePasswordChange ?? false,
        passwordHash,
        isActive,
        isSuperAdmin: payload.isSuperAdmin ?? false,
        consentVersion: "1.0",
        consentAt: new Date(),
        roles: {
          create: (payload.roleIds ?? []).map((roleId) => ({
            roleId
          }))
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async updateUser(id: string, payload: UpsertUserInput) {
    const current = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Usuario nao encontrado.");
    }

    await this.validation.ensureRoleIds(payload.roleIds ?? []);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedUsername = payload.username?.trim().toLowerCase() || null;
    const normalizedCpf = normalizeCpf(payload.cpf);
    await this.validation.ensureUniqueUserIdentity(
      {
        email: normalizedEmail,
        username: normalizedUsername,
        cpf: normalizedCpf
      },
      id
    );

    const legacyStatus =
      payload.status?.trim() || current.legacyStatus || "Novo";
    const isActive = !["Inativo", "Excluído"].includes(legacyStatus);
    const passwordHash =
      current.passwordHash === "LDAP" || !payload.password
        ? undefined
        : await hash(payload.password);

    return this.prisma.user.update({
      where: { id },
      data: {
        name: payload.name,
        email: normalizedEmail,
        username: normalizedUsername,
        cpf: normalizedCpf,
        cnh: payload.cnh?.trim() || null,
        legacyStatus,
        company: payload.company?.trim() || null,
        jobTitle: payload.jobTitle?.trim() || null,
        phone: payload.phone?.trim() || null,
        address: payload.address?.trim() || null,
        zipCode: payload.zipCode?.trim() || null,
        city: payload.city?.trim() || null,
        state: payload.state?.trim() || null,
        secondaryAddress: payload.secondaryAddress?.trim() || null,
        secondaryNumber: payload.secondaryNumber?.trim() || null,
        secondaryComplement: payload.secondaryComplement?.trim() || null,
        neighborhood: payload.neighborhood?.trim() || null,
        notes: payload.notes?.trim() || null,
        facebook: payload.facebook?.trim() || null,
        instagram: payload.instagram?.trim() || null,
        youtube: payload.youtube?.trim() || null,
        forcePasswordChange:
          payload.forcePasswordChange ??
          current.forcePasswordChange ??
          false,
        passwordHash,
        isActive,
        isSuperAdmin: payload.isSuperAdmin ?? current.isSuperAdmin,
        roles: {
          deleteMany: {},
          create: (payload.roleIds ?? []).map((roleId) => ({
            roleId
          }))
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async deleteUser(id: string) {
    const current = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            authoredContents: true,
            revisions: true,
            auditLogs: true,
            roles: true
          }
        }
      }
    });

    if (!current) {
      throw new NotFoundException("Usuario nao encontrado.");
    }

    const hasHistory =
      current._count.authoredContents > 0 ||
      current._count.revisions > 0 ||
      current._count.auditLogs > 0;

    if (!hasHistory) {
      return this.prisma.user.delete({
        where: { id }
      });
    }

    const archiveSuffix = id.slice(-8);

    return this.prisma.user.update({
      where: { id },
      data: {
        name: `${current.name} (Excluído)`,
        email: `excluido+${archiveSuffix}@abbatech.local`,
        username: current.username ? `excluido.${archiveSuffix}` : null,
        cpf: null,
        cnh: null,
        legacyStatus: "Excluído",
        isActive: false,
        isSuperAdmin: false,
        forcePasswordChange: false,
        company: null,
        jobTitle: null,
        phone: null,
        address: null,
        zipCode: null,
        city: null,
        state: null,
        secondaryAddress: null,
        secondaryNumber: null,
        secondaryComplement: null,
        neighborhood: null,
        notes: "Usuário arquivado automaticamente por possuir histórico vinculado.",
        facebook: null,
        instagram: null,
        youtube: null,
        roles: {
          deleteMany: {}
        }
      }
    });
  }

  async createTemplate(payload: UpsertTemplateInput) {
    const slug = toSlug(payload.slug ?? payload.name);
    await this.validation.ensureUniqueTemplate(slug);

    return this.prisma.template.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("template"),
        name: payload.name,
        slug,
        description: payload.description,
        componentKey: payload.componentKey ?? slug,
        configSchema: (payload.configSchema ?? { layout: "default" }) as never,
        isActive: payload.isActive ?? true
      }
    });
  }

  async updateTemplate(id: string, payload: UpsertTemplateInput) {
    const current = await this.prisma.template.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Template nao encontrado.");
    }

    const slug = toSlug(payload.slug ?? current.slug);
    await this.validation.ensureUniqueTemplate(slug, id);

    return this.prisma.template.update({
      where: { id },
      data: {
        name: payload.name,
        slug,
        description: payload.description,
        componentKey: payload.componentKey ?? current.componentKey,
        configSchema: (payload.configSchema ?? current.configSchema) as never,
        isActive: payload.isActive ?? current.isActive
      }
    });
  }

  async deleteTemplate(id: string) {
    return this.prisma.template.delete({
      where: { id }
    });
  }

  async createElement(payload: UpsertElementInput) {
    return this.prisma.element.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("element"),
        name: payload.name,
        thumbLabel: payload.thumbLabel,
        content: payload.content ?? "",
        status: payload.status ?? "active",
        category: payload.category
      }
    });
  }

  async updateElement(id: string, payload: UpsertElementInput) {
    const current = await this.prisma.element.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Elemento nao encontrado.");
    }

    return this.prisma.element.update({
      where: { id },
      data: {
        name: payload.name,
        thumbLabel: payload.thumbLabel,
        content: payload.content ?? current.content,
        status: payload.status ?? current.status,
        category: payload.category
      }
    });
  }

  async deleteElement(id: string) {
    return this.prisma.element.delete({
      where: { id }
    });
  }

  async createNewsletterGroup(payload: UpsertNewsletterGroupInput) {
    return this.prisma.newsletterGroup.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("newsletterGroup"),
        name: payload.name,
        description: payload.description
      }
    });
  }

  async updateNewsletterGroup(id: string, payload: UpsertNewsletterGroupInput) {
    const current = await this.prisma.newsletterGroup.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Grupo de newsletter nao encontrado.");
    }

    return this.prisma.newsletterGroup.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description
      }
    });
  }

  async createSystemEmail(payload: UpsertSystemEmailInput) {
    return this.prisma.systemEmail.create({
      data: {
        legacyId: await this.nextSequenceNumberFor("systemEmail"),
        name: payload.name,
        email: payload.email.trim().toLowerCase(),
        area: payload.area,
        description: payload.description,
        value: payload.value
      }
    });
  }

  async updateSystemEmail(id: string, payload: UpsertSystemEmailInput) {
    const current = await this.prisma.systemEmail.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Email do sistema nao encontrado.");
    }

    return this.prisma.systemEmail.update({
      where: { id },
      data: {
        name: payload.name,
        email: payload.email.trim().toLowerCase(),
        area: payload.area,
        description: payload.description,
        value: payload.value
      }
    });
  }

  async deleteSystemEmail(id: string) {
    return this.prisma.systemEmail.delete({
      where: { id }
    });
  }

  async resetStatistics() {
    await this.prisma.section.updateMany({
      data: {
        visits: 0
      }
    });

    return { success: true };
  }
}
