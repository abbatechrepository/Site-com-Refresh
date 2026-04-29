import { describe, expect, it } from "vitest";

import {
  compareRecordNumbersDesc,
  displayRecordCode,
  getDefaultNavigation,
  getDefaultTopMenu,
  getMenuConfig,
  normalizeIdentityValue,
  resolveApplicationView
} from "./utils";
import type { LoggedUser } from "./types";

describe("refresh utils", () => {
  it("normalizes identity values for duplicate checks", () => {
    expect(normalizeIdentityValue("  ADMIN@ABBATECH.LOCAL  ")).toBe("admin@abbatech.local");
    expect(normalizeIdentityValue("   ")).toBe("");
  });

  it("sorts record numbers numerically when possible", () => {
    expect(compareRecordNumbersDesc("10", "2")).toBeLessThan(0);
    expect(compareRecordNumbersDesc("abc", "def")).toBeGreaterThan(0);
  });

  it("never displays alphanumeric cuid fragments as record codes", () => {
    expect(displayRecordCode(null, "clwabc123def")).toMatch(/^\d+$/);
    expect(displayRecordCode(42, "clwabc123def")).toBe("42");
  });

  it("resolves application views from configured links", () => {
    expect(resolveApplicationView("Conteúdo", "conteudo.php")).toBe("content-list");
    expect(resolveApplicationView("Aplicativos", "aplicativos.php")).toBe("applications");
    expect(resolveApplicationView("Desconhecido", "custom.php")).toBeNull();
  });

  it("returns the default top menu per role kind", () => {
    expect(getDefaultTopMenu("admin")).toBe("administration");
    expect(getDefaultTopMenu("developer")).toBe("content");
    expect(getDefaultTopMenu("publisher")).toBe("content");
  });

  it("shows menu items only when menu, permission and app access agree", () => {
    const role = {
      id: "role-1",
      name: "Editor",
      description: null,
      functionName: "Editor",
      status: "Ativo",
      permissions: ["newsletters.read"],
      menuAccesses: [{ topMenu: "newsletter", viewKey: "newsletter" }],
      appAccesses: [
        {
          id: "access-1",
          name: "Newsletter",
          area: "Newsletter",
          link: "/refresh/newsletter",
          canCreate: true,
          canUpdate: true,
          canDelete: false,
          canAccess: true
        }
      ]
    } satisfies LoggedUser["roles"][number];

    expect(getMenuConfig(role).groups.newsletter).toEqual([{ key: "newsletter", label: "Newsletter" }]);
    expect(getMenuConfig(role).groups.content).toEqual([]);
  });

  it("hides menu items when app access is removed", () => {
    const role = {
      id: "role-1",
      name: "Administrador",
      description: null,
      functionName: "Administrador",
      status: "Ativo",
      permissions: ["contents.read"],
      menuAccesses: [{ topMenu: "content", viewKey: "content-list" }],
      appAccesses: []
    } satisfies LoggedUser["roles"][number];

    expect(getMenuConfig({ ...role, appAccesses: [] }).groups.content).toEqual([
      { key: "content-list", label: "Conteúdo" }
    ]);
    expect(
      getMenuConfig({
        ...role,
        appAccesses: [
          {
            id: "access-1",
            name: "Conteúdo",
            area: "Conteúdo",
            link: "/refresh/content",
            canCreate: true,
            canUpdate: true,
            canDelete: true,
            canAccess: false
          }
        ]
      }).groups.content
    ).toEqual([]);
  });

  it("starts administrators on users when that menu is available", () => {
    const role = {
      id: "role-1",
      name: "Administrador",
      description: null,
      functionName: "Administrador",
      status: "Ativo",
      permissions: ["users.read"],
      menuAccesses: [{ topMenu: "administration", viewKey: "users" }],
      appAccesses: [
        {
          id: "access-1",
          name: "Usuários",
          area: "Administração",
          link: "/refresh/users",
          canCreate: true,
          canUpdate: true,
          canDelete: true,
          canAccess: true
        }
      ]
    } satisfies LoggedUser["roles"][number];

    expect(getDefaultNavigation(role, getMenuConfig(role))).toEqual({
      topMenu: "administration",
      view: "users"
    });
  });
});
