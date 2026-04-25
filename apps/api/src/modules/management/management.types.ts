export type UpsertContentTypeInput = {
  name: string;
  slug?: string;
  description?: string;
  allowRichText?: boolean;
  allowFeaturedMedia?: boolean;
  schemaJson?: unknown;
};

export type UpsertPermissionInput = {
  code: string;
  description?: string;
};

export type UpsertApplicationInput = {
  name: string;
  area: string;
  link: string;
  description?: string;
};

export type UpsertRoleApplicationAccessInput = {
  roleId: string;
  appId: string;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  canAccess?: boolean;
};

export type RoleMenuAccessInput = {
  topMenu: string;
  viewKey: string;
};

export type UpsertRoleInput = {
  name: string;
  description?: string;
  functionName?: string;
  status?: string;
  parentRoleId?: string;
  permissionIds?: string[];
  menuAccesses?: RoleMenuAccessInput[];
  sectionIds?: string[];
  contentTypeIds?: string[];
};

export type UpsertUserInput = {
  name: string;
  email: string;
  username?: string;
  cpf?: string;
  cnh?: string;
  status?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  secondaryAddress?: string;
  secondaryNumber?: string;
  secondaryComplement?: string;
  neighborhood?: string;
  notes?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  forcePasswordChange?: boolean;
  password?: string;
  isActive?: boolean;
  isSuperAdmin?: boolean;
  roleIds?: string[];
};

export type UpsertNewsletterGroupInput = {
  name: string;
  description?: string;
};

export type UpsertNewsletterRecipientInput = {
  email: string;
  name?: string;
  groupId: string;
  consentAt?: string;
  unsubscribedAt?: string;
};

export type UpsertNewsletterCampaignInput = {
  name: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  bodyHtml: string;
  bodyText?: string;
  status?: string;
  scheduledAt?: string;
  sentAt?: string;
  recipientGroupId?: string;
};

export type UpsertSystemEmailInput = {
  name: string;
  email: string;
  area: string;
  description?: string;
  value?: string;
};

export type UpsertTemplateInput = {
  name: string;
  slug?: string;
  description?: string;
  componentKey?: string;
  configSchema?: unknown;
  isActive?: boolean;
};

export type UpsertElementInput = {
  name: string;
  thumbLabel?: string;
  content?: string;
  status?: string;
  category?: string;
};

export const viewToApplicationName: Partial<Record<string, string>> = {
  "content-list": "Conteúdo",
  "content-editor": "Conteúdo",
  "sections-tree": "Seção",
  "section-editor": "Seção",
  masks: "Máscara",
  templates: "Templates",
  elements: "Blocos de Conteúdo",
  permissions: "Permissões",
  groups: "Grupos",
  users: "Usuários",
  applications: "Aplicativos",
  emails: "Email",
  statistics: "Estatísticas",
  newsletter: "Newsletter"
};
