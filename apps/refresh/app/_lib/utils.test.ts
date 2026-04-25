import { describe, expect, it } from "vitest";

import {
  compareRecordNumbersDesc,
  getMenuConfig,
  getDefaultTopMenu,
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

  it("uses role menu access before application access when both exist", () => {
    const role = {
      id: "role-1",
      name: "Editor",
      description: null,
      functionName: "Editor",
      status: "Ativo",
      permissions: [],
      menuAccesses: [{ topMenu: "newsletter", viewKey: "newsletter" }],
      appAccesses: [
        {
          id: "access-1",
          name: "Conteúdo",
          area: "Conteúdo",
          link: "/Manager/Conteudo.php",
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
});
