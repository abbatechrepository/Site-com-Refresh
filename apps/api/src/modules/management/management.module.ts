import { Module } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma.service";
import { AuthModule } from "../auth/auth.module";
import { ManagementController } from "./management.controller";
import { ManagementNewslettersService } from "./management-newsletters.service";
import { ManagementSequenceService } from "./management-sequence.service";
import { ManagementService } from "./management.service";
import { ManagementUsersService } from "./management-users.service";
import { ManagementValidationService } from "./management.validation.service";

@Module({
  imports: [AuthModule],
  controllers: [ManagementController],
  providers: [
    ManagementService,
    ManagementValidationService,
    ManagementSequenceService,
    ManagementUsersService,
    ManagementNewslettersService,
    PrismaService
  ]
})
export class ManagementModule {}
