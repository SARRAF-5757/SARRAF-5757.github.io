// Saved theme preferences, shared by the bundle and applied before M3E upgrades <m3e-theme>.
export const DEFAULT_COLOR = "#4CAF50";
export const STORAGE = {
  color: "m3-theme-color",
  scheme: "m3-scheme", // "light" | "dark" | absent (follow system)
  cache: "m3-theme-cache",
};

export function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function write(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode etc.) — preferences just won't persist */
  }
}

export function savedScheme() {
  const s = read(STORAGE.scheme);
  return s === "light" || s === "dark" ? s : null;
}

export function savedColor() {
  return read(STORAGE.color) || DEFAULT_COLOR;
}

const theme = document.getElementById("theme");
if (theme) {
  theme.setAttribute("color", savedColor());
  theme.setAttribute("scheme", savedScheme() ?? "auto");
}
