import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { verify } from "argon2";
import { createHash } from "crypto";
import { PrismaService } from "../../infra/prisma.service";
import type { AuthenticatedUser } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(identifier: string, password: string, roleId?: string) {
    const normalizedIdentifier = identifier.trim();
    const normalizedIdentifierLower = normalizedIdentifier.toLowerCase();

    if (!normalizedIdentifier) {
      throw new UnauthorizedException("Informe username, e-mail ou CPF.");
    }

    const normalizedCpf = this.normalizeCpf(normalizedIdentifier);
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedIdentifierLower },
          { username: normalizedIdentifierLower },
          { cpf: normalizedCpf },
          { name: normalizedIdentifier }
        ]
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                },
                menuAccesses: true,
                appAccesses: {
                  include: {
                    app: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !(await this.verifyStoredPassword(user.passwordHash, password))) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    if (!user.isActive || ["Inativo", "Excluído"].includes(user.legacyStatus)) {
      throw new UnauthorizedException("Usuario inativo.");
    }

    const activeRole = this.resolveActiveRole(user.roles, roleId);
    const permissions = activeRole
      ? activeRole.permissions.map(
          (permissionEntry: (typeof activeRole.permissions)[number]) => permissionEntry.permission.code
        )
      : [];

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date()
      }
    });

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        username: user.username,
        cpf: user.cpf,
        permissions,
        roleId: activeRole?.id
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        cpf: user.cpf,
        permissions,
        activeRoleId: activeRole?.id ?? null
      }
    };
  }

  async switchProfile(authenticatedUser: AuthenticatedUser, roleId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: authenticatedUser.sub },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException("Usuario nao encontrado.");
    }

    const activeRole = this.resolveActiveRole(user.roles, roleId);

    if (!activeRole) {
      throw new UnauthorizedException("Usuario sem perfil vinculado.");
    }

    const permissions = activeRole.permissions.map(
      (permissionEntry: (typeof activeRole.permissions)[number]) => permissionEntry.permission.code
    );

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        username: user.username,
        cpf: user.cpf,
        permissions,
        roleId: activeRole.id
      })
    };
  }

  async getCurrentUser(authenticatedUser: AuthenticatedUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: authenticatedUser.sub },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                },
                menuAccesses: true,
                appAccesses: {
                  include: {
                    app: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException("Usuario nao encontrado.");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      cpf: user.cpf,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      permissions: authenticatedUser.permissions,
      activeRoleId: authenticatedUser.roleId ?? user.roles[0]?.role.id ?? null,
      roles: user.roles.map((entry: (typeof user.roles)[number]) => ({
        id: entry.role.id,
        name: entry.role.name,
        description: entry.role.description,
        functionName: entry.role.functionName,
        status: entry.role.status,
        menuAccesses: entry.role.menuAccesses,
        appAccesses: entry.role.appAccesses.map((access: (typeof entry.role.appAccesses)[number]) => ({
          id: access.id,
          name: access.app.name,
          area: access.app.area,
          link: access.app.link,
          canCreate: access.canCreate,
          canUpdate: access.canUpdate,
          canDelete: access.canDelete,
          canAccess: access.canAccess
        })),
        permissions: entry.role.permissions.map(
          (rolePermission: (typeof entry.role.permissions)[number]) => rolePermission.permission.code
        )
      }))
    };
  }

  private resolveActiveRole(
    roles: Array<{
      role: {
        id: string;
        permissions: Array<{
          permission: {
            code: string;
          };
        }>;
      };
    }>,
    roleId?: string
  ) {
    if (roles.length === 0) {
      if (roleId) {
        throw new UnauthorizedException("Perfil solicitado nao pertence ao usuario.");
      }

      return null;
    }

    const match = roleId ? roles.find((entry) => entry.role.id === roleId) : roles[0];

    if (!match) {
      throw new UnauthorizedException("Perfil solicitado nao pertence ao usuario.");
    }

    return match.role;
  }

  private async verifyStoredPassword(storedPasswordHash: string, password: string) {
    try {
      return await verify(storedPasswordHash, password);
    } catch {
      const sha1Password = createHash("sha1").update(password).digest("hex");
      return storedPasswordHash === password || storedPasswordHash === sha1Password;
    }
  }

  private normalizeCpf(value: string) {
    const digits = value.replace(/\D/g, "");
    return digits.length > 0 ? digits : value;
  }
}
