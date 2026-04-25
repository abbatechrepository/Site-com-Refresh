"use client";

import { emptyContentForm, emptySectionForm } from "../_lib/constants";
import { formatDate, formatTime } from "../_lib/utils";
import type {
  ApplicationRecord,
  Content,
  ContentFormState,
  ContentType,
  ManagedElement,
  ManagedUser,
  NewsletterCampaign,
  NewsletterGroup,
  NewsletterRecipient,
  Permission,
  Role,
  RoleApplicationAccessRecord,
  Section,
  SystemEmailRecord,
  Template
} from "../_lib/types";
import type { useRefreshManagerState } from "./useRefreshManagerState";

type RefreshManagerState = ReturnType<typeof useRefreshManagerState>;

export function useRefreshManagerEditors(state: RefreshManagerState) {
  function resetContentForm() {
    state.setContentForm({
      ...emptyContentForm,
      sectionId: state.meta.sections[0]?.id || "",
      contentTypeId: state.meta.contentTypes[0]?.id || "",
      templateId: state.meta.templates[0]?.id || ""
    });
  }

  function selectContent(content: Content) {
    state.setContentForm({
      id: content.id,
      title: content.title,
      slug: content.slug,
      excerpt: content.excerpt ?? "",
      body: content.body ?? "",
      status: content.status as ContentFormState["status"],
      visibility: content.visibility as ContentFormState["visibility"],
      sectionId: content.sectionId,
      contentTypeId: content.contentTypeId,
      templateId: content.templateId ?? "",
      seoTitle: content.seo?.title ?? "",
      seoDescription: content.seo?.description ?? "",
      seoKeywords: content.seo?.keywords ?? "",
      seoCanonicalUrl: content.seo?.canonicalUrl ?? "",
      seoRobots: content.seo?.robots ?? "index,follow",
      publishDate: formatDate(content.publishedAt),
      publishTime: formatTime(content.publishedAt),
      startDate: formatDate(content.publishedAt),
      endDate: "21/04/2027"
    });
    state.setTopMenu("content");
    state.setView("content-editor");
  }

  function openNewContent() {
    resetContentForm();
    state.setTopMenu("content");
    state.setView("content-editor");
  }

  function openNewSection() {
    state.setSectionForm(emptySectionForm);
    state.setEditingSectionId("");
    state.setTopMenu("content");
    state.setView("section-editor");
  }

  function editSection(section: Section) {
    state.setEditingSectionId(section.id);
    state.setSectionForm({
      name: section.name,
      slug: section.slug,
      description: section.description ?? "",
      order: String(section.order),
      parentId: section.parentId ?? "",
      visibleInMenu: section.visibleInMenu,
      isActive: section.isActive
    });
    state.setTopMenu("content");
    state.setView("section-editor");
  }

  function editContentType(contentType: ContentType) {
    state.setContentTypeForm({
      id: contentType.id,
      name: contentType.name,
      slug: contentType.slug,
      description: contentType.description ?? "",
      allowRichText: contentType.allowRichText,
      allowFeaturedMedia: contentType.allowFeaturedMedia
    });
  }

  function editPermission(permission: RoleApplicationAccessRecord) {
    state.setPermissionForm({
      id: permission.id,
      roleId: permission.roleId,
      appId: permission.appId,
      canCreate: permission.canCreate,
      canUpdate: permission.canUpdate,
      canDelete: permission.canDelete,
      canAccess: permission.canAccess
    });
  }

  function editPermissionCode(permission: Permission) {
    state.setPermissionCodeForm({
      id: permission.id,
      code: permission.code,
      description: permission.description ?? ""
    });
  }

  function editApplication(application: ApplicationRecord) {
    state.setApplicationForm({
      id: application.id,
      name: application.name,
      area: application.area,
      link: application.link,
      description: application.description ?? ""
    });
  }

  function editRole(role: Role) {
    state.setRoleForm({
      id: role.id,
      name: role.name,
      description: role.description ?? "",
      functionName: role.functionName ?? "",
      status: role.status ?? "Ativo",
      parentRoleId: role.parentRoleId ?? "",
      permissionIds: role.permissions.map((permission) => permission.id),
      menuAccessKeys: role.menuAccesses.map((access) => `${access.topMenu}:${access.viewKey}`),
      sectionIds: role.sectionIds,
      contentTypeIds: role.contentTypeIds
    });
  }

  function editUser(managedUser: ManagedUser) {
    state.setHighlightedUserId(managedUser.id);
    state.setUserForm({
      id: managedUser.id,
      name: managedUser.name,
      email: managedUser.email,
      username: managedUser.username ?? "",
      cpf: managedUser.cpf ?? "",
      cnh: managedUser.cnh ?? "",
      status: managedUser.status ?? (managedUser.isActive ? "Ativo" : "Inativo"),
      company: managedUser.company ?? "",
      jobTitle: managedUser.jobTitle ?? "",
      phone: managedUser.phone ?? "",
      address: managedUser.address ?? "",
      zipCode: managedUser.zipCode ?? "",
      city: managedUser.city ?? "",
      state: managedUser.state ?? "",
      secondaryAddress: managedUser.secondaryAddress ?? "",
      secondaryNumber: managedUser.secondaryNumber ?? "",
      secondaryComplement: managedUser.secondaryComplement ?? "",
      neighborhood: managedUser.neighborhood ?? "",
      notes: managedUser.notes ?? "",
      facebook: managedUser.facebook ?? "",
      instagram: managedUser.instagram ?? "",
      youtube: managedUser.youtube ?? "",
      forcePasswordChange: managedUser.forcePasswordChange ?? false,
      password: "",
      passwordConfirmation: "",
      isActive: managedUser.isActive,
      isSuperAdmin: managedUser.isSuperAdmin,
      roleIds: managedUser.roles.map((role) => role.id)
    });
    state.setSuccess(`Editando usuário: ${managedUser.name}`);
  }

  function editTemplate(template: Template) {
    state.setTemplateForm({
      id: template.id,
      name: template.name,
      slug: template.slug,
      description: template.description ?? "",
      componentKey: template.componentKey ?? "",
      isActive: template.isActive ?? true
    });
  }

  function editElement(element: ManagedElement) {
    state.setElementForm({
      id: element.id,
      name: element.name,
      thumbLabel: element.thumbLabel ?? "",
      category: element.category ?? "",
      status: element.status,
      content: element.content
    });
  }

  function editSystemEmail(systemEmail: SystemEmailRecord) {
    state.setSystemEmailForm({
      id: systemEmail.id,
      name: systemEmail.name,
      email: systemEmail.email,
      area: systemEmail.area,
      description: systemEmail.description ?? "",
      value: systemEmail.value ?? ""
    });
  }

  function editNewsletterGroup(group: NewsletterGroup) {
    state.setNewsletterGroupForm({
      id: group.id,
      name: group.name,
      description: group.description ?? ""
    });
  }

  function editNewsletterRecipient(recipient: NewsletterRecipient) {
    state.setNewsletterRecipientForm({
      id: recipient.id,
      email: recipient.email,
      name: recipient.name ?? "",
      groupId: recipient.groupId,
      consentAt: toDatetimeInput(recipient.consentAt),
      unsubscribedAt: toDatetimeInput(recipient.unsubscribedAt)
    });
  }

  function editNewsletterCampaign(campaign: NewsletterCampaign) {
    state.setNewsletterCampaignForm({
      id: campaign.id,
      name: campaign.name,
      subject: campaign.subject,
      senderName: campaign.senderName,
      senderEmail: campaign.senderEmail,
      bodyHtml: campaign.bodyHtml,
      bodyText: campaign.bodyText ?? "",
      status: campaign.status,
      scheduledAt: toDatetimeInput(campaign.scheduledAt),
      sentAt: toDatetimeInput(campaign.sentAt),
      recipientGroupId: campaign.recipientGroupId ?? ""
    });
  }

  return {
    resetContentForm,
    selectContent,
    openNewContent,
    openNewSection,
    editSection,
    editContentType,
    editPermission,
    editPermissionCode,
    editApplication,
    editRole,
    editUser,
    editTemplate,
    editElement,
    editSystemEmail,
    editNewsletterGroup,
    editNewsletterRecipient,
    editNewsletterCampaign
  };
}

function toDatetimeInput(value: string | null) {
  return value ? value.slice(0, 16) : "";
}
