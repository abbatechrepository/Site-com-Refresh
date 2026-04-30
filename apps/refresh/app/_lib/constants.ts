import type {
  ApplicationFormState,
  ContentFormState,
  ContentTypeFormState,
  ElementFormState,
  ElementPreset,
  ManagementBootstrap,
  MenuItem,
  NewsletterCampaignFormState,
  NewsletterGroupFormState,
  NewsletterRecipientFormState,
  PermissionCodeFormState,
  PermissionFormState,
  RoleFormState,
  SectionFormState,
  SystemEmailFormState,
  TemplateFormState,
  TopMenuKey,
  UserFormState
} from "./types";

export const portalRootLabel =
  process.env.NEXT_PUBLIC_PORTAL_NAME ?? process.env.NEXT_PUBLIC_SITE_NAME ?? "Abbatech";

export const userDeletedStatus = "Excluído";

export const emptySectionForm: SectionFormState = {
  name: "",
  slug: "",
  description: "",
  order: "1",
  parentId: "",
  visibleInMenu: true,
  isActive: true
};

export const emptyContentForm: ContentFormState = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  status: "draft",
  visibility: "public",
  sectionId: "",
  contentTypeId: "",
  templateId: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoCanonicalUrl: "",
  seoRobots: "index,follow",
  publishDate: "21/04/2026",
  publishTime: "18:24",
  startDate: "21/04/2026",
  endDate: "21/04/2027"
};

export const emptyContentTypeForm: ContentTypeFormState = {
  name: "",
  slug: "",
  description: "",
  allowRichText: true,
  allowFeaturedMedia: true
};

export const emptyPermissionForm: PermissionFormState = {
  roleId: "",
  appId: "",
  canCreate: false,
  canUpdate: false,
  canDelete: false,
  canAccess: true
};

export const emptyPermissionCodeForm: PermissionCodeFormState = {
  code: "",
  description: ""
};

export const emptyApplicationForm: ApplicationFormState = {
  name: "",
  area: "",
  link: "",
  description: ""
};

export const emptyRoleForm: RoleFormState = {
  name: "",
  description: "",
  functionName: "",
  status: "Ativo",
  parentRoleId: "",
  permissionIds: [],
  menuAccessKeys: [],
  sectionIds: [],
  contentTypeIds: []
};

export const emptyUserForm: UserFormState = {
  name: "",
  email: "",
  username: "",
  cpf: "",
  cnh: "",
  status: "Novo",
  company: "",
  jobTitle: "",
  phone: "",
  address: "",
  zipCode: "",
  picture: "",
  city: "",
  state: "",
  secondaryAddress: "",
  secondaryNumber: "",
  secondaryComplement: "",
  neighborhood: "",
  notes: "",
  facebook: "",
  instagram: "",
  youtube: "",
  forcePasswordChange: true,
  password: "",
  passwordConfirmation: "",
  isActive: true,
  isSuperAdmin: false,
  roleIds: []
};

export const emptyTemplateForm: TemplateFormState = {
  name: "",
  slug: "",
  description: "",
  componentKey: "",
  isActive: true
};

export const emptyElementForm: ElementFormState = {
  name: "",
  thumbLabel: "",
  category: "",
  status: "active",
  content: ""
};

export const emptySystemEmailForm: SystemEmailFormState = {
  name: "",
  email: "",
  area: "",
  description: "",
  value: ""
};

export const emptyNewsletterGroupForm: NewsletterGroupFormState = {
  name: "",
  description: ""
};

export const emptyNewsletterRecipientForm: NewsletterRecipientFormState = {
  email: "",
  name: "",
  groupId: "",
  consentAt: "",
  unsubscribedAt: ""
};

export const emptyNewsletterCampaignForm: NewsletterCampaignFormState = {
  name: "",
  subject: "",
  senderName: "Equipe Abbatech",
  senderEmail: process.env.NEXT_PUBLIC_NEWSLETTER_SENDER_EMAIL ?? "",
  bodyHtml: "",
  bodyText: "",
  status: "draft",
  scheduledAt: "",
  sentAt: "",
  recipientGroupId: ""
};

