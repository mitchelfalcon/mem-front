// Minimal production server for the MEM Healthcare SPA (Heroku-ready).
// Serves the Vite build in `dist/` and falls back to index.html for client routing.
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");

const app = express();

// Serve static assets produced by `vite build`.
app.use(express.static(distDir));

// Simple health check for platform probes.
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// SPA fallback: send index.html for any non-asset route.
app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`MEM Healthcare is running on port ${port}`);
});
