import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma.service";
import { RoleMenuAccessInput, UpsertRoleInput, viewToApplicationName } from "./management.types";

@Injectable()
export class ManagementValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureUniqueContentType(slug: string, currentId?: string) {
    const existing = await this.prisma.contentType.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {})
      }
    });

    if (existing) {
      throw new BadRequestException("Ja existe uma mascara com este slug.");
    }
  }

  async ensureUniquePermission(code: string, currentId?: string) {
    const existing = await this.prisma.permission.findFirst({
      where: {
        code,
        ...(currentId ? { NOT: { id: currentId } } : {})
      }
    });

    if (existing) {
      throw new BadRequestException("Ja existe uma permissao com este codigo.");
    }
  }

  async ensureUniqueApplicationName(name: string, currentId?: string) {
    const existing = await this.prisma.systemApplication.findFirst({
      where: {
        name,
        ...(currentId ? { NOT: { id: currentId } } : {})
      }
    });

    if (existing) {
      throw new BadRequestException("Ja existe um aplicativo com este nome.");
    }
  }

  async ensureUniqueTemplate(slug: string, currentId?: string) {
    const existing = await this.prisma.template.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {})
      }
    });

    if (existing) {
      throw new BadRequestException("Ja existe um template com este slug.");
    }
  }

  async ensureUniqueNewsletterGroup(name: string, currentId?: string) {
    const existing = await this.prisma.newsletterGroup.findFirst({
      where: {
        name,
        ...(currentId ? { NOT: { id: currentId } } : {})
      }
    });

    if (existing) {
      throw new BadRequestException("Ja existe um grupo de newsletter com este nome.");
    }
  }

  async ensureUniqueNewsletterRecipient(email: string, currentId?: string) {
    const existing = await this.prisma.newsletterRecipient.findFirst({
      where: {
        email,
        ...(currentId ? { NOT: { id: currentId } } : {})
      }
    });

    if (existing) {
      throw new BadRequestException("Ja existe um destinatario com este e-mail.");
    }
  }

  async ensureNewsletterGroup(groupId?: string | null) {
    if (!groupId) {
      return;
    }

    const group = await this.prisma.newsletterGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      throw new BadRequestException("Grupo de newsletter invalido.");
    }
  }

  async ensureRolePermissions(permissionIds: string[]) {
    if (permissionIds.length === 0) {
      return;
    }

    const count = await this.prisma.permission.count({
      where: {
        id: {
          in: permissionIds
        }
      }
    });

    if (count !== permissionIds.length) {
      throw new BadRequestException("Uma ou mais permissoes sao invalidas.");
    }
  }

  async ensureRoleIds(roleIds: string[]) {
    if (roleIds.length === 0) {
      return;
    }

    const count = await this.prisma.role.count({
      where: {
        id: {
          in: roleIds
        }
      }
    });

    if (count !== roleIds.length) {
      throw new BadRequestException("Um ou mais grupos sao invalidos.");
    }
  }

  async ensureSectionIds(sectionIds: string[]) {
    if (sectionIds.length === 0) {
      return;
    }

    const count = await this.prisma.section.count({
      where: {
        id: {
          in: sectionIds
        }
      }
    });

    if (count !== sectionIds.length) {
      throw new BadRequestException("Uma ou mais secoes sao invalidas.");
    }
  }

  async ensureContentTypeIds(contentTypeIds: string[]) {
    if (contentTypeIds.length === 0) {
      return;
    }

    const count = await this.prisma.contentType.count({
      where: {
        id: {
          in: contentTypeIds
        }
      }
    });

    if (count !== contentTypeIds.length) {
      throw new BadRequestException("Uma ou mais mascaras sao invalidas.");
    }
  }

  async ensureParentRole(parentRoleId?: string, currentRoleId?: string) {
    if (!parentRoleId) {
      return;
    }

    if (currentRoleId && parentRoleId === currentRoleId) {
      throw new BadRequestException("Um grupo nao pode ser superior de si mesmo.");
    }

    const role = await this.prisma.role.findUnique({
      where: { id: parentRoleId }
    });

    if (!role) {
      throw new BadRequestException("Grupo superior invalido.");
    }
  }

  async ensureRoleApplication(roleId: string, appId: string, currentId?: string) {
    const [role, app, duplicate] = await Promise.all([
      this.prisma.role.findUnique({ where: { id: roleId } }),
      this.prisma.systemApplication.findUnique({ where: { id: appId } }),
      this.prisma.roleApplicationAccess.findFirst({
        where: {
          roleId,
          appId,
          ...(currentId ? { NOT: { id: currentId } } : {})
        }
      })
    ]);

    if (!role) {
      throw new BadRequestException("Grupo nao encontrado.");
    }

    if (!app) {
      throw new BadRequestException("Aplicativo nao encontrado.");
    }

    if (duplicate) {
      throw new BadRequestException("Ja existe permissao cadastrada para este grupo e aplicativo.");
    }
  }

  async ensureUniqueUserIdentity(
    identity: {
      email: string;
      username: string | null;
      cpf: string | null;
    },
    currentUserId?: string
  ) {
    const matches = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: identity.email },
          ...(identity.username ? [{ username: identity.username }] : []),
          ...(identity.cpf ? [{ cpf: identity.cpf }] : [])
        ]
      }
    });

    for (const match of matches) {
      if (currentUserId && match.id === currentUserId) {
        continue;
      }

      if (match.email === identity.email) {
        throw new BadRequestException("Ja existe um usuario com este e-mail.");
      }

      if (identity.username && match.username === identity.username) {
        throw new BadRequestException("Ja existe um usuario com este username.");
      }

      if (identity.cpf && match.cpf === identity.cpf) {
        throw new BadRequestException("Ja existe um usuario com este CPF.");
      }
    }
  }

  ensureRoleMenus(menuAccesses: RoleMenuAccessInput[]) {
    const uniqueViews = new Set<string>();

    for (const menuAccess of menuAccesses) {
      if (!menuAccess.topMenu || !menuAccess.viewKey) {
        throw new BadRequestException("Menu de grupo invalido.");
      }

      const compositeKey = `${menuAccess.topMenu}:${menuAccess.viewKey}`;

      if (uniqueViews.has(compositeKey)) {
        throw new BadRequestException("Existem views duplicadas no menu do grupo.");
      }

      uniqueViews.add(compositeKey);
    }
  }

  async resolveRoleApplicationAccesses(payload: UpsertRoleInput) {
    const requestedApplicationNames = new Set<string>();

    for (const menuAccess of payload.menuAccesses ?? []) {
      const applicationName = viewToApplicationName[menuAccess.viewKey];

      if (applicationName) {
        requestedApplicationNames.add(applicationName);
      }
    }

    if ((payload.contentTypeIds ?? []).length > 0) {
      requestedApplicationNames.add("Máscara");
    }

    if ((payload.sectionIds ?? []).length > 0) {
      requestedApplicationNames.add("Seção");
    }

    if (requestedApplicationNames.size === 0) {
      return [];
    }

    const applications = await this.prisma.systemApplication.findMany({
      where: {
        name: {
          in: Array.from(requestedApplicationNames)
        }
      }
    });

    return applications.map((application: (typeof applications)[number]) => ({
      appId: application.id,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canAccess: true
    }));
  }
}
