ALTER TABLE `User` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `User_legacyId_key` ON `User`(`legacyId`);

ALTER TABLE `Role` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `Role_legacyId_key` ON `Role`(`legacyId`);

ALTER TABLE `Permission` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `Permission_legacyId_key` ON `Permission`(`legacyId`);

ALTER TABLE `Section` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `Section_legacyId_key` ON `Section`(`legacyId`);

ALTER TABLE `ContentType` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `ContentType_legacyId_key` ON `ContentType`(`legacyId`);

ALTER TABLE `LegacyApplication` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `LegacyApplication_legacyId_key` ON `LegacyApplication`(`legacyId`);

ALTER TABLE `RoleApplicationAccess` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `RoleApplicationAccess_legacyId_key` ON `RoleApplicationAccess`(`legacyId`);

ALTER TABLE `SystemEmail` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `SystemEmail_legacyId_key` ON `SystemEmail`(`legacyId`);

ALTER TABLE `Template` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `Template_legacyId_key` ON `Template`(`legacyId`);

ALTER TABLE `Element` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `Element_legacyId_key` ON `Element`(`legacyId`);

ALTER TABLE `Content` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `Content_legacyId_key` ON `Content`(`legacyId`);

ALTER TABLE `ContentRevision` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `ContentRevision_legacyId_key` ON `ContentRevision`(`legacyId`);

ALTER TABLE `MediaAsset` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `MediaAsset_legacyId_key` ON `MediaAsset`(`legacyId`);

ALTER TABLE `SeoMetadata` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `SeoMetadata_legacyId_key` ON `SeoMetadata`(`legacyId`);

ALTER TABLE `NewsletterCampaign` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `NewsletterCampaign_legacyId_key` ON `NewsletterCampaign`(`legacyId`);

ALTER TABLE `NewsletterGroup` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `NewsletterGroup_legacyId_key` ON `NewsletterGroup`(`legacyId`);

ALTER TABLE `NewsletterRecipient` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `NewsletterRecipient_legacyId_key` ON `NewsletterRecipient`(`legacyId`);

ALTER TABLE `NewsletterDispatch` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `NewsletterDispatch_legacyId_key` ON `NewsletterDispatch`(`legacyId`);

ALTER TABLE `AuditLog` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `AuditLog_legacyId_key` ON `AuditLog`(`legacyId`);

ALTER TABLE `PrivacyRequest` ADD COLUMN `legacyId` INTEGER NULL;
CREATE UNIQUE INDEX `PrivacyRequest_legacyId_key` ON `PrivacyRequest`(`legacyId`);
