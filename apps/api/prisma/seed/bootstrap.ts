import type { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

import { bootstrapAdminRole, bootstrapApplications, bootstrapPermissions } from "./bootstrap.data";

type PermissionRecord = Awaited<ReturnType<PrismaClient["permission"]["findMany"]>>[number];
type RoleRecord = Awaited<ReturnType<PrismaClient["role"]["upsert"]>>;
type ApplicationRecord = Awaited<ReturnType<PrismaClient["legacyApplication"]["upsert"]>>;

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

  if (resetMode) {
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.roleMenuAccess.deleteMany({ where: { roleId: role.id } });
  }

  const permissionCodes =
    bootstrapAdminRole.permissionCodes ?? Array.from(permissionByCode.values()).map((permission) => permission.code);

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

  return role;
}

async function seedApplications(prisma: PrismaClient, adminRole: RoleRecord, resetMode: boolean) {
  const applicationMap = new Map<string, ApplicationRecord>();

  for (const application of bootstrapApplications) {
    const saved = await prisma.legacyApplication.upsert({
      where: { name: application.name },
      update: application,
      create: application
    });

    applicationMap.set(application.name, saved);
  }

  if (resetMode) {
    await prisma.roleApplicationAccess.deleteMany({
      where: { roleId: adminRole.id }
    });
  }

  for (const app of applicationMap.values()) {
    await prisma.roleApplicationAccess.upsert({
      where: {
        roleId_appId: {
          roleId: adminRole.id,
          appId: app.id
        }
      },
      update: {
        canCreate: app.name !== "Estatísticas",
        canUpdate: true,
        canDelete: true,
        canAccess: true
      },
      create: {
        roleId: adminRole.id,
        appId: app.id,
        canCreate: app.name !== "Estatísticas",
        canUpdate: true,
        canDelete: true,
        canAccess: true
      }
    });
  }
}

async function seedAdminUser(prisma: PrismaClient, adminRole: RoleRecord) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "admin@abbatech.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "Refresh123!";
  const adminUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase() || "admin";
  const passwordHash = await hash(adminPassword);
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: process.env.ADMIN_NAME || existing.name || "Administrador Abbatech",
          username: existing.username ?? adminUsername,
          isActive: true,
          isSuperAdmin: true,
          legacyStatus: existing.legacyStatus === "Excluído" ? "Ativo" : existing.legacyStatus,
          consentVersion: existing.consentVersion ?? "1.0",
          ...(process.env.ADMIN_RESET_PASSWORD === "true" ? { passwordHash } : {})
        }
      })
    : await prisma.user.create({
        data: {
          name: process.env.ADMIN_NAME || "Administrador Abbatech",
          email: adminEmail,
          username: adminUsername,
          cpf: process.env.ADMIN_CPF || null,
          passwordHash,
          isActive: true,
          isSuperAdmin: true,
          legacyStatus: "Ativo",
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

export async function runBootstrapSeed(prisma: PrismaClient) {
  const resetMode = process.env.SEED_RESET === "true";
  const permissionByCode = await seedPermissions(prisma);
  const adminRole = await seedAdminRole(prisma, permissionByCode, resetMode);

  await seedApplications(prisma, adminRole, resetMode);
  const adminUser = await seedAdminUser(prisma, adminRole);

  return {
    adminEmail: adminUser.email
  };
}
