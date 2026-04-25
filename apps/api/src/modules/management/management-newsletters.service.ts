import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma.service";
import {
  UpsertNewsletterCampaignInput,
  UpsertNewsletterGroupInput,
  UpsertNewsletterRecipientInput
} from "./management.types";
import { ManagementSequenceService } from "./management-sequence.service";
import { ManagementValidationService } from "./management.validation.service";

@Injectable()
export class ManagementNewslettersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sequence: ManagementSequenceService,
    private readonly validation: ManagementValidationService
  ) {}

  async createNewsletterGroup(payload: UpsertNewsletterGroupInput) {
    await this.validation.ensureUniqueNewsletterGroup(payload.name);

    return this.prisma.newsletterGroup.create({
      data: {
        legacyId: await this.sequence.nextFor("newsletterGroup"),
        name: payload.name,
        description: payload.description
      }
    });
  }

  async updateNewsletterGroup(id: string, payload: UpsertNewsletterGroupInput) {
    const current = await this.prisma.newsletterGroup.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Grupo de newsletter nao encontrado.");
    }

    await this.validation.ensureUniqueNewsletterGroup(payload.name, id);

    return this.prisma.newsletterGroup.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description
      }
    });
  }

  async deleteNewsletterGroup(id: string) {
    const current = await this.prisma.newsletterGroup.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Grupo de newsletter nao encontrado.");
    }

    await this.prisma.newsletterCampaign.updateMany({
      where: { recipientGroupId: id },
      data: { recipientGroupId: null }
    });

    return this.prisma.newsletterGroup.delete({
      where: { id }
    });
  }

  async createNewsletterRecipient(payload: UpsertNewsletterRecipientInput) {
    const email = payload.email.trim().toLowerCase();
    await this.validation.ensureNewsletterGroup(payload.groupId);
    await this.validation.ensureUniqueNewsletterRecipient(email);

    return this.prisma.newsletterRecipient.create({
      data: {
        legacyId: await this.sequence.nextFor("newsletterRecipient"),
        email,
        name: payload.name?.trim() || null,
        groupId: payload.groupId,
        consentAt: this.parseNullableDate(payload.consentAt) ?? new Date(),
        unsubscribedAt: this.parseNullableDate(payload.unsubscribedAt)
      },
      include: { group: true }
    });
  }

  async updateNewsletterRecipient(id: string, payload: UpsertNewsletterRecipientInput) {
    const current = await this.prisma.newsletterRecipient.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Destinatario de newsletter nao encontrado.");
    }

    const email = payload.email.trim().toLowerCase();
    await this.validation.ensureNewsletterGroup(payload.groupId);
    await this.validation.ensureUniqueNewsletterRecipient(email, id);

    return this.prisma.newsletterRecipient.update({
      where: { id },
      data: {
        email,
        name: payload.name?.trim() || null,
        groupId: payload.groupId,
        consentAt:
          payload.consentAt === undefined ? current.consentAt : this.parseNullableDate(payload.consentAt),
        unsubscribedAt:
          payload.unsubscribedAt === undefined
            ? current.unsubscribedAt
            : this.parseNullableDate(payload.unsubscribedAt)
      },
      include: { group: true }
    });
  }

  async deleteNewsletterRecipient(id: string) {
    return this.prisma.newsletterRecipient.delete({
      where: { id }
    });
  }

  async createNewsletterCampaign(payload: UpsertNewsletterCampaignInput) {
    await this.validation.ensureNewsletterGroup(payload.recipientGroupId);

    return this.prisma.newsletterCampaign.create({
      data: {
        legacyId: await this.sequence.nextFor("newsletterCampaign"),
        name: payload.name,
        subject: payload.subject,
        senderName: payload.senderName,
        senderEmail: payload.senderEmail.trim().toLowerCase(),
        bodyHtml: payload.bodyHtml,
        bodyText: payload.bodyText,
        status: payload.status ?? "draft",
        scheduledAt: this.parseNullableDate(payload.scheduledAt),
        sentAt: this.parseNullableDate(payload.sentAt),
        recipientGroupId: payload.recipientGroupId || null
      },
      include: {
        recipientGroup: true,
        _count: { select: { dispatches: true } }
      }
    });
  }

  async updateNewsletterCampaign(id: string, payload: UpsertNewsletterCampaignInput) {
    const current = await this.prisma.newsletterCampaign.findUnique({
      where: { id }
    });

    if (!current) {
      throw new NotFoundException("Campanha de newsletter nao encontrada.");
    }

    await this.validation.ensureNewsletterGroup(payload.recipientGroupId);

    return this.prisma.newsletterCampaign.update({
      where: { id },
      data: {
        name: payload.name,
        subject: payload.subject,
        senderName: payload.senderName,
        senderEmail: payload.senderEmail.trim().toLowerCase(),
        bodyHtml: payload.bodyHtml,
        bodyText: payload.bodyText,
        status: payload.status ?? current.status,
        scheduledAt:
          payload.scheduledAt === undefined ? current.scheduledAt : this.parseNullableDate(payload.scheduledAt),
        sentAt: payload.sentAt === undefined ? current.sentAt : this.parseNullableDate(payload.sentAt),
        recipientGroupId: payload.recipientGroupId || null
      },
      include: {
        recipientGroup: true,
        _count: { select: { dispatches: true } }
      }
    });
  }

  async deleteNewsletterCampaign(id: string) {
    return this.prisma.newsletterCampaign.delete({
      where: { id }
    });
  }

  private parseNullableDate(value?: string) {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException("Data de newsletter invalida.");
    }

    return date;
  }
}
