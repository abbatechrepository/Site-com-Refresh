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

export const permissions = [
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
  { code: "newsletters.read", description: "Ler campanhas" },
  { code: "newsletters.write", description: "Gerenciar newsletters" },
  { code: "privacy.read", description: "Ler pedidos LGPD" },
  { code: "privacy.write", description: "Gerenciar pedidos LGPD" },
  { code: "management.read", description: "Ler cadastros administrativos" },
  { code: "management.write", description: "Gerenciar cadastros administrativos" }
] as const;

export const roleDefinitions: readonly RoleDefinition[] = [
  {
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
  },
  {
    name: "Desenvolvedor",
    description: "Responsavel pela criacao e manutencao dos templates internos e externos. Cria secoes.",
    functionName: "Desenvolvedor",
    permissionCodes: [
      "sections.read",
      "sections.write",
      "contents.read",
      "contents.write",
      "templates.read",
      "templates.write",
      "elements.read",
      "elements.write",
      "management.read",
      "management.write"
    ],
    menuAccesses: [
      { topMenu: "content", viewKey: "content-list" },
      { topMenu: "content", viewKey: "sections-tree" },
      { topMenu: "content", viewKey: "templates" },
      { topMenu: "content", viewKey: "masks" },
      { topMenu: "content", viewKey: "elements" },
      { topMenu: "system", viewKey: "applications" }
    ]
  },
  {
    name: "Publicador Geral",
    description: "Responsavel pela publicacao dos conteudos dinamicos e validacao da newsletter.",
    functionName: "Publicador",
    permissionCodes: [
      "contents.read",
      "contents.write",
      "sections.read",
      "templates.read",
      "newsletters.read",
      "newsletters.write",
      "management.read"
    ],
    menuAccesses: [
      { topMenu: "content", viewKey: "content-list" },
      { topMenu: "content", viewKey: "sections-tree" },
      { topMenu: "newsletter", viewKey: "newsletter" }
    ]
  },
  {
    name: "Editor",
    description: "Opera conteudos, secoes e leitura administrativa",
    functionName: "Editor",
    permissionCodes: ["sections.read", "sections.write", "contents.read", "contents.write", "templates.read", "management.read"],
    menuAccesses: [
      { topMenu: "content", viewKey: "content-list" },
      { topMenu: "content", viewKey: "sections-tree" }
    ]
  },
  {
    name: "Marketing",
    description: "Opera comunicacao, newsletters e leitura do painel",
    functionName: "Editor",
    permissionCodes: ["contents.read", "templates.read", "newsletters.read", "newsletters.write", "management.read"],
    menuAccesses: [
      { topMenu: "content", viewKey: "content-list" },
      { topMenu: "newsletter", viewKey: "newsletter" }
    ]
  },
  {
    name: "LGPD",
    description: "Acompanha solicitacoes de privacidade e governanca",
    functionName: "Administrador",
    permissionCodes: ["privacy.read", "management.read"],
    menuAccesses: [{ topMenu: "administration", viewKey: "statistics" }]
  }
] as const;

export const applicationDefinitions = [
  { name: "Conteúdo", area: "Conteúdo", link: "/refresh/content", description: "Cadastro e listagem de conteúdos." },
  { name: "Seção", area: "Conteúdo", link: "/refresh/sections", description: "Navegação, menus e arquitetura de informação." },
  { name: "Templates", area: "Conteúdo", link: "/refresh/templates", description: "Cadastro de templates." },
  { name: "Máscara", area: "Conteúdo", link: "/refresh/masks", description: "Máscaras de conteúdo." },
  { name: "Blocos de Conteúdo", area: "Conteúdo", link: "/refresh/elements", description: "Elementos e blocos customizados." },
  { name: "Permissões", area: "Administração", link: "/refresh/permissions", description: "Permissões por grupo e aplicativo." },
  { name: "Grupos", area: "Administração", link: "/refresh/groups", description: "Cadastro de grupos e workflow." },
  { name: "Usuários", area: "Administração", link: "/refresh/users", description: "Cadastro de usuários." },
  { name: "Email", area: "Sistema", link: "/refresh/system-emails", description: "E-mails utilizados pelo portal." },
  { name: "Aplicativos", area: "Sistema", link: "/refresh/applications", description: "Cadastro de aplicativos e áreas de menu." },
  { name: "Estatísticas", area: "Administração", link: "/refresh/statistics", description: "Acessos por seção." },
  { name: "Newsletter", area: "Newsletter", link: "/refresh/newsletter", description: "Grupos, destinatários e campanhas." }
] as const;

export const roleAccessDefinitions = [
  { role: "Administrador", app: "Conteúdo", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Seção", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Templates", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Máscara", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Blocos de Conteúdo", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Permissões", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Grupos", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Usuários", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Email", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Aplicativos", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Estatísticas", canCreate: false, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Administrador", app: "Newsletter", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Desenvolvedor", app: "Conteúdo", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Desenvolvedor", app: "Seção", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Desenvolvedor", app: "Templates", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Desenvolvedor", app: "Máscara", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Desenvolvedor", app: "Blocos de Conteúdo", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Publicador Geral", app: "Conteúdo", canCreate: true, canUpdate: true, canDelete: true, canAccess: true },
  { role: "Publicador Geral", app: "Seção", canCreate: true, canUpdate: true, canDelete: false, canAccess: true },
  { role: "Publicador Geral", app: "Newsletter", canCreate: true, canUpdate: true, canDelete: false, canAccess: true },
  { role: "Editor", app: "Conteúdo", canCreate: true, canUpdate: true, canDelete: false, canAccess: true },
  { role: "Marketing", app: "Email", canCreate: false, canUpdate: true, canDelete: false, canAccess: true },
  { role: "Marketing", app: "Newsletter", canCreate: true, canUpdate: true, canDelete: false, canAccess: true },
  { role: "LGPD", app: "Estatísticas", canCreate: false, canUpdate: true, canDelete: false, canAccess: true }
] as const;
