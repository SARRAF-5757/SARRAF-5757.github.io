import { join, normalize, resolve } from "path";

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = resolve(import.meta.dir);

function getSafePath(urlPath: string): string | null {
  const decoded = decodeURIComponent(urlPath);
  const normalized = normalize(decoded).replace(/^(\.\.[\/\\])+/, "");
  const fullPath = join(PUBLIC_DIR, normalized);
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    return null;
  }
  return fullPath;
}

async function resolveFile(urlPath: string): Promise<Response> {
  const safePath = getSafePath(urlPath);
  if (!safePath) {
    return new Response("Forbidden", { status: 403 });
  }

  // 1. Direct file match
  const file = Bun.file(safePath);
  if (await file.exists()) {
    if (urlPath.endsWith("/")) {
      const indexFile = Bun.file(join(safePath, "index.html"));
      if (await indexFile.exists()) {
        return new Response(indexFile);
      }
    }
    return new Response(file);
  }

  // 2. HTML extension fallback (e.g. /projects -> /projects.html)
  const htmlFile = Bun.file(`${safePath}.html`);
  if (await htmlFile.exists()) {
    return new Response(htmlFile);
  }

  // 3. Directory index fallback
  const indexFile = Bun.file(join(safePath, "index.html"));
  if (await indexFile.exists()) {
    return new Response(indexFile);
  }

  return new Response("404 Not Found", { status: 404 });
}

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response(Bun.file(join(PUBLIC_DIR, "index.html")));
    }
    return resolveFile(url.pathname);
  },
});

console.log(`Portfolio server running at http://localhost:${server.port}`);

export default server;

