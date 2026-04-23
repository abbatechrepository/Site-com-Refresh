import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

import { applicationDefinitions, permissions, roleAccessDefinitions, roleDefinitions } from "./seed/access.data";
import { contents, sections, seedContentTypes, seedElements, seedTemplates, visitSeeds } from "./seed/content.data";
import { launchCampaign, newsletterGroups, newsletterRecipients } from "./seed/newsletter.data";
import { createSeedUsers, systemEmails } from "./seed/system.data";

const prisma = new PrismaClient();

async function seedPermissions() {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        description: permission.description
      },
      create: permission
    });
  }

  const allPermissions = await prisma.permission.findMany();
  return new Map(allPermissions.map((permission) => [permission.code, permission]));
}

async function seedRoles(
  permissionByCode: Map<string, Awaited<ReturnType<typeof prisma.permission.findMany>>[number]>,
  resetMode: boolean
) {
  const allPermissions = Array.from(permissionByCode.values());
  const roleMap = new Map<string, Awaited<ReturnType<typeof prisma.role.upsert>>>();

  for (const roleDefinition of roleDefinitions) {
    const role = await prisma.role.upsert({
      where: { name: roleDefinition.name },
      update: {
        description: roleDefinition.description,
        functionName: roleDefinition.functionName,
        status: "Ativo"
      },
      create: {
        name: roleDefinition.name,
        description: roleDefinition.description,
        functionName: roleDefinition.functionName,
        status: "Ativo"
      }
    });

    roleMap.set(role.name, role);

    if (resetMode) {
      await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
      await prisma.roleMenuAccess.deleteMany({ where: { roleId: role.id } });
    }

    const permissionCodes = roleDefinition.permissionCodes ?? allPermissions.map((permission) => permission.code);

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

    for (const menuAccess of roleDefinition.menuAccesses) {
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

  return roleMap;
}

async function seedApplications(roleMap: Map<string, Awaited<ReturnType<typeof prisma.role.upsert>>>, resetMode: boolean) {
  const applicationMap = new Map<string, Awaited<ReturnType<typeof prisma.legacyApplication.upsert>>>();

  for (const application of applicationDefinitions) {
    const saved = await prisma.legacyApplication.upsert({
      where: { name: application.name },
      update: application,
      create: application
    });

    applicationMap.set(application.name, saved);
  }

  if (resetMode) {
    await prisma.roleApplicationAccess.deleteMany({});
  }

  for (const access of roleAccessDefinitions) {
    const role = roleMap.get(access.role);
    const app = applicationMap.get(access.app);

    if (!role || !app) {
      continue;
    }

    await prisma.roleApplicationAccess.upsert({
      where: {
        roleId_appId: {
          roleId: role.id,
          appId: app.id
        }
      },
      update: resetMode
        ? {
            canCreate: access.canCreate,
            canUpdate: access.canUpdate,
            canDelete: access.canDelete,
            canAccess: access.canAccess
          }
        : {},
      create: {
        roleId: role.id,
        appId: app.id,
        canCreate: access.canCreate,
        canUpdate: access.canUpdate,
        canDelete: access.canDelete,
        canAccess: access.canAccess
      }
    });
  }
}

async function seedContentCatalog() {
  const contentTypeMap = new Map<string, Awaited<ReturnType<typeof prisma.contentType.upsert>>>();
  const templateMap = new Map<string, Awaited<ReturnType<typeof prisma.template.upsert>>>();

  for (const entry of seedContentTypes) {
    const saved = await prisma.contentType.upsert({
      where: { slug: entry.slug },
      update: entry,
      create: entry
    });

    contentTypeMap.set(entry.slug, saved);
  }

  for (const templateEntry of seedTemplates) {
    const savedTemplate = await prisma.template.upsert({
      where: { slug: templateEntry.slug },
      update: {
        ...templateEntry,
        isActive: true
      },
      create: {
        ...templateEntry,
        isActive: true
      }
    });

    templateMap.set(templateEntry.slug, savedTemplate);
  }

  for (const element of seedElements) {
    const existing = await prisma.element.findFirst({
      where: { name: element.name }
    });

    if (existing) {
      await prisma.element.update({
        where: { id: existing.id },
        data: element
      });
      continue;
    }

    await prisma.element.create({
      data: element
    });
  }

  return { contentTypeMap, templateMap };
}

async function seedSections(resetMode: boolean, roleMap: Map<string, Awaited<ReturnType<typeof prisma.role.upsert>>>, contentTypeMap: Map<string, Awaited<ReturnType<typeof prisma.contentType.upsert>>>) {
  const sectionMap = new Map<string, Awaited<ReturnType<typeof prisma.section.upsert>>>();

  for (const section of sections) {
    const parent = section.parentSlug ? sectionMap.get(section.parentSlug) ?? null : null;
    const path = parent ? `${parent.path}/${section.slug}` : `/${section.slug}`;

    const saved = await prisma.section.upsert({
      where: { slug: section.slug },
      update: {
        name: section.name,
        description: section.description,
        order: section.order,
        parentId: parent?.id ?? null,
        path,
        visibleInMenu: true,
        isActive: true
      },
      create: {
        name: section.name,
        slug: section.slug,
        description: section.description,
        order: section.order,
        parentId: parent?.id ?? null,
        path,
        visibleInMenu: true,
        isActive: true
      }
    });

    sectionMap.set(section.slug, saved);
  }

  for (const [slug, visits] of visitSeeds.entries()) {
    const section = sectionMap.get(slug);

    if (!section) {
      continue;
    }

    await prisma.section.update({
      where: { id: section.id },
      data: { visits }
    });
  }

  if (resetMode) {
    await prisma.roleSectionAccess.deleteMany({});
    await prisma.roleContentTypeAccess.deleteMany({});
  }

  const adminRole = roleMap.get("Administrador");
  const developerRole = roleMap.get("Desenvolvedor");
  const publisherRole = roleMap.get("Publicador Geral");
  const editorRole = roleMap.get("Editor");

  for (const role of [adminRole, developerRole, publisherRole, editorRole]) {
    if (!role) {
      continue;
    }

    for (const section of sectionMap.values()) {
      await prisma.roleSectionAccess.upsert({
        where: {
          roleId_sectionId: {
            roleId: role.id,
            sectionId: section.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          sectionId: section.id
        }
      });
    }
  }

  for (const role of [adminRole, developerRole]) {
    if (!role) {
      continue;
    }

    for (const contentType of contentTypeMap.values()) {
      await prisma.roleContentTypeAccess.upsert({
        where: {
          roleId_contentTypeId: {
            roleId: role.id,
            contentTypeId: contentType.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          contentTypeId: contentType.id
        }
      });
    }
  }

  for (const role of [publisherRole, editorRole]) {
    if (!role) {
      continue;
    }

    for (const slug of ["pagina-editorial", "mascara-institucional"]) {
      const contentType = contentTypeMap.get(slug);

      if (!contentType) {
        continue;
      }

      await prisma.roleContentTypeAccess.upsert({
        where: {
          roleId_contentTypeId: {
            roleId: role.id,
            contentTypeId: contentType.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          contentTypeId: contentType.id
        }
      });
    }
  }

  return sectionMap;
}

async function seedSystemUsers(roleMap: Map<string, Awaited<ReturnType<typeof prisma.role.upsert>>>, resetMode: boolean) {
  for (const systemEmail of systemEmails) {
    const existing = await prisma.systemEmail.findFirst({
      where: {
        name: systemEmail.name
      }
    });

    if (existing) {
      await prisma.systemEmail.update({
        where: { id: existing.id },
        data: systemEmail
      });
      continue;
    }

    await prisma.systemEmail.create({
      data: systemEmail
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@abbatech.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Refresh123!";
  const seedUsers = createSeedUsers(adminEmail, adminPassword);
  let adminUserId = "";

  for (const seedUser of seedUsers) {
    const passwordHash = await hash(seedUser.password);
    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      update: {
        name: seedUser.name,
        username: seedUser.username,
        cpf: seedUser.cpf,
        passwordHash,
        isActive: true,
        isSuperAdmin: seedUser.isSuperAdmin,
        consentVersion: "1.0"
      },
      create: {
        name: seedUser.name,
        email: seedUser.email,
        username: seedUser.username,
        cpf: seedUser.cpf,
        passwordHash,
        isActive: true,
        isSuperAdmin: seedUser.isSuperAdmin,
        consentVersion: "1.0",
        consentAt: new Date()
      }
    });

    if (seedUser.email === adminEmail) {
      adminUserId = user.id;
    }

    if (resetMode) {
      await prisma.userRole.deleteMany({
        where: { userId: user.id }
      });
    }

    for (const roleName of seedUser.roleNames) {
      const role = roleMap.get(roleName);

      if (!role) {
        continue;
      }

      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id
        }
      });
    }
  }

  return adminUserId;
}

async function seedNewsletter() {
  const newsletterGroupMap = new Map<string, Awaited<ReturnType<typeof prisma.newsletterGroup.upsert>>>();

  for (const group of newsletterGroups) {
    const saved = await prisma.newsletterGroup.upsert({
      where: { name: group.name },
      update: group,
      create: group
    });

    newsletterGroupMap.set(group.name, saved);
  }

  for (const recipient of newsletterRecipients) {
    const group = newsletterGroupMap.get(recipient.groupName);

    if (!group) {
      continue;
    }

    await prisma.newsletterRecipient.upsert({
      where: { email: recipient.email },
      update: {
        name: recipient.name,
        groupId: group.id,
        consentAt: new Date()
      },
      create: {
        email: recipient.email,
        name: recipient.name,
        groupId: group.id,
        consentAt: new Date()
      }
    });
  }

  const leadGroup = newsletterGroupMap.get("Leads portal");

  if (!leadGroup) {
    return;
  }

  const existingCampaign = await prisma.newsletterCampaign.findFirst({
    where: { name: launchCampaign.name }
  });

  if (existingCampaign) {
    await prisma.newsletterCampaign.update({
      where: { id: existingCampaign.id },
      data: {
        ...launchCampaign,
        recipientGroupId: leadGroup.id
      }
    });
    return;
  }

  await prisma.newsletterCampaign.create({
    data: {
      ...launchCampaign,
      recipientGroupId: leadGroup.id
    }
  });
}

async function seedContents(
  adminUserId: string,
  sectionMap: Map<string, Awaited<ReturnType<typeof prisma.section.upsert>>>,
  contentTypeMap: Map<string, Awaited<ReturnType<typeof prisma.contentType.upsert>>>,
  templateId: string
) {
  for (const content of contents) {
    const section = sectionMap.get(content.sectionSlug);
    const contentType = contentTypeMap.get(content.contentTypeSlug);

    if (!section) {
      throw new Error(`Secao nao encontrada para o seed: ${content.sectionSlug}`);
    }

    if (!contentType) {
      throw new Error(`Mascara nao encontrada para o seed: ${content.contentTypeSlug}`);
    }

    const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100"}/${content.slug}`;
    const existing = await prisma.content.findUnique({
      where: { slug: content.slug },
      include: {
        seo: true
      }
    });

    const seo = existing?.seo
      ? await prisma.seoMetadata.update({
          where: { id: existing.seo.id },
          data: {
            title: content.title,
            description: content.seoDescription,
            keywords: content.keywords,
            canonicalUrl,
            robots: "index,follow"
          }
        })
      : await prisma.seoMetadata.create({
          data: {
            title: content.title,
            description: content.seoDescription,
            keywords: content.keywords,
            canonicalUrl,
            robots: "index,follow"
          }
        });

    const savedContent = existing
      ? await prisma.content.update({
          where: { id: existing.id },
          data: {
            title: content.title,
            excerpt: content.excerpt,
            body: content.body.join("\n\n"),
            status: "published",
            visibility: "public",
            publishedAt: existing.publishedAt ?? new Date(),
            sectionId: section.id,
            contentTypeId: contentType.id,
            templateId,
            seoId: seo.id,
            authorId: adminUserId
          }
        })
      : await prisma.content.create({
          data: {
            title: content.title,
            slug: content.slug,
            excerpt: content.excerpt,
            body: content.body.join("\n\n"),
            status: "published",
            visibility: "public",
            publishedAt: new Date(),
            sectionId: section.id,
            contentTypeId: contentType.id,
            templateId,
            seoId: seo.id,
            authorId: adminUserId
          }
        });

    const latestRevision = await prisma.contentRevision.findFirst({
      where: { contentId: savedContent.id },
      orderBy: { createdAt: "desc" }
    });

    const snapshot = {
      title: savedContent.title,
      slug: savedContent.slug,
      excerpt: savedContent.excerpt,
      body: savedContent.body,
      status: savedContent.status
    };

    if (!latestRevision || JSON.stringify(latestRevision.snapshot) !== JSON.stringify(snapshot)) {
      await prisma.contentRevision.create({
        data: {
          contentId: savedContent.id,
          editorId: adminUserId,
          snapshot
        }
      });
    }
  }
}

async function seedPrivacyRequests() {
  const privacyCount = await prisma.privacyRequest.count();

  if (privacyCount > 0) {
    return;
  }

  await prisma.privacyRequest.createMany({
    data: [
      {
        type: "access",
        subjectEmail: "titular@abbatech.local",
        description: "Exemplo inicial de solicitacao LGPD"
      },
      {
        type: "delete",
        subjectEmail: "remocao@abbatech.local",
        description: "Pedido de exclusao de dados em homologacao"
      }
    ]
  });
}

async function main() {
  const resetMode = process.env.SEED_RESET === "true";
  const permissionByCode = await seedPermissions();
  const roleMap = await seedRoles(permissionByCode, resetMode);

  await seedApplications(roleMap, resetMode);

  const { contentTypeMap, templateMap } = await seedContentCatalog();
  const sectionMap = await seedSections(resetMode, roleMap, contentTypeMap);
  const adminUserId = await seedSystemUsers(roleMap, resetMode);

  await seedNewsletter();

  const template = templateMap.get("pagina-padrao");

  if (!template) {
    throw new Error("Template base nao encontrado no seed.");
  }

  await seedContents(adminUserId, sectionMap, contentTypeMap, template.id);
  await seedPrivacyRequests();

  process.stdout.write(`Seed concluido. Admin: ${process.env.ADMIN_EMAIL ?? "admin@abbatech.local"}\n`);
}

main()
  .catch(async (error) => {
    process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