export const elementPresets: ElementPreset[] = [
  { id: 58, name: "Barra de progresso", thumbLabel: "Web Design", category: '200, "Destaques"', status: "Ativo" },
  { id: 54, name: "Destaque Leia Mais", thumbLabel: "Leia Mais", category: '200, "Destaques"', status: "Ativo" },
  { id: 57, name: "Galeria Carrossel", thumbLabel: "Galeria Carrossel", category: '201, "Galeria de Imagens"', status: "Inativo" },
  { id: 55, name: "Galeria Grade", thumbLabel: "Galeria Grade", category: '201, "Galeria de Imagens"', status: "Inativo" },
  { id: 56, name: "Galeria Tijolo", thumbLabel: "Galeria Tijolo", category: '201, "Galeria de Imagens"', status: "Inativo" },
  { id: 59, name: "Lista de Arquivos", thumbLabel: "Ata 15", category: '202, "Galeria de Arquivos"', status: "Inativo" }
];

export const templateLibrary = [
  { id: "lib-1", title: "BEAUTIFUL CONTENT. RESPONSIVE.", accent: "from-slate-200 to-slate-100" },
  { id: "lib-2", title: "Headline / Text block", accent: "from-zinc-100 to-zinc-50" },
  { id: "lib-3", title: "Heading / Two line", accent: "from-neutral-100 to-neutral-50" },
  { id: "lib-4", title: "Heading with intro", accent: "from-stone-100 to-stone-50" },
  { id: "lib-5", title: "Hero image", accent: "from-yellow-200 to-sky-100" },
  { id: "lib-6", title: "Color card", accent: "from-pink-100 to-orange-100" },
  { id: "lib-7", title: "Blue content", accent: "from-sky-100 to-white" },
  { id: "lib-8", title: "Split columns", accent: "from-gray-100 to-white" },
  { id: "lib-9", title: "Simple footer text", accent: "from-zinc-100 to-white" }
];

export const menuGroups: Record<TopMenuKey, MenuItem[]> = {
  content: [
    { key: "content-list", label: "Conteúdo" },
    { key: "sections-tree", label: "Seção" },
    { key: "templates", label: "Templates" },
    { key: "masks", label: "Máscara" },
    { key: "elements", label: "Blocos de Conteúdo" }
  ],
  administration: [
    { key: "permissions", label: "Permissões" },
    { key: "groups", label: "Grupos" },
    { key: "users", label: "Usuários" },
    { key: "statistics", label: "Estatísticas" }
  ],
  system: [
    { key: "applications", label: "Aplicativos" },
    { key: "emails", label: "Email" }
  ],
  newsletter: [{ key: "newsletter", label: "Newsletter" }]
};

export const permissionLabelMap: Record<string, string> = {
  "contents.read": "Consultar conteudos",
  "contents.write": "Incluir, editar e excluir conteudos",
  "sections.read": "Consultar secoes",
  "sections.write": "Incluir, editar e excluir secoes",
  "templates.read": "Consultar templates",
  "templates.write": "Incluir, editar e excluir templates",
  "elements.read": "Consultar blocos de conteudo",
  "elements.write": "Incluir, editar e excluir blocos de conteudo",
  "users.read": "Consultar usuarios",
  "users.write": "Incluir, editar e excluir usuarios",
  "roles.read": "Consultar grupos",
  "roles.write": "Incluir, editar e excluir grupos",
  "permissions.read": "Consultar permissoes",
  "permissions.write": "Incluir, editar e excluir permissoes",
  "applications.read": "Consultar aplicativos",
  "applications.write": "Incluir, editar e excluir aplicativos",
  "emails.read": "Consultar emails do sistema",
  "emails.write": "Incluir, editar e excluir emails do sistema",
  "statistics.read": "Consultar estatisticas",
  "statistics.write": "Gerenciar estatisticas",
  "newsletters.read": "Consultar newsletter",
  "newsletters.write": "Gerenciar newsletter",
  "privacy.read": "Consultar LGPD",
  "privacy.write": "Gerenciar LGPD",
  "management.read": "Consultar administracao",
  "management.write": "Gerenciar administracao"
};

export const emptyManagementBootstrap: ManagementBootstrap = {
  contentTypes: [],
  users: [],
  roles: [],
  permissions: [],
  applications: [],
  roleApplicationAccesses: [],
  systemEmails: [],
  templates: [],
  elements: [],
  newsletterGroups: [],
  newsletterRecipients: [],
  newsletterCampaigns: [],
  privacyRequests: []
};
