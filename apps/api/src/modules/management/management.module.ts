import { Module } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma.service";
import { AuthModule } from "../auth/auth.module";
import { ManagementController } from "./management.controller";
import { ManagementService } from "./management.service";
import { ManagementValidationService } from "./management.validation.service";

@Module({
  imports: [AuthModule],
  controllers: [ManagementController],
  providers: [ManagementService, ManagementValidationService, PrismaService]
})
export class ManagementModule {}
