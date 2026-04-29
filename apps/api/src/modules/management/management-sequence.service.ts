import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma.service";

type SequencedModelName =
  | "contentType"
  | "permission"
  | "systemApplication"
  | "roleApplicationAccess"
  | "role"
  | "user"
  | "template"
  | "element"
  | "newsletterGroup"
  | "newsletterRecipient"
  | "newsletterCampaign"
  | "systemEmail";

@Injectable()
export class ManagementSequenceService {
  constructor(private readonly prisma: PrismaService) {}

  async nextFor(modelName: SequencedModelName) {
    const aggregate = await this.getAggregate(modelName);
    return (aggregate._max.displayId ?? 0) + 1;
  }

  private getAggregate(modelName: SequencedModelName) {
    switch (modelName) {
      case "contentType":
        return this.prisma.contentType.aggregate({ _max: { displayId: true } });
      case "permission":
        return this.prisma.permission.aggregate({ _max: { displayId: true } });
      case "systemApplication":
        return this.prisma.systemApplication.aggregate({ _max: { displayId: true } });
      case "roleApplicationAccess":
        return this.prisma.roleApplicationAccess.aggregate({ _max: { displayId: true } });
      case "role":
        return this.prisma.role.aggregate({ _max: { displayId: true } });
      case "user":
        return this.prisma.user.aggregate({ _max: { displayId: true } });
      case "template":
        return this.prisma.template.aggregate({ _max: { displayId: true } });
      case "element":
        return this.prisma.element.aggregate({ _max: { displayId: true } });
      case "newsletterGroup":
        return this.prisma.newsletterGroup.aggregate({ _max: { displayId: true } });
      case "newsletterRecipient":
        return this.prisma.newsletterRecipient.aggregate({ _max: { displayId: true } });
      case "newsletterCampaign":
        return this.prisma.newsletterCampaign.aggregate({ _max: { displayId: true } });
      case "systemEmail":
        return this.prisma.systemEmail.aggregate({ _max: { displayId: true } });
    }
  }
}
