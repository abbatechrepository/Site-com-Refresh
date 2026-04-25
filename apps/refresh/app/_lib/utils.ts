import { menuGroups, permissionLabelMap } from "./constants";
import type {
  LoggedUser,
  ManagedUser,
  MenuConfig,
  Section,
  TopMenuItem,
  TopMenuKey,
  TreeSection,
  ViewKey
} from "./types";

export function getPermissionLabel(code: string) {
  return permissionLabelMap[code] ?? code.replaceAll(".", " / ");
}

export function normalizeIdentityValue(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : "";
}

export function compareRecordNumbersDesc(leftId: string, rightId: string) {
  const leftNumeric = Number(leftId);
  const rightNumeric = Number(rightId);

  if (Number.isFinite(leftNumeric) && Number.isFinite(rightNumeric)) {
    return rightNumeric - leftNumeric;
  }

  return rightId.localeCompare(leftId);
}

export function displayRecordCode(referenceNumber?: number | null, id?: string) {
  if (typeof referenceNumber === "number") {
    return String(referenceNumber);
  }

  if (!id) {
    return "--";
  }

  const numericFallback = Array.from(id).reduce((accumulator, character) => {
    return (accumulator * 31 + character.charCodeAt(0)) % 90_000_000;
  }, 0);

  return String(numericFallback + 10_000_000);
}

export function buildDuplicateUserMessage(
  conflictingUser: ManagedUser,
  field: "username" | "cpf" | "email",
  attemptedValue: string
) {
  const label = field === "username" ? "username" : field === "cpf" ? "CPF" : "e-mail";

  return `Já existe um usuário com este ${label}: ${attemptedValue}. Registro localizado: ${conflictingUser.name} (${conflictingUser.email}).`;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatTime(value: string | null) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleString("pt-BR");
}

export function getRoleKind(roleName: string | null | undefined) {
  const normalizedRoleName = roleName?.toLowerCase() ?? "";

  if (normalizedRoleName.includes("administrador")) {
    return "admin";
  }

  if (normalizedRoleName.includes("desenvolvedor")) {
    return "developer";
  }

  return "publisher";
}

export function resolveApplicationView(applicationName: string, link: string): ViewKey | null {
  const normalizedName = applicationName.toLowerCase();
  const normalizedLink = link.toLowerCase();

  if (normalizedLink.includes("conteudo.php") || normalizedName === "conteúdo") return "content-list";
  if (normalizedLink.includes("secao.php") || normalizedName === "seção") return "sections-tree";
  if (normalizedLink.includes("template.php") || normalizedName === "templates") return "templates";
  if (normalizedLink.includes("mascara.php") || normalizedName === "máscara") return "masks";
  if (normalizedLink.includes("elemento.php") || normalizedName.includes("blocos")) return "elements";
  if (normalizedLink.includes("permissao.php") || normalizedName === "permissões") return "permissions";
  if (normalizedLink.includes("grupos.php") || normalizedName === "grupos") return "groups";
  if (normalizedLink.includes("usuarios.php") || normalizedName === "usuários") return "users";
  if (normalizedLink.includes("aplicativos.php") || normalizedName === "aplicativos") return "applications";
  if (normalizedLink.includes("email.php") || normalizedName === "email") return "emails";
  if (normalizedLink.includes("estatistica.php") || normalizedName === "estatísticas") return "statistics";
  if (normalizedLink.includes("newsletter.php") || normalizedName === "newsletter") return "newsletter";

  return null;
}

export function normalizeTopMenuArea(area: string): TopMenuKey {
  const normalizedArea = area.toLowerCase();

  if (normalizedArea.includes("admin")) {
    return "administration";
  }

  if (normalizedArea.includes("system") || normalizedArea.includes("sistema")) {
    return "system";
  }

  if (normalizedArea.includes("newsletter")) {
    return "newsletter";
  }

  return "content";
}

export function getTopMenus(kind: "admin" | "developer" | "publisher"): TopMenuItem[] {
  if (kind === "admin") {
    return [
      { key: "administration", label: "Administração" },
      { key: "system", label: "Sistema" }
    ];
  }

  if (kind === "developer") {
    return [
      { key: "content", label: "Conteúdo" },
      { key: "system", label: "Sistema" }
    ];
  }

  return [
    { key: "content", label: "Conteúdo" },
    { key: "newsletter", label: "Newsletter" }
  ];
}

