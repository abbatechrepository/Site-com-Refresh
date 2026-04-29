RENAME TABLE `LegacyApplication` TO `SystemApplication`;

ALTER TABLE `SystemApplication` DROP INDEX `LegacyApplication_legacyId_key`;
ALTER TABLE `SystemApplication` DROP INDEX `LegacyApplication_name_key`;
ALTER TABLE `SystemApplication` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `SystemApplication_displayId_key` ON `SystemApplication`(`displayId`);
CREATE UNIQUE INDEX `SystemApplication_name_key` ON `SystemApplication`(`name`);

ALTER TABLE `User` DROP INDEX `User_legacyId_key`;
ALTER TABLE `User` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
ALTER TABLE `User` CHANGE COLUMN `legacyStatus` `status` VARCHAR(191) NOT NULL DEFAULT 'Novo';
CREATE UNIQUE INDEX `User_displayId_key` ON `User`(`displayId`);

ALTER TABLE `Role` DROP INDEX `Role_legacyId_key`;
ALTER TABLE `Role` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `Role_displayId_key` ON `Role`(`displayId`);

ALTER TABLE `Permission` DROP INDEX `Permission_legacyId_key`;
ALTER TABLE `Permission` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `Permission_displayId_key` ON `Permission`(`displayId`);

ALTER TABLE `Section` DROP INDEX `Section_legacyId_key`;
ALTER TABLE `Section` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `Section_displayId_key` ON `Section`(`displayId`);

ALTER TABLE `ContentType` DROP INDEX `ContentType_legacyId_key`;
ALTER TABLE `ContentType` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `ContentType_displayId_key` ON `ContentType`(`displayId`);

ALTER TABLE `RoleApplicationAccess` DROP INDEX `RoleApplicationAccess_legacyId_key`;
ALTER TABLE `RoleApplicationAccess` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `RoleApplicationAccess_displayId_key` ON `RoleApplicationAccess`(`displayId`);

ALTER TABLE `SystemEmail` DROP INDEX `SystemEmail_legacyId_key`;
ALTER TABLE `SystemEmail` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `SystemEmail_displayId_key` ON `SystemEmail`(`displayId`);

ALTER TABLE `Template` DROP INDEX `Template_legacyId_key`;
ALTER TABLE `Template` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `Template_displayId_key` ON `Template`(`displayId`);

ALTER TABLE `Element` DROP INDEX `Element_legacyId_key`;
ALTER TABLE `Element` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `Element_displayId_key` ON `Element`(`displayId`);

ALTER TABLE `Content` DROP INDEX `Content_legacyId_key`;
ALTER TABLE `Content` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `Content_displayId_key` ON `Content`(`displayId`);

ALTER TABLE `ContentRevision` DROP INDEX `ContentRevision_legacyId_key`;
ALTER TABLE `ContentRevision` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `ContentRevision_displayId_key` ON `ContentRevision`(`displayId`);

ALTER TABLE `MediaAsset` DROP INDEX `MediaAsset_legacyId_key`;
ALTER TABLE `MediaAsset` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `MediaAsset_displayId_key` ON `MediaAsset`(`displayId`);

ALTER TABLE `SeoMetadata` DROP INDEX `SeoMetadata_legacyId_key`;
ALTER TABLE `SeoMetadata` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `SeoMetadata_displayId_key` ON `SeoMetadata`(`displayId`);

ALTER TABLE `NewsletterCampaign` DROP INDEX `NewsletterCampaign_legacyId_key`;
ALTER TABLE `NewsletterCampaign` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `NewsletterCampaign_displayId_key` ON `NewsletterCampaign`(`displayId`);

ALTER TABLE `NewsletterGroup` DROP INDEX `NewsletterGroup_legacyId_key`;
ALTER TABLE `NewsletterGroup` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `NewsletterGroup_displayId_key` ON `NewsletterGroup`(`displayId`);

ALTER TABLE `NewsletterRecipient` DROP INDEX `NewsletterRecipient_legacyId_key`;
ALTER TABLE `NewsletterRecipient` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `NewsletterRecipient_displayId_key` ON `NewsletterRecipient`(`displayId`);

ALTER TABLE `NewsletterDispatch` DROP INDEX `NewsletterDispatch_legacyId_key`;
ALTER TABLE `NewsletterDispatch` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `NewsletterDispatch_displayId_key` ON `NewsletterDispatch`(`displayId`);

ALTER TABLE `AuditLog` DROP INDEX `AuditLog_legacyId_key`;
ALTER TABLE `AuditLog` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `AuditLog_displayId_key` ON `AuditLog`(`displayId`);

ALTER TABLE `PrivacyRequest` DROP INDEX `PrivacyRequest_legacyId_key`;
ALTER TABLE `PrivacyRequest` CHANGE COLUMN `legacyId` `displayId` INTEGER NULL;
CREATE UNIQUE INDEX `PrivacyRequest_displayId_key` ON `PrivacyRequest`(`displayId`);
