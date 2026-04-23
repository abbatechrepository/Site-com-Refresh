import { describe, expect, it } from "vitest";

import {
  compareRecordNumbersDesc,
  getDefaultTopMenu,
  normalizeIdentityValue,
  resolveApplicationView
} from "./utils";

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
});
