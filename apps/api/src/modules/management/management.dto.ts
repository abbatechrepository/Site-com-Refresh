import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested
} from "class-validator";

export class UpsertContentTypeDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  allowRichText?: boolean;

  @IsOptional()
  @IsBoolean()
  allowFeaturedMedia?: boolean;

  @IsOptional()
  @IsObject()
  schemaJson?: Record<string, unknown>;
}

export class UpsertPermissionDto {
  @IsString()
  @MinLength(3)
  code!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpsertApplicationDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  area!: string;

  @IsString()
  @MinLength(2)
  link!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpsertRoleApplicationAccessDto {
  @IsString()
  @MinLength(1)
  roleId!: string;

  @IsString()
  @MinLength(1)
  appId!: string;

  @IsOptional()
  @IsBoolean()
  canCreate?: boolean;

  @IsOptional()
  @IsBoolean()
  canUpdate?: boolean;

  @IsOptional()
  @IsBoolean()
  canDelete?: boolean;

  @IsOptional()
  @IsBoolean()
  canAccess?: boolean;
}

export class RoleMenuAccessDto {
  @IsString()
  topMenu!: string;

  @IsString()
  viewKey!: string;
}

export class UpsertRoleDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  functionName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  parentRoleId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleMenuAccessDto)
  menuAccesses?: RoleMenuAccessDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sectionIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contentTypeIds?: string[];
}

export class UpsertUserDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsEmail()
  @MinLength(3)
  email!: string;

  @IsString()
  @MinLength(3)
  username!: string;

  @IsOptional()
  @IsString()
  @MinLength(11)
  cpf?: string;

  @IsOptional()
  @IsString()
  cnh?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  secondaryAddress?: string;

  @IsOptional()
  @IsString()
  secondaryNumber?: string;

  @IsOptional()
  @IsString()
  secondaryComplement?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  youtube?: string;

  @IsOptional()
  @IsBoolean()
  forcePasswordChange?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isSuperAdmin?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleIds?: string[];
}

export class UpsertNewsletterGroupDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpsertNewsletterRecipientDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @MinLength(1)
  groupId!: string;

  @IsOptional()
  @IsString()
  consentAt?: string;

  @IsOptional()
  @IsString()
  unsubscribedAt?: string;
}

export class UpsertNewsletterCampaignDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  subject!: string;

  @IsString()
  @MinLength(2)
  senderName!: string;

  @IsString()
  @IsEmail()
  senderEmail!: string;

  @IsString()
  @MinLength(2)
  bodyHtml!: string;

  @IsOptional()
  @IsString()
  bodyText?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  sentAt?: string;

  @IsOptional()
  @IsString()
  recipientGroupId?: string;
}

export class UpsertSystemEmailDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(3)
  email!: string;

  @IsString()
  @MinLength(2)
  area!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  value?: string;
}

export class UpsertTemplateDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  componentKey?: string;

  @IsOptional()
  @IsObject()
  configSchema?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpsertElementDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  thumbLabel?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
