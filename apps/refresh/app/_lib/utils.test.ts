import { describe, expect, it } from "vitest";

import {
  compareLegacyIdsDesc,
  getDefaultTopMenu,
  normalizeIdentityValue,
  resolveLegacyAppView
} from "./utils";

describe("refresh utils", () => {
  it("normalizes identity values for duplicate checks", () => {
    expect(normalizeIdentityValue("  ADMIN@ABBATECH.LOCAL  ")).toBe("admin@abbatech.local");
    expect(normalizeIdentityValue("   ")).toBe("");
  });

  it("sorts legacy ids numerically when possible", () => {
    expect(compareLegacyIdsDesc("10", "2")).toBeLessThan(0);
    expect(compareLegacyIdsDesc("abc", "def")).toBeGreaterThan(0);
  });

  it("resolves legacy app views from old links", () => {
    expect(resolveLegacyAppView("Conteúdo", "conteudo.php")).toBe("content-list");
    expect(resolveLegacyAppView("Aplicativos", "aplicativos.php")).toBe("applications");
    expect(resolveLegacyAppView("Desconhecido", "custom.php")).toBeNull();
  });

  it("returns the default top menu per role kind", () => {
    expect(getDefaultTopMenu("admin")).toBe("administration");
    expect(getDefaultTopMenu("developer")).toBe("content");
    expect(getDefaultTopMenu("publisher")).toBe("content");
  });
});
