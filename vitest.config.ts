import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@poppin/pmr": `${root}/packages/pmr/src/index.ts`,
      "@poppin/musical-engine": `${root}/packages/musical-engine/src/index.ts`,
      "@poppin/session-agents": `${root}/packages/session-agents/src/index.ts`,
      "@poppin/daw-bridge": `${root}/packages/daw-bridge/src/index.ts`,
      "@poppin/shared": `${root}/packages/shared/src/index.ts`,
    },
  },
  test: {
    include: ["packages/**/*.test.ts", "tests/**/*.test.ts"],
    environment: "node",
  },
});
