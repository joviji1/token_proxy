import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;
const port = Number(process.env.PORT || 21420);
const managementTarget = process.env.TOKEN_PROXY_MGMT_TARGET || "http://127.0.0.1:19208";

const EMPTY_RUNTIME_SOURCEMAP = JSON.stringify({
  version: 3,
  file: "runtime.js",
  sources: [],
  names: [],
  mappings: "",
});

const EMPTY_SERVER_SOURCEMAP = JSON.stringify({
  version: 3,
  file: "server.js",
  sources: [],
  names: [],
  mappings: "",
});

export default defineConfig(async () => ({
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["localStorage", "preferredLanguage", "baseLocale"],
      emitTsDeclarations: true,
      additionalFiles: {
        "strategy.js.map": EMPTY_RUNTIME_SOURCEMAP,
        "middleware.js.map": EMPTY_SERVER_SOURCEMAP,
      },
      outputStructure: "message-modules",
    }),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
  clearScreen: false,
  server: {
    port,
    strictPort: true,
    host: host || "0.0.0.0",
    proxy: {
      "/_tp": {
        target: managementTarget,
        changeOrigin: true,
        rewrite: (inputPath) => inputPath.replace(/^\/_tp/, ""),
      },
    },
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: port + 1,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
