import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma.service";
import { buildManagementBootstrap } from "./management.bootstrap";
import { ManagementNewslettersService } from "./management-newsletters.service";
import { ManagementSequenceService } from "./management-sequence.service";
import { ManagementUsersService } from "./management-users.service";
import {
  UpsertApplicationInput,
  UpsertContentTypeInput,
  UpsertElementInput,
  UpsertNewsletterCampaignInput,
  UpsertNewsletterGroupInput,
  UpsertNewsletterRecipientInput,
  UpsertPermissionInput,
  UpsertRoleApplicationAccessInput,
  UpsertRoleInput,
  UpsertSystemEmailInput,
  UpsertTemplateInput,
  UpsertUserInput
} from "./management.types";
import { toSlug } from "./management.utils";
import { ManagementValidationService } from "./management.validation.service";

@Injectable()
export class ManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validation: ManagementValidationService,
    private readonly sequence: ManagementSequenceService,
    private readonly users: ManagementUsersService,
    private readonly newsletters: ManagementNewslettersService
  ) {}

  async bootstrap() {
    return buildManagementBootstrap(this.prisma);
  }

  async createContentType(payload: UpsertContentTypeInput) {
    const slug = toSlug(payload.slug ?? payload.name);
    await this.validation.ensureUniqueContentType(slug);

    return this.prisma.contentType.create({
      data: {
        legacyId: await this.sequence.nextFor("contentType"),
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
        legacyId: await this.sequence.nextFor("permission"),
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
        legacyId: await this.sequence.nextFor("legacyApplication"),
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
        legacyId: await this.sequence.nextFor("roleApplicationAccess"),
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

    return this.prisma.role.create({
      data: {
        legacyId: await this.sequence.nextFor("role"),
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
    return this.users.createUser(payload);
  }

  async updateUser(id: string, payload: UpsertUserInput) {
    return this.users.updateUser(id, payload);
  }

  async deleteUser(id: string) {
    return this.users.deleteUser(id);
  }

  async createTemplate(payload: UpsertTemplateInput) {
    const slug = toSlug(payload.slug ?? payload.name);
    await this.validation.ensureUniqueTemplate(slug);

    return this.prisma.template.create({
      data: {
        legacyId: await this.sequence.nextFor("template"),
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
        legacyId: await this.sequence.nextFor("element"),
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
    return this.newsletters.createNewsletterGroup(payload);
  }

  async updateNewsletterGroup(id: string, payload: UpsertNewsletterGroupInput) {
    return this.newsletters.updateNewsletterGroup(id, payload);
  }

  async deleteNewsletterGroup(id: string) {
    return this.newsletters.deleteNewsletterGroup(id);
  }

  async createNewsletterRecipient(payload: UpsertNewsletterRecipientInput) {
    return this.newsletters.createNewsletterRecipient(payload);
  }

  async updateNewsletterRecipient(id: string, payload: UpsertNewsletterRecipientInput) {
    return this.newsletters.updateNewsletterRecipient(id, payload);
  }

  async deleteNewsletterRecipient(id: string) {
    return this.newsletters.deleteNewsletterRecipient(id);
  }

  async createNewsletterCampaign(payload: UpsertNewsletterCampaignInput) {
    return this.newsletters.createNewsletterCampaign(payload);
  }

  async updateNewsletterCampaign(id: string, payload: UpsertNewsletterCampaignInput) {
    return this.newsletters.updateNewsletterCampaign(id, payload);
  }

  async deleteNewsletterCampaign(id: string) {
    return this.newsletters.deleteNewsletterCampaign(id);
  }

  async createSystemEmail(payload: UpsertSystemEmailInput) {
    return this.prisma.systemEmail.create({
      data: {
        legacyId: await this.sequence.nextFor("systemEmail"),
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
