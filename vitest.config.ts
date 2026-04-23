import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["apps/**/*.test.ts", "packages/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["apps/**/{_lib,lib}/**/*.ts", "packages/contracts/src/**/*.ts"],
      exclude: ["**/*.d.ts", "**/.next/**", "**/dist/**", "**/*.test.ts"]
    }
  }
});
