import type { ReactNode } from "react";

export type ViewKey =
  | "content-list"
  | "content-editor"
  | "sections-tree"
  | "section-editor"
  | "masks"
  | "templates"
  | "elements"
  | "users"
  | "groups"
  | "permissions"
  | "applications"
  | "emails"
  | "newsletter"
  | "statistics";

export type TopMenuKey = "content" | "administration" | "system" | "newsletter";

export type MenuItem = {
  key: ViewKey;
  label: string;
};

export type TopMenuItem = {
  key: TopMenuKey;
  label: string;
};

export type MenuConfig = {
  topMenus: TopMenuItem[];
  groups: Record<TopMenuKey, MenuItem[]>;
};

export type LoggedUser = {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  cpf?: string | null;
  picture?: string | null;
  permissions: string[];
  activeRoleId?: string | null;
  roles: Array<{
    id: string;
    name: string;
    description: string | null;
    functionName?: string | null;
    status?: string;
    menuAccesses: Array<{
      topMenu: TopMenuKey;
      viewKey: ViewKey;
    }>;
    appAccesses: Array<{
      id: string;
      name: string;
      area: string;
      link: string;
      canCreate: boolean;
      canUpdate: boolean;
      canDelete: boolean;
      canAccess: boolean;
    }>;
    permissions: string[];
  }>;
};

export type Section = {
  id: string;
  legacyId?: number | null;
  name: string;
  slug: string;
  path: string;
  parentId: string | null;
  description: string | null;
  isActive: boolean;
  visibleInMenu: boolean;
  order: number;
  visits?: number;
  _count?: {
    children: number;
    contents: number;
  };
};

export type Template = {
  id: string;
  legacyId?: number | null;
  name: string;
  slug: string;
  description?: string | null;
  componentKey?: string;
  isActive?: boolean;
  configSchema?: Record<string, unknown>;
};

export type ContentType = {
  id: string;
  legacyId?: number | null;
  name: string;
  slug: string;
  description: string | null;
  allowRichText: boolean;
  allowFeaturedMedia: boolean;
  schemaJson: Record<string, unknown>;
  _count?: {
    contents: number;
  };
};

export type Content = {
  id: string;
  legacyId?: number | null;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  status: string;
  visibility: string;
  publishedAt: string | null;
  sectionId: string;
  contentTypeId: string;
  templateId: string | null;
  section: {
    id: string;
    name: string;
    slug?: string;
    path?: string;
    parentId?: string | null;
  };
  contentType: {
    id: string;
    name: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    canonicalUrl: string | null;
    robots: string | null;
  } | null;
  author?: {
    id: string;
    name: string;
  } | null;
};

export type Permission = {
  id: string;
  legacyId?: number | null;
  code: string;
  description: string | null;
  roles: Array<{
    id: string;
    name: string;
  }>;
};

export type Role = {
  id: string;
  legacyId?: number | null;
  name: string;
  description: string | null;
  functionName?: string | null;
  status?: string;
  parentRoleId?: string | null;
  parentRoleName?: string | null;
  permissions: Permission[];
  menuAccesses: Array<{
    topMenu: TopMenuKey;
    viewKey: ViewKey;
  }>;
  appAccesses: Array<{
    id: string;
    appId: string;
    appName: string;
    area: string;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canAccess: boolean;
  }>;
  sectionIds: string[];
  contentTypeIds: string[];
  users: Array<{
    id: string;
    name: string;
    email: string;
  }>;
};

export type ApplicationRecord = {
  id: string;
  legacyId?: number | null;
  name: string;
  area: string;
  link: string;
  description: string | null;
};

export type RoleApplicationAccessRecord = {
  id: string;
  legacyId?: number | null;
  roleId: string;
  roleName: string;
  appId: string;
  appName: string;
  area: string;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canAccess: boolean;
};

export type SystemEmailRecord = {
  id: string;
  legacyId?: number | null;
  name: string;
  email: string;
  area: string;
  description: string | null;
  value: string | null;
};

export type ManagedElement = {
  id: string;
  legacyId?: number | null;
  name: string;
  thumbLabel: string | null;
  content: string;
  status: string;
  category: string | null;
};

export type ManagedUser = {
  id: string;
  legacyId?: number | null;
  name: string;
  email: string;
  picture?: string | null;
  username?: string | null;
  cpf?: string | null;
  cnh?: string | null;
  status?: string;
  company?: string | null;
  jobTitle?: string | null;
  phone?: string | null;
  address?: string | null;
  zipCode?: string | null;
  city?: string | null;
  state?: string | null;
  secondaryAddress?: string | null;
  secondaryNumber?: string | null;
  secondaryComplement?: string | null;
  neighborhood?: string | null;
  notes?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  forcePasswordChange?: boolean;
  isActive: boolean;
  isSuperAdmin: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  roles: Array<{
    id: string;
    name: string;
    description: string | null;
  }>;
  stats: {
    authoredContents: number;
    revisions: number;
  };
};

