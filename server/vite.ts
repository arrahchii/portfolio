import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import react from "@vitejs/plugin-react";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const projectRoot = path.resolve(__dirname, "..");
  const clientRoot = path.resolve(projectRoot, "client");

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  // Create Vite server with inline configuration
  const vite = await createViteServer({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(clientRoot, "src"),
        "@shared": path.resolve(projectRoot, "shared"),
        "@assets": path.resolve(projectRoot, "attached_assets"),
      },
    },
    root: clientRoot,
    server: {
      ...serverOptions,
      fs: {
        strict: false,
        allow: [projectRoot]
      }
    },
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        console.log("Vite Error:", msg);
        viteLogger.error(msg, options);
      },
    },
    appType: "custom",
    configFile: false,
  });

  app.use(vite.middlewares);
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const templatePath = path.resolve(clientRoot, "index.html");
      
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
      }

      let template = await fs.promises.readFile(templatePath, "utf-8");
      
      // Transform the HTML through Vite
      const html = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      console.error("Error in Vite middleware:", e);
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}


