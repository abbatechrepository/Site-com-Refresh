import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../infra/prisma.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PermissionsGuard } from "./permissions.guard";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_ACCESS_SECRET"),
        signOptions: { expiresIn: "15m" }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtAuthGuard, PermissionsGuard, Reflector],
  exports: [AuthService, JwtAuthGuard, PermissionsGuard, JwtModule]
})
export class AuthModule {}
