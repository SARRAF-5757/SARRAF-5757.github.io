// Runs as part of `bun run build`.
// Finds every Material Symbol used (<m3e-icon name="...">) in the pages and js/,
// then rewrites the Material Symbols <link> in each page to download only those
// icons (Google Fonts `icon_names=`), instead of the multi-megabyte full font.
import { readFileSync, writeFileSync } from "node:fs";

const scan = (pattern) => [...new Bun.Glob(pattern).scanSync(".")];
const pages = [...scan("*.html"), ...scan("projects/*.html")];
const sources = [...pages, ...scan("js/*.js")];

const names = new Set();
for (const file of sources) {
  for (const [, attrs] of readFileSync(file, "utf8").matchAll(/<m3e-icon\b([^>]*)>/g)) {
    const name = attrs.match(/\bname="([a-z0-9_]+)"/)?.[1];
    if (name) names.add(name);
  }
}

// Google Fonts requires the list to be alphabetical.
const iconList = [...names].sort().join(",");
const href =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" +
  `&icon_names=${iconList}&display=block`;

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const updated = html.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Rounded[^"]*"/, `href="${href}"`);
  if (updated !== html) writeFileSync(page, updated);
}

console.log(`Material Symbols: ${names.size} icons → ${iconList}`);
