import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  resolve: {
    alias: {
      "@poppin/pmr": `${root}/packages/pmr/src/index.ts`,
      "@poppin/musical-engine": `${root}/packages/musical-engine/src/index.ts`,
      "@poppin/session-agents": `${root}/packages/session-agents/src/index.ts`,
      "@poppin/daw-bridge": `${root}/packages/daw-bridge/src/index.ts`,
      "@poppin/shared": `${root}/packages/shared/src/index.ts`,
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: "127.0.0.1",
    open: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:47821",
        changeOrigin: true,
      },
    },
  },
});
