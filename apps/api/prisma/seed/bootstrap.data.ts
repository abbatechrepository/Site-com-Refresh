type RoleDefinition = {
  name: string;
  description: string;
  functionName: string;
  permissionCodes?: readonly string[];
  menuAccesses: readonly {
    topMenu: string;
    viewKey: string;
  }[];
};

export const bootstrapPermissions = [
  { code: "sections.read", description: "Ler secoes" },
  { code: "sections.write", description: "Gerenciar secoes" },
  { code: "contents.read", description: "Ler conteudos no CMS" },
  { code: "contents.write", description: "Gerenciar conteudos" },
  { code: "templates.read", description: "Ler templates" },
  { code: "templates.write", description: "Gerenciar templates" },
  { code: "elements.read", description: "Ler elementos" },
  { code: "elements.write", description: "Gerenciar elementos" },
  { code: "users.read", description: "Ler usuarios" },
  { code: "users.write", description: "Gerenciar usuarios" },
  { code: "roles.read", description: "Ler grupos e perfis" },
  { code: "roles.write", description: "Gerenciar grupos e perfis" },
  { code: "permissions.read", description: "Ler permissoes" },
  { code: "permissions.write", description: "Gerenciar permissoes" },
  { code: "applications.read", description: "Ler aplicativos" },
  { code: "applications.write", description: "Gerenciar aplicativos" },
  { code: "emails.read", description: "Ler emails do sistema" },
  { code: "emails.write", description: "Gerenciar emails do sistema" },
  { code: "statistics.read", description: "Ler estatisticas" },
  { code: "statistics.write", description: "Gerenciar estatisticas" },
  { code: "newsletters.read", description: "Ler newsletters" },
  { code: "newsletters.write", description: "Gerenciar newsletters" },
  { code: "privacy.read", description: "Ler pedidos LGPD" },
  { code: "privacy.write", description: "Gerenciar pedidos LGPD" },
  { code: "management.read", description: "Ler cadastros administrativos" },
  { code: "management.write", description: "Gerenciar cadastros administrativos" }
] as const;

export const bootstrapAdminRole: RoleDefinition = {
  name: "Administrador",
  description: "Acesso total a plataforma",
  functionName: "Administrador",
  menuAccesses: [
    { topMenu: "administration", viewKey: "permissions" },
    { topMenu: "administration", viewKey: "groups" },
    { topMenu: "administration", viewKey: "users" },
    { topMenu: "administration", viewKey: "statistics" },
    { topMenu: "system", viewKey: "applications" },
    { topMenu: "system", viewKey: "emails" },
    { topMenu: "content", viewKey: "content-list" },
    { topMenu: "content", viewKey: "sections-tree" },
    { topMenu: "content", viewKey: "templates" },
    { topMenu: "content", viewKey: "masks" },
    { topMenu: "content", viewKey: "elements" },
    { topMenu: "newsletter", viewKey: "newsletter" }
  ]
};
