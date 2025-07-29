import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  // In production, serve from dist/public
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    // Fallback to current directory structure
    const fallbackPath = path.resolve(process.cwd(), "public");
    if (fs.existsSync(fallbackPath)) {
      log(`Serving static files from fallback: ${fallbackPath}`, "production");
      app.use(express.static(fallbackPath));
      app.use("*", (_req, res) => {
        res.sendFile(path.resolve(fallbackPath, "index.html"));
      });
      return;
    }
    throw new Error(
      `Could not find build directory: ${distPath} or fallback: ${fallbackPath}`,
    );
  }

  log(`Serving static files from: ${distPath}`, "production");
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}