export type NewsletterGroup = {
  id: string;
  legacyId?: number | null;
  name: string;
  description: string | null;
  createdAt: string;
  _count: {
    recipients: number;
    campaigns: number;
  };
};

export type NewsletterCampaign = {
  id: string;
  legacyId?: number | null;
  name: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  bodyHtml: string;
  bodyText: string | null;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  recipientGroupId: string | null;
  recipientGroup: {
    id: string;
    name: string;
  } | null;
  _count: {
    dispatches: number;
  };
};

export type NewsletterRecipient = {
  id: string;
  legacyId?: number | null;
  email: string;
  name: string | null;
  groupId: string;
  groupName: string;
  consentAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
  dispatchCount: number;
};

export type PrivacyRequest = {
  id: string;
  legacyId?: number | null;
  type: string;
  subjectEmail: string;
  description: string | null;
  status: string;
  createdAt: string;
};

export type EditorMeta = {
  sections: Section[];
  templates: Template[];
  contentTypes: ContentType[];
};

export type ManagementBootstrap = {
  contentTypes: ContentType[];
  users: ManagedUser[];
  roles: Role[];
  permissions: Permission[];
  applications: ApplicationRecord[];
  roleApplicationAccesses: RoleApplicationAccessRecord[];
  systemEmails: SystemEmailRecord[];
  templates: Template[];
  elements: ManagedElement[];
  newsletterGroups: NewsletterGroup[];
  newsletterRecipients: NewsletterRecipient[];
  newsletterCampaigns: NewsletterCampaign[];
  privacyRequests: PrivacyRequest[];
};

export type SectionFormState = {
  name: string;
  slug: string;
  description: string;
  order: string;
  parentId: string;
  visibleInMenu: boolean;
  isActive: boolean;
};

export type ContentFormState = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: "draft" | "published" | "archived";
  visibility: "public" | "private";
  sectionId: string;
  contentTypeId: string;
  templateId: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoCanonicalUrl: string;
  seoRobots: string;
  publishDate: string;
  publishTime: string;
  startDate: string;
  endDate: string;
};

export type ContentTypeFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  allowRichText: boolean;
  allowFeaturedMedia: boolean;
};

export type PermissionFormState = {
  id?: string;
  roleId: string;
  appId: string;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canAccess: boolean;
};

export type PermissionCodeFormState = {
  id?: string;
  code: string;
  description: string;
};

export type ApplicationFormState = {
  id?: string;
  name: string;
  area: string;
  link: string;
  description: string;
};

export type RoleFormState = {
  id?: string;
  name: string;
  description: string;
  functionName: string;
  status: string;
  parentRoleId: string;
  permissionIds: string[];
  menuAccessKeys: string[];
  sectionIds: string[];
  contentTypeIds: string[];
};

export type UserFormState = {
  id?: string;
  name: string;
  email: string;
  username: string;
  picture: string;
  cpf: string;
  cnh: string;
  status: string;
  company: string;
  jobTitle: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  secondaryAddress: string;
  secondaryNumber: string;
  secondaryComplement: string;
  neighborhood: string;
  notes: string;
  facebook: string;
  instagram: string;
  youtube: string;
  forcePasswordChange: boolean;
  password: string;
  passwordConfirmation: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  roleIds: string[];
};

export type TemplateFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  componentKey: string;
  isActive: boolean;
};

export type ElementFormState = {
  id?: string;
  name: string;
  thumbLabel: string;
  category: string;
  status: string;
  content: string;
};

export type SystemEmailFormState = {
  id?: string;
  name: string;
  email: string;
  area: string;
  description: string;
  value: string;
};

export type NewsletterGroupFormState = {
  id?: string;
  name: string;
  description: string;
};

export type NewsletterRecipientFormState = {
  id?: string;
  email: string;
  name: string;
  groupId: string;
  consentAt: string;
  unsubscribedAt: string;
};

export type NewsletterCampaignFormState = {
  id?: string;
  name: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  bodyHtml: string;
  bodyText: string;
  status: string;
  scheduledAt: string;
  sentAt: string;
  recipientGroupId: string;
};

export type ElementPreset = {
  id: number;
  name: string;
  thumbLabel: string;
  category: string;
  status: "Ativo" | "Inativo";
};

export type TreeSection = Section & {
  childrenNodes: TreeSection[];
};

export type ButtonTone = "blue" | "green" | "red";

export type RefreshShellProps = {
  user: LoggedUser | null;
  roleLabel: string;
  profileMenuOpen: boolean;
  onToggleProfileMenu: () => void;
  selectedProfileId: string;
  onSwitchProfile: (profileId: string) => void;
  onLogout: () => void;
  topMenus: TopMenuItem[];
  topMenu: TopMenuKey;
  expandedTopMenu: TopMenuKey | null;
  onToggleTopMenu: (menuKey: TopMenuKey) => void;
  menuGroups: MenuConfig["groups"];
  view: ViewKey;
  onSelectView: (topMenuKey: TopMenuKey, viewKey: ViewKey) => void;
  error: string;
  success: string;
  isPending: boolean;
  children: ReactNode;
};
