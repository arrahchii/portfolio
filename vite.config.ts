import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(async () => {
  const clientRoot = path.resolve(__dirname, "client");

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(clientRoot, "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: clientRoot,
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      host: 'localhost',
      port: 5173,
      fs: {
        strict: false,
        allow: [
          path.resolve(__dirname),
          path.resolve(clientRoot)
        ]
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          // Remove the rewrite function - let it pass through as-is
        },
      },
    },
  };
});