export function getDefaultView(
  kind: "admin" | "developer" | "publisher",
  role?: LoggedUser["roles"][number] | null,
  menuConfig?: MenuConfig
): ViewKey {
  const normalizedName = role?.name?.toLowerCase() ?? "";
  const normalizedFunction = role?.functionName?.toLowerCase() ?? "";

  if (normalizedName.includes("administrador")) {
    return "users";
  }

  if (normalizedName.includes("desenvolvedor")) {
    return "sections-tree";
  }

  if (["publicador", "editor", "autor"].some((item) => normalizedFunction.includes(item))) {
    return "content-list";
  }

  if (kind === "admin") {
    return "users";
  }

  const firstTopMenu = menuConfig?.topMenus[0]?.key;
  const firstView = firstTopMenu ? menuConfig?.groups[firstTopMenu]?.[0]?.key : null;
  if (firstView) {
    return firstView;
  }

  return "content-list";
}

export function getDefaultTopMenu(kind: "admin" | "developer" | "publisher"): TopMenuKey {
  if (kind === "admin") {
    return "administration";
  }

  return "content";
}

const viewPermissionRequirements: Partial<Record<ViewKey, string[]>> = {
  "content-list": ["contents.read"],
  "content-editor": ["contents.read"],
  "sections-tree": ["sections.read"],
  "section-editor": ["sections.read"],
  templates: ["templates.read"],
  elements: ["elements.read"],
  users: ["users.read"],
  groups: ["roles.read"],
  permissions: ["permissions.read"],
  applications: ["applications.read"],
  emails: ["emails.read"],
  newsletter: ["newsletters.read"],
  statistics: ["statistics.read"]
};

function hasPermissionForView(role: LoggedUser["roles"][number], viewKey: ViewKey) {
  const requiredPermissions = viewPermissionRequirements[viewKey] ?? [];
  return requiredPermissions.every((permission) => role.permissions.includes(permission));
}

function hasApplicationAccessForView(role: LoggedUser["roles"][number], viewKey: ViewKey) {
  if (role.appAccesses.length === 0) {
    return true;
  }

  return role.appAccesses.some((access) => {
    return access.canAccess && resolveApplicationView(access.name, access.link) === viewKey;
  });
}

function canShowView(role: LoggedUser["roles"][number], viewKey: ViewKey) {
  return hasPermissionForView(role, viewKey) && hasApplicationAccessForView(role, viewKey);
}

export function getDefaultNavigation(
  role: LoggedUser["roles"][number] | null,
  menuConfig: MenuConfig
) {
  const kind = getRoleKind(role?.name);
  const desiredView = getDefaultView(kind, role, menuConfig);
  const desiredTopMenu = (Object.entries(menuConfig.groups) as Array<[TopMenuKey, MenuConfig["groups"][TopMenuKey]]>)
    .find(([, items]) => items.some((item) => item.key === desiredView))?.[0];

  if (desiredTopMenu) {
    return {
      topMenu: desiredTopMenu,
      view: desiredView
    };
  }

  const preferredTopMenu = getDefaultTopMenu(kind);
  const preferredItems = menuConfig.groups[preferredTopMenu] ?? [];

  if (preferredItems.length > 0) {
    return {
      topMenu: preferredTopMenu,
      view: preferredItems[0].key
    };
  }

  const fallbackTopMenu = menuConfig.topMenus[0]?.key ?? preferredTopMenu;

  return {
    topMenu: fallbackTopMenu,
    view: menuConfig.groups[fallbackTopMenu]?.[0]?.key ?? desiredView
  };
}

