import type { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

import { bootstrapAdminRole, bootstrapPermissions } from "./bootstrap.data";

type PermissionRecord = Awaited<ReturnType<PrismaClient["permission"]["findMany"]>>[number];
type RoleRecord = Awaited<ReturnType<PrismaClient["role"]["upsert"]>>;
type DisplayIdModelDelegate = {
  aggregate(args: { _max: { displayId: true } }): Promise<{ _max: { displayId: number | null } }>;
  findMany(args: {
    where: { displayId: null };
    select: { id: true };
    orderBy: { id: "asc" };
  }): Promise<Array<{ id: string }>>;
  update(args: { where: { id: string }; data: { displayId: number } }): Promise<unknown>;
};

async function seedPermissions(prisma: PrismaClient) {
  for (const permission of bootstrapPermissions) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        description: permission.description
      },
      create: permission
    });
  }

  const allPermissions = await prisma.permission.findMany();
  return new Map<string, PermissionRecord>(
    allPermissions.map((permission: PermissionRecord) => [permission.code, permission])
  );
}

async function seedAdminRole(
  prisma: PrismaClient,
  permissionByCode: Map<string, PermissionRecord>,
  resetMode: boolean
) {
  const role = await prisma.role.upsert({
    where: { name: bootstrapAdminRole.name },
    update: {
      description: bootstrapAdminRole.description,
      functionName: bootstrapAdminRole.functionName,
      status: "Ativo"
    },
    create: {
      name: bootstrapAdminRole.name,
      description: bootstrapAdminRole.description,
      functionName: bootstrapAdminRole.functionName,
      status: "Ativo"
    }
  });

  const [permissionCount, menuAccessCount] = await Promise.all([
    prisma.rolePermission.count({ where: { roleId: role.id } }),
    prisma.roleMenuAccess.count({ where: { roleId: role.id } })
  ]);
  const shouldSeedPermissions = resetMode || permissionCount === 0;
  const shouldSeedMenus = resetMode || menuAccessCount === 0;

  if (resetMode) {
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.roleMenuAccess.deleteMany({ where: { roleId: role.id } });
  }

  const permissionCodes =
    bootstrapAdminRole.permissionCodes ?? Array.from(permissionByCode.values()).map((permission) => permission.code);

  if (shouldSeedPermissions) {
    for (const permissionCode of permissionCodes) {
      const permission = permissionByCode.get(permissionCode);

      if (!permission) {
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id
        }
      });
    }
  }

  if (shouldSeedMenus) {
    for (const menuAccess of bootstrapAdminRole.menuAccesses) {
      await prisma.roleMenuAccess.upsert({
        where: {
          roleId_topMenu_viewKey: {
            roleId: role.id,
            topMenu: menuAccess.topMenu,
            viewKey: menuAccess.viewKey
          }
        },
        update: {},
        create: {
          roleId: role.id,
          topMenu: menuAccess.topMenu,
          viewKey: menuAccess.viewKey
        }
      });
    }
  }

  return role;
}

async function seedAdminUser(prisma: PrismaClient, adminRole: RoleRecord) {
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const configuredAdminUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase();

  if (!configuredAdminEmail) {
    const existingSuperAdmin = await prisma.user.findFirst({
      where: {
        isActive: true,
        isSuperAdmin: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    if (existingSuperAdmin) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: existingSuperAdmin.id,
            roleId: adminRole.id
          }
        },
        update: {},
        create: {
          userId: existingSuperAdmin.id,
          roleId: adminRole.id
        }
      });

      return existingSuperAdmin;
    }

    throw new Error("ADMIN_EMAIL deve ser configurado para criar o administrador inicial.");
  }

  const existing = await prisma.user.findUnique({
    where: { email: configuredAdminEmail }
  });

  const shouldResetPassword = process.env.ADMIN_RESET_PASSWORD === "true";
  const shouldHashPassword = !existing || shouldResetPassword;

  if (shouldHashPassword && !adminPassword) {
    throw new Error("ADMIN_PASSWORD deve ser configurado para criar ou redefinir o administrador inicial.");
  }

  const passwordHash = shouldHashPassword ? await hash(adminPassword!) : undefined;
  const adminUsername = configuredAdminUsername || configuredAdminEmail.split("@")[0] || "admin";

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: process.env.ADMIN_NAME || existing.name || "Administrador Abbatech",
          username: existing.username ?? adminUsername,
          isActive: true,
          isSuperAdmin: true,
          status: existing.status === "Excluído" ? "Ativo" : existing.status,
          consentVersion: existing.consentVersion ?? "1.0",
          ...(passwordHash ? { passwordHash } : {})
        }
      })
    : await prisma.user.create({
        data: {
          name: process.env.ADMIN_NAME || "Administrador Abbatech",
          email: configuredAdminEmail,
          username: adminUsername,
          cpf: process.env.ADMIN_CPF || null,
          passwordHash: passwordHash!,
          isActive: true,
          isSuperAdmin: true,
          status: "Ativo",
          consentVersion: "1.0",
          consentAt: new Date()
        }
      });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id
      }
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id
    }
  });

  return user;
}


async function backfillDisplayIdsFor(model: DisplayIdModelDelegate) {
  const aggregate = await model.aggregate({ _max: { displayId: true } });
  const records = await model.findMany({
    where: { displayId: null },
    select: { id: true },
    orderBy: { id: "asc" }
  });
  let nextDisplayId = (aggregate._max.displayId ?? 0) + 1;

  for (const record of records) {
    await model.update({
      where: { id: record.id },
      data: { displayId: nextDisplayId }
    });
    nextDisplayId += 1;
  }
}

async function backfillDisplayIds(prisma: PrismaClient) {
  const models = [
    prisma.user,
    prisma.role,
    prisma.permission,
    prisma.systemApplication,
    prisma.roleApplicationAccess,
    prisma.section,
    prisma.contentType,
    prisma.systemEmail,
    prisma.template,
    prisma.element,
    prisma.content,
    prisma.newsletterGroup,
    prisma.newsletterRecipient,
    prisma.newsletterCampaign,
    prisma.privacyRequest
  ] as unknown as DisplayIdModelDelegate[];

  for (const model of models) {
    await backfillDisplayIdsFor(model);
  }
}

export async function runBootstrapSeed(prisma: PrismaClient) {
  const resetMode = process.env.SEED_RESET === "true";
  const permissionByCode = await seedPermissions(prisma);
  const adminRole = await seedAdminRole(prisma, permissionByCode, resetMode);

  const adminUser = await seedAdminUser(prisma, adminRole);
  await backfillDisplayIds(prisma);

  return {
    adminEmail: adminUser.email
  };
}
