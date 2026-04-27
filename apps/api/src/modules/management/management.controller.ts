import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionsGuard } from "../auth/permissions.guard";
import { RequirePermissions } from "../auth/permissions.decorator";
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

import {
  UpsertApplicationDto,
  UpsertContentTypeDto,
  UpsertElementDto,
  UpsertNewsletterCampaignDto,
  UpsertNewsletterGroupDto,
  UpsertNewsletterRecipientDto,
  UpsertPermissionDto,
  UpsertRoleApplicationAccessDto,
  UpsertRoleDto,
  UpsertSystemEmailDto,
  UpsertTemplateDto,
  UpsertUserDto
} from "./management.dto";
import { ManagementService } from "./management.service";
import { UploadService } from "../upload/upload.service";

@Controller("management")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ManagementController {
  constructor(private readonly managementService: ManagementService, private readonly uploadService: UploadService) {}

  @Get("bootstrap")
  @RequirePermissions("management.read")
  bootstrap() {
    return this.managementService.bootstrap();
  }

  @Post("content-types")
  @RequirePermissions("contents.write")
  createContentType(@Body() body: UpsertContentTypeDto) {
    return this.managementService.createContentType(body);
  }

  @Patch("content-types/:id")
  @RequirePermissions("contents.write")
  updateContentType(@Param("id") id: string, @Body() body: UpsertContentTypeDto) {
    return this.managementService.updateContentType(id, body);
  }

  @Delete("content-types/:id")
  @RequirePermissions("contents.write")
  deleteContentType(@Param("id") id: string) {
    return this.managementService.deleteContentType(id);
  }

  @Post("permissions")
  @RequirePermissions("management.write")
  createPermission(@Body() body: UpsertPermissionDto) {
    return this.managementService.createPermission(body);
  }

  @Patch("permissions/:id")
  @RequirePermissions("management.write")
  updatePermission(@Param("id") id: string, @Body() body: UpsertPermissionDto) {
    return this.managementService.updatePermission(id, body);
  }

  @Delete("permissions/:id")
  @RequirePermissions("management.write")
  deletePermission(@Param("id") id: string) {
    return this.managementService.deletePermission(id);
  }

  @Post("applications")
  @RequirePermissions("management.write")
  createApplication(@Body() body: UpsertApplicationDto) {
    return this.managementService.createApplication(body);
  }

  @Patch("applications/:id")
  @RequirePermissions("management.write")
  updateApplication(@Param("id") id: string, @Body() body: UpsertApplicationDto) {
    return this.managementService.updateApplication(id, body);
  }

  @Delete("applications/:id")
  @RequirePermissions("management.write")
  deleteApplication(@Param("id") id: string) {
    return this.managementService.deleteApplication(id);
  }

  @Post("role-application-accesses")
  @RequirePermissions("management.write")
  createRoleApplicationAccess(@Body() body: UpsertRoleApplicationAccessDto) {
    return this.managementService.createRoleApplicationAccess(body);
  }

  @Patch("role-application-accesses/:id")
  @RequirePermissions("management.write")
  updateRoleApplicationAccess(@Param("id") id: string, @Body() body: UpsertRoleApplicationAccessDto) {
    return this.managementService.updateRoleApplicationAccess(id, body);
  }

  @Delete("role-application-accesses/:id")
  @RequirePermissions("management.write")
  deleteRoleApplicationAccess(@Param("id") id: string) {
    return this.managementService.deleteRoleApplicationAccess(id);
  }

  @Post("roles")
  @RequirePermissions("management.write")
  createRole(@Body() body: UpsertRoleDto) {
    return this.managementService.createRole(body);
  }

  @Patch("roles/:id")
  @RequirePermissions("management.write")
  updateRole(@Param("id") id: string, @Body() body: UpsertRoleDto) {
    return this.managementService.updateRole(id, body);
  }

  @Delete("roles/:id")
  @RequirePermissions("management.write")
  deleteRole(@Param("id") id: string) {
    return this.managementService.deleteRole(id);
  }

  @Post("users")
  @RequirePermissions("management.write")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
    })
  )
  createUser(
    @Body() body: UpsertUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file
      ? this.uploadService.saveUserImage(file, body.username)
      : undefined;

    if (imageUrl == null) {
      return {
        success: false,
        message: "Erro ao fazer upload da imagem"
      };
    }

    return this.managementService.createUser({
      ...body,
      picture: imageUrl
    });
  }

  @Patch("users/:id")
  @RequirePermissions("management.write")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
    })
  )
  updateUser(
    @Param("id") id: string,
    @Body() body: UpsertUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file
      ? this.uploadService.saveUserImage(file, body.username)
      : undefined;

    return this.managementService.updateUser(id, {
      ...body,
      ...(imageUrl && { picture: imageUrl }),
    });
  }

  @Delete("users/:id")
  @RequirePermissions("management.write")
  deleteUser(@Param("id") id: string) {
    return this.managementService.deleteUser(id);
  }

  @Post("templates")
  @RequirePermissions("management.write")
  createTemplate(@Body() body: UpsertTemplateDto) {
    return this.managementService.createTemplate(body);
  }

  @Patch("templates/:id")
  @RequirePermissions("management.write")
  updateTemplate(@Param("id") id: string, @Body() body: UpsertTemplateDto) {
    return this.managementService.updateTemplate(id, body);
  }

  @Delete("templates/:id")
  @RequirePermissions("management.write")
  deleteTemplate(@Param("id") id: string) {
    return this.managementService.deleteTemplate(id);
  }

  @Post("elements")
  @RequirePermissions("management.write")
  createElement(@Body() body: UpsertElementDto) {
    return this.managementService.createElement(body);
  }

  @Patch("elements/:id")
  @RequirePermissions("management.write")
  updateElement(@Param("id") id: string, @Body() body: UpsertElementDto) {
    return this.managementService.updateElement(id, body);
  }

  @Delete("elements/:id")
  @RequirePermissions("management.write")
  deleteElement(@Param("id") id: string) {
    return this.managementService.deleteElement(id);
  }

  @Post("newsletter-groups")
  @RequirePermissions("newsletters.write")
  createNewsletterGroup(@Body() body: UpsertNewsletterGroupDto) {
    return this.managementService.createNewsletterGroup(body);
  }

  @Patch("newsletter-groups/:id")
  @RequirePermissions("newsletters.write")
  updateNewsletterGroup(@Param("id") id: string, @Body() body: UpsertNewsletterGroupDto) {
    return this.managementService.updateNewsletterGroup(id, body);
  }

  @Delete("newsletter-groups/:id")
  @RequirePermissions("newsletters.write")
  deleteNewsletterGroup(@Param("id") id: string) {
    return this.managementService.deleteNewsletterGroup(id);
  }

  @Post("newsletter-recipients")
  @RequirePermissions("newsletters.write")
  createNewsletterRecipient(@Body() body: UpsertNewsletterRecipientDto) {
    return this.managementService.createNewsletterRecipient(body);
  }

  @Patch("newsletter-recipients/:id")
  @RequirePermissions("newsletters.write")
  updateNewsletterRecipient(@Param("id") id: string, @Body() body: UpsertNewsletterRecipientDto) {
    return this.managementService.updateNewsletterRecipient(id, body);
  }

  @Delete("newsletter-recipients/:id")
  @RequirePermissions("newsletters.write")
  deleteNewsletterRecipient(@Param("id") id: string) {
    return this.managementService.deleteNewsletterRecipient(id);
  }

  @Post("newsletter-campaigns")
  @RequirePermissions("newsletters.write")
  createNewsletterCampaign(@Body() body: UpsertNewsletterCampaignDto) {
    return this.managementService.createNewsletterCampaign(body);
  }

  @Patch("newsletter-campaigns/:id")
  @RequirePermissions("newsletters.write")
  updateNewsletterCampaign(@Param("id") id: string, @Body() body: UpsertNewsletterCampaignDto) {
    return this.managementService.updateNewsletterCampaign(id, body);
  }

  @Delete("newsletter-campaigns/:id")
  @RequirePermissions("newsletters.write")
  deleteNewsletterCampaign(@Param("id") id: string) {
    return this.managementService.deleteNewsletterCampaign(id);
  }

  @Post("system-emails")
  @RequirePermissions("management.write")
  createSystemEmail(@Body() body: UpsertSystemEmailDto) {
    return this.managementService.createSystemEmail(body);
  }

  @Patch("system-emails/:id")
  @RequirePermissions("management.write")
  updateSystemEmail(@Param("id") id: string, @Body() body: UpsertSystemEmailDto) {
    return this.managementService.updateSystemEmail(id, body);
  }

  @Delete("system-emails/:id")
  @RequirePermissions("management.write")
  deleteSystemEmail(@Param("id") id: string) {
    return this.managementService.deleteSystemEmail(id);
  }

  @Post("statistics/reset")
  @RequirePermissions("management.write")
  resetStatistics() {
    return this.managementService.resetStatistics();
  }
}
