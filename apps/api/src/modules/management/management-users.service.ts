import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { hash } from "argon2";
import { PrismaService } from "../../infra/prisma.service";
import { UpsertUserInput } from "./management.types";
import { normalizeCpf } from "./management.utils";
import { ManagementSequenceService } from "./management-sequence.service";
import { ManagementValidationService } from "./management.validation.service";

@Injectable()
export class ManagementUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sequence: ManagementSequenceService,
    private readonly validation: ManagementValidationService
  ) {}

  async createUser(payload: UpsertUserInput) {
    await this.validation.ensureRoleIds(payload.roleIds ?? []);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedUsername = payload.username?.trim().toLowerCase() || null;
    const normalizedCpf = normalizeCpf(payload.cpf);

    await this.validation.ensureUniqueUserIdentity({
      email: normalizedEmail,
      username: normalizedUsername,
      cpf: normalizedCpf
    });

    const legacyStatus = payload.status?.trim() || "Novo";
    const isActive = !["Inativo", "Excluído"].includes(legacyStatus);
    if (!payload.password) {
      throw new BadRequestException("Informe uma senha temporaria para criar o usuario.");
    }

    const passwordHash = await hash(payload.password);

    return this.prisma.user.create({
      data: {
        legacyId: await this.sequence.nextFor("user"),
        name: payload.name,
        email: normalizedEmail,
        username: normalizedUsername,
        cpf: normalizedCpf,
        cnh: payload.cnh?.trim() || null,
        legacyStatus,
        company: payload.company?.trim() || null,
        jobTitle: payload.jobTitle?.trim() || null,
        phone: payload.phone?.trim() || null,
        address: payload.address?.trim() || null,
        zipCode: payload.zipCode?.trim() || null,
        city: payload.city?.trim() || null,
        state: payload.state?.trim() || null,
        secondaryAddress: payload.secondaryAddress?.trim() || null,
        secondaryNumber: payload.secondaryNumber?.trim() || null,
        secondaryComplement: payload.secondaryComplement?.trim() || null,
        neighborhood: payload.neighborhood?.trim() || null,
        notes: payload.notes?.trim() || null,
        facebook: payload.facebook?.trim() || null,
        instagram: payload.instagram?.trim() || null,
        youtube: payload.youtube?.trim() || null,
        forcePasswordChange: true,
        passwordHash,
        isActive,
        isSuperAdmin: payload.isSuperAdmin ?? false,
        consentVersion: "1.0",
        consentAt: new Date(),
        roles: {
          create: (payload.roleIds ?? []).map((roleId) => ({ roleId }))
        }
      },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });
  }

  async updateUser(id: string, payload: UpsertUserInput) {
    const current = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Usuario nao encontrado.");
    }

    await this.validation.ensureRoleIds(payload.roleIds ?? []);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedUsername = payload.username?.trim().toLowerCase() || null;
    const normalizedCpf = normalizeCpf(payload.cpf);

    await this.validation.ensureUniqueUserIdentity(
      {
        email: normalizedEmail,
        username: normalizedUsername,
        cpf: normalizedCpf
      },
      id
    );

    const legacyStatus = payload.status?.trim() || current.legacyStatus || "Novo";
    const isActive = !["Inativo", "Excluído"].includes(legacyStatus);
    const passwordHash = current.passwordHash === "LDAP" || !payload.password ? undefined : await hash(payload.password);

    return this.prisma.user.update({
      where: { id },
      data: {
        name: payload.name,
        email: normalizedEmail,
        username: normalizedUsername,
        cpf: normalizedCpf,
        cnh: payload.cnh?.trim() || null,
        legacyStatus,
        company: payload.company?.trim() || null,
        jobTitle: payload.jobTitle?.trim() || null,
        phone: payload.phone?.trim() || null,
        address: payload.address?.trim() || null,
        zipCode: payload.zipCode?.trim() || null,
        city: payload.city?.trim() || null,
        state: payload.state?.trim() || null,
        secondaryAddress: payload.secondaryAddress?.trim() || null,
        secondaryNumber: payload.secondaryNumber?.trim() || null,
        secondaryComplement: payload.secondaryComplement?.trim() || null,
        neighborhood: payload.neighborhood?.trim() || null,
        notes: payload.notes?.trim() || null,
        facebook: payload.facebook?.trim() || null,
        instagram: payload.instagram?.trim() || null,
        youtube: payload.youtube?.trim() || null,
        forcePasswordChange: payload.forcePasswordChange ?? current.forcePasswordChange ?? false,
        passwordHash,
        isActive,
        isSuperAdmin: payload.isSuperAdmin ?? current.isSuperAdmin,
        roles: {
          deleteMany: {},
          create: (payload.roleIds ?? []).map((roleId) => ({ roleId }))
        }
      },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });
  }

  async deleteUser(id: string) {
    const current = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            authoredContents: true,
            revisions: true,
            auditLogs: true,
            roles: true
          }
        }
      }
    });

    if (!current) {
      throw new NotFoundException("Usuario nao encontrado.");
    }

    const hasHistory =
      current._count.authoredContents > 0 || current._count.revisions > 0 || current._count.auditLogs > 0;

    if (!hasHistory) {
      return this.prisma.user.delete({ where: { id } });
    }

    const archiveSuffix = id.slice(-8);

    return this.prisma.user.update({
      where: { id },
      data: {
        name: `${current.name} (Excluído)`,
        email: `excluido+${archiveSuffix}@abbatech.dev.br`,
        username: current.username ? `excluido.${archiveSuffix}` : null,
        cpf: null,
        cnh: null,
        legacyStatus: "Excluído",
        isActive: false,
        isSuperAdmin: false,
        forcePasswordChange: false,
        company: null,
        jobTitle: null,
        phone: null,
        address: null,
        zipCode: null,
        city: null,
        state: null,
        secondaryAddress: null,
        secondaryNumber: null,
        secondaryComplement: null,
        neighborhood: null,
        notes: "Usuário arquivado automaticamente por possuir histórico vinculado.",
        facebook: null,
        instagram: null,
        youtube: null,
        roles: {
          deleteMany: {}
        }
      }
    });
  }
}
