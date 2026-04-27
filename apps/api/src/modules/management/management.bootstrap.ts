import { PrismaService } from "../../infra/prisma.service";

export async function buildManagementBootstrap(prisma: PrismaService) {
  const [
    contentTypes,
    users,
    roles,
    permissions,
    applications,
    roleApplicationAccesses,
    systemEmails,
    templates,
    elements,
    newsletterGroups,
    newsletterRecipients,
    newsletterCampaigns,
    privacyRequests
  ] = await Promise.all([
    prisma.contentType.findMany({
      include: {
        _count: {
          select: {
            contents: true
          }
        }
      },
      orderBy: [{ name: "asc" }]
    }),
    prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        },
        _count: {
          select: {
            authoredContents: true,
            revisions: true
          }
        }
      },
      orderBy: [{ createdAt: "desc" }]
    }),
    prisma.role.findMany({
      include: {
        parentRole: true,
        permissions: {
          include: {
            permission: true
          }
        },
        menuAccesses: true,
        appAccesses: {
          include: {
            app: true
          }
        },
        sectionAccesses: true,
        contentTypeAccesses: true,
        users: {
          include: {
            user: true
          }
        }
      },
      orderBy: [{ name: "asc" }]
    }),
    prisma.permission.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      orderBy: [{ code: "asc" }]
    }),
    prisma.legacyApplication.findMany({
      orderBy: [{ area: "asc" }, { name: "asc" }]
    }),
    prisma.roleApplicationAccess.findMany({
      include: {
        role: true,
        app: true
      },
      orderBy: [{ role: { name: "asc" } }, { app: { name: "asc" } }]
    }),
    prisma.systemEmail.findMany({
      orderBy: [{ area: "asc" }, { name: "asc" }]
    }),
    prisma.template.findMany({
      orderBy: [{ name: "asc" }]
    }),
    prisma.element.findMany({
      orderBy: [{ name: "asc" }]
    }),
    prisma.newsletterGroup.findMany({
      include: {
        _count: {
          select: {
            recipients: true,
            campaigns: true
          }
        }
      },
      orderBy: [{ createdAt: "asc" }]
    }),
    prisma.newsletterRecipient.findMany({
      include: {
        group: true,
        _count: {
          select: {
            dispatches: true
          }
        }
      },
      orderBy: [{ createdAt: "desc" }]
    }),
    prisma.newsletterCampaign.findMany({
      include: {
        recipientGroup: true,
        _count: {
          select: {
            dispatches: true
          }
        }
      },
      orderBy: [{ createdAt: "desc" }]
    }),
    prisma.privacyRequest.findMany({
      orderBy: [{ createdAt: "desc" }]
    })
  ]);

  return {
    contentTypes,
    users: users.map((user: (typeof users)[number] & Record<string, unknown>) => ({
      id: user.id,
      legacyId: (user.legacyId as number | undefined) ?? null,
      name: user.name,
      email: user.email,
      username: user.username,
      cpf: user.cpf,
      picture: user.picture,
      cnh: (user.cnh as string | null | undefined) ?? null,
      status: (user.legacyStatus as string | null | undefined) ?? (user.isActive ? "Ativo" : "Inativo"),
      company: (user.company as string | null | undefined) ?? null,
      jobTitle: (user.jobTitle as string | null | undefined) ?? null,
      phone: (user.phone as string | null | undefined) ?? null,
      address: (user.address as string | null | undefined) ?? null,
      zipCode: (user.zipCode as string | null | undefined) ?? null,
      city: (user.city as string | null | undefined) ?? null,
      state: (user.state as string | null | undefined) ?? null,
      secondaryAddress: (user.secondaryAddress as string | null | undefined) ?? null,
      secondaryNumber: (user.secondaryNumber as string | null | undefined) ?? null,
      secondaryComplement: (user.secondaryComplement as string | null | undefined) ?? null,
      neighborhood: (user.neighborhood as string | null | undefined) ?? null,
      notes: (user.notes as string | null | undefined) ?? null,
      facebook: (user.facebook as string | null | undefined) ?? null,
      instagram: (user.instagram as string | null | undefined) ?? null,
      youtube: (user.youtube as string | null | undefined) ?? null,
      forcePasswordChange: Boolean(user.forcePasswordChange),
      isActive: user.isActive,
      isSuperAdmin: user.isSuperAdmin,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      roles: user.roles.map((entry: (typeof user.roles)[number]) => entry.role),
      stats: user._count
    })),
    roles: roles.map((role: (typeof roles)[number]) => ({
      id: role.id,
      legacyId: role.legacyId,
      name: role.name,
      description: role.description,
      functionName: role.functionName,
      status: role.status,
      parentRoleId: role.parentRoleId,
      parentRoleName: role.parentRole?.name ?? null,
      permissions: role.permissions.map((entry: (typeof role.permissions)[number]) => entry.permission),
      menuAccesses: role.menuAccesses,
      appAccesses: role.appAccesses.map((entry: (typeof role.appAccesses)[number]) => ({
        id: entry.id,
        appId: entry.appId,
        appName: entry.app.name,
        area: entry.app.area,
        canCreate: entry.canCreate,
        canUpdate: entry.canUpdate,
        canDelete: entry.canDelete,
        canAccess: entry.canAccess
      })),
      sectionIds: role.sectionAccesses.map((entry: (typeof role.sectionAccesses)[number]) => entry.sectionId),
      contentTypeIds: role.contentTypeAccesses.map(
        (entry: (typeof role.contentTypeAccesses)[number]) => entry.contentTypeId
      ),
      users: role.users.map((entry: (typeof role.users)[number]) => ({
        id: entry.user.id,
        name: entry.user.name,
        email: entry.user.email
      }))
    })),
    permissions: permissions.map((permission: (typeof permissions)[number]) => ({
      id: permission.id,
      legacyId: permission.legacyId,
      code: permission.code,
      description: permission.description,
      roles: permission.roles.map((entry: (typeof permission.roles)[number]) => ({
        id: entry.role.id,
        name: entry.role.name
      }))
    })),
    applications,
    roleApplicationAccesses: roleApplicationAccesses.map((entry: (typeof roleApplicationAccesses)[number]) => ({
      id: entry.id,
      legacyId: entry.legacyId,
      roleId: entry.roleId,
      roleName: entry.role.name,
      appId: entry.appId,
      appName: entry.app.name,
      area: entry.app.area,
      canCreate: entry.canCreate,
      canUpdate: entry.canUpdate,
      canDelete: entry.canDelete,
      canAccess: entry.canAccess
    })),
    systemEmails,
    templates,
    elements,
    newsletterGroups,
    newsletterRecipients: newsletterRecipients.map((recipient: (typeof newsletterRecipients)[number]) => ({
      id: recipient.id,
      legacyId: recipient.legacyId,
      email: recipient.email,
      name: recipient.name,
      groupId: recipient.groupId,
      groupName: recipient.group.name,
      consentAt: recipient.consentAt,
      unsubscribedAt: recipient.unsubscribedAt,
      createdAt: recipient.createdAt,
      dispatchCount: recipient._count.dispatches
    })),
    newsletterCampaigns,
    privacyRequests
  };
}
