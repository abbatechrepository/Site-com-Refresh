import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaService } from "./infra/prisma.service";
import { HealthController } from "./modules/health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { SectionsModule } from "./modules/sections/sections.module";
import { ContentsModule } from "./modules/contents/contents.module";
import { TemplatesModule } from "./modules/templates/templates.module";
import { NewslettersModule } from "./modules/newsletters/newsletters.module";
import { PrivacyModule } from "./modules/privacy/privacy.module";
import { ManagementModule } from "./modules/management/management.module";
import { UploadService } from "./modules/upload/upload.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120
      }
    ]),
    AuthModule,
    SectionsModule,
    ContentsModule,
    TemplatesModule,
    NewslettersModule,
    PrivacyModule,
    ManagementModule
  ],
  controllers: [HealthController],
  providers: [PrismaService, UploadService]
})
export class AppModule {}