export function getMenuConfig(role: LoggedUser["roles"][number] | null): MenuConfig {
  if (!role) {
    const kind = getRoleKind("");
    const topMenus = getTopMenus(kind);
    return {
      topMenus,
      groups: Object.fromEntries(topMenus.map((menu) => [menu.key, menuGroups[menu.key]])) as MenuConfig["groups"]
    };
  }

  const groups: MenuConfig["groups"] = {
    content: [],
    administration: [],
    system: [],
    newsletter: []
  };

  if (role.menuAccesses.length > 0) {
    for (const access of role.menuAccesses) {
      if (!canShowView(role, access.viewKey)) {
        continue;
      }

      const label = getBreadcrumbLabel(access.viewKey);

      if (!groups[access.topMenu].some((item) => item.key === access.viewKey)) {
        groups[access.topMenu].push({
          key: access.viewKey,
          label
        });
      }
    }
  } else {
    for (const access of role.appAccesses) {
      if (!access.canAccess) {
        continue;
      }

      const viewKey = resolveApplicationView(access.name, access.link);
      if (!viewKey || !hasPermissionForView(role, viewKey)) {
        continue;
      }

      const topMenu = normalizeTopMenuArea(access.area);
      const label = getBreadcrumbLabel(viewKey);

      if (!groups[topMenu].some((item) => item.key === viewKey)) {
        groups[topMenu].push({
          key: viewKey,
          label
        });
      }
    }
  }

  const topMenus = (Object.entries(groups) as Array<[TopMenuKey, MenuConfig["groups"][TopMenuKey]]>)
    .filter(([, items]) => items.length > 0)
    .map(([key]) => ({
      key,
      label:
        key === "administration"
          ? "Administração"
          : key === "newsletter"
            ? "Newsletter"
            : key === "system"
              ? "Sistema"
              : "Conteúdo"
    }));

  return {
    topMenus,
    groups
  };
}

export function buildSectionTree(sections: Section[]) {
  const map = new Map<string, TreeSection>();

  for (const section of sections) {
    map.set(section.id, {
      ...section,
      childrenNodes: []
    });
  }

  const roots: TreeSection[] = [];

  for (const section of sections) {
    const node = map.get(section.id);

    if (!node) {
      continue;
    }

    if (section.parentId) {
      const parent = map.get(section.parentId);

      if (parent) {
        parent.childrenNodes.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  return roots.sort((left, right) => left.path.localeCompare(right.path));
}

export function getBreadcrumbLabel(view: ViewKey) {
  const labels: Record<ViewKey, string> = {
    "content-list": "Conteúdo",
    "content-editor": "Conteúdo",
    "sections-tree": "Seção",
    "section-editor": "Seção",
    masks: "Máscara",
    templates: "Templates",
    elements: "Blocos de Conteúdo",
    users: "Usuários",
    groups: "Grupos",
    permissions: "Permissões",
    applications: "Aplicativos",
    emails: "Email",
    newsletter: "Newsletter",
    statistics: "Estatísticas"
  };

  return labels[view];
}

export function getBreadcrumbTop(view: ViewKey) {
  if (["users", "groups", "permissions", "statistics"].includes(view)) {
    return "Administração";
  }

  if (["applications", "emails"].includes(view)) {
    return "Sistema";
  }

  if (view === "newsletter") {
    return "Newsletter";
  }

  return "Conteúdo";
}

export function getViewTitle(view: ViewKey) {
  if (view === "content-list" || view === "content-editor") {
    return "Cadastro de Conteúdo";
  }

  if (view === "sections-tree" || view === "section-editor") {
    return "Seções, Navegação, Menus";
  }

  if (view === "masks") {
    return "Cadastro de Máscaras";
  }

  if (view === "templates") {
    return "Cadastro de Templates";
  }

  if (view === "elements") {
    return "Cadastro de Blocos personalizados";
  }

  if (view === "users") {
    return "Cadastro de Usuários";
  }

  if (view === "groups") {
    return "Cadastro de Grupos";
  }

  if (view === "permissions") {
    return "Permissões de acesso";
  }

  if (view === "applications") {
    return "Cadastro de Aplicativos";
  }

  if (view === "emails") {
    return "Emails do Sistema";
  }

  if (view === "newsletter") {
    return "Cadastro de Newsletter";
  }

  return "Estatísticas";
}

export function formatContentStatus(status: string) {
  if (status === "published") {
    return "Publicado";
  }

  if (status === "draft") {
    return "Novo";
  }

  return "Arquivado";
}

export function roleName(role: LoggedUser["roles"][number] | null | undefined) {
  return role?.name ?? "Publicador Geral";
}

export function toggleItem(list: string[], item: string) {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
}
