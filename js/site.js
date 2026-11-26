import { NAVBAR_LOGO_SVG, FAVICON_SVG_TEMPLATE } from "./svgs.js";
import { STORAGE, write, savedColor, savedScheme } from "./prefs.js";

const theme = document.getElementById("theme");
const root = document.documentElement;
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const COLORS = [
  { hex: "#4CAF50", name: "Green" },
  { hex: "#2196F3", name: "Blue" },
  { hex: "#9C27B0", name: "Purple" },
  { hex: "#FF9800", name: "Orange" },
  { hex: "#F44336", name: "Red" },
  { hex: "#FFEB3B", name: "Yellow" },
];

// Tokens cached in localStorage so the inline <head> script can paint the right colors before the bundle loads.
const CACHED_TOKENS = [
  "background", "on-background", "surface", "surface-dim", "surface-bright",
  "surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest",
  "on-surface", "on-surface-variant", "outline", "outline-variant", "inverse-surface", "inverse-on-surface",
  "primary", "on-primary", "primary-container", "on-primary-container", "inverse-primary",
  "secondary", "on-secondary", "secondary-container", "on-secondary-container",
  "tertiary", "on-tertiary", "tertiary-container", "on-tertiary-container",
].map((t) => `--md-sys-color-${t}`);

/* ---------------------------------------------------------------- Logo --- */

const logo = document.getElementById("navbar-logo-container");
if (logo) logo.innerHTML = NAVBAR_LOGO_SVG;

/* ------------------------------------------------------- Theme helpers --- */

const isDark = () => {
  const s = savedScheme();
  return s ? s === "dark" : systemDark.matches;
};

function setFavicon(hex) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/svg+xml";
  link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(FAVICON_SVG_TEMPLATE(hex));
}

function cacheTokens() {
  const cs = getComputedStyle(root);
  const css = CACHED_TOKENS.map((t) => `${t}:${cs.getPropertyValue(t).trim()}`).join(";");
  // Tint the mobile browser bar to match the nav surface.
  const themeColor = cs.getPropertyValue("--md-sys-color-surface-container").trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && themeColor) meta.content = themeColor;
  write(STORAGE.cache, JSON.stringify({ color: savedColor(), dark: isDark(), css, themeColor }));
  // The pre-paint cache has done its job; drop it so it can't shadow later changes.
  document.getElementById("theme-cache")?.remove();
}

theme?.addEventListener("change", (e) => {
  // Toggle buttons inside the theme also fire bubbling `change` events; only react to the theme itself.
  if (e.target !== theme) return;
  root.dataset.scheme = isDark() ? "dark" : "light";
  syncRail();
  cacheTokens();
});

systemDark.addEventListener("change", () => {
  if (!savedScheme()) {
    root.dataset.scheme = systemDark.matches ? "dark" : "light";
    syncRail();
  }
});

/* ------------------------------------------- Left rail: scheme + color --- */

const rail = document.createElement("div");
rail.className = "theme-rail";
rail.innerHTML = `
  <m3e-toolbar vertical shape="rounded" elevated aria-label="Theme settings">
    <m3e-icon-button id="scheme-toggle" toggle aria-label="Dark mode">
      <m3e-icon variant="rounded" name="dark_mode"></m3e-icon>
      <m3e-icon slot="selected" variant="rounded" name="light_mode"></m3e-icon>
    </m3e-icon-button>
    <span class="theme-rail-divider" aria-hidden="true"></span>
    <m3e-icon-button id="color-toggle" aria-label="Theme color" aria-expanded="false" aria-controls="color-options">
      <span class="swatch swatch-current"></span>
    </m3e-icon-button>
    <div id="color-options" class="color-options" role="group" aria-label="Theme colors">
      <div class="color-options-inner">
        ${COLORS.map(
          (c) => `<m3e-icon-button class="color-option" data-color="${c.hex}" aria-label="${c.name}">
              <span class="swatch" style="background:${c.hex}"></span>
            </m3e-icon-button>`,
        ).join("")}
      </div>
    </div>
  </m3e-toolbar>`;
(theme ?? document.body).appendChild(rail);

const schemeToggle = rail.querySelector("#scheme-toggle");
const colorToggle = rail.querySelector("#color-toggle");
const colorOptions = rail.querySelector("#color-options");

function syncRail() {
  const dark = isDark();
  schemeToggle.selected = dark;
  schemeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  const current = savedColor().toUpperCase();
  rail.querySelector(".swatch-current").style.background = current;
  rail.querySelectorAll(".color-option").forEach((btn) => {
    btn.hidden = btn.dataset.color.toUpperCase() === current;
  });
}

schemeToggle.addEventListener("click", () => {
  // Read the state we're leaving rather than the (possibly already toggled) `selected` property.
  const next = isDark() ? "light" : "dark";
  write(STORAGE.scheme, next);
  theme?.setAttribute("scheme", next);
  root.dataset.scheme = next;
  syncRail();
});

function setPickerOpen(open) {
  rail.classList.toggle("is-open", open);
  colorToggle.setAttribute("aria-expanded", String(open));
}

colorToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  setPickerOpen(!rail.classList.contains("is-open"));
});

colorOptions.addEventListener("click", (e) => {
  const btn = e.target.closest(".color-option");
  if (!btn) return;
  e.stopPropagation();
  const hex = btn.dataset.color;
  write(STORAGE.color, hex);
  theme?.setAttribute("color", hex);
  setFavicon(hex);
  syncRail();
  setPickerOpen(false);
  colorToggle.focus();
});

document.addEventListener("click", (e) => {
  if (!rail.contains(e.target)) setPickerOpen(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && rail.classList.contains("is-open")) {
    setPickerOpen(false);
    colorToggle.focus();
  }
});

root.dataset.scheme = isDark() ? "dark" : "light";
setFavicon(savedColor());
// m3e-theme only fires `change` on later updates, so seed the token cache after its first render.
if (theme) {
  customElements
    .whenDefined("m3e-theme")
    .then(() => theme.updateComplete)
    .then(() => requestAnimationFrame(cacheTokens));
}
customElements.whenDefined("m3e-icon-button").then(syncRail);

/* ---------------------------------------------------------- Mobile nav --- */

const menuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
if (menuButton && mobileMenu) {
  const setMenu = (open) => {
    mobileMenu.classList.toggle("menu-open", open);
    menuButton.selected = open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  menuButton.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("menu-open")));
  mobileMenu.addEventListener("click", (e) => {
    if (e.target.closest("a, m3e-button")) setMenu(false);
  });
}

/* ----------------------------------------------------------- Scrollspy --- */

const navButtons = [...document.querySelectorAll("[data-nav-target]")];
const spySections = [...document.querySelectorAll("section[data-nav]")];
if (navButtons.length && spySections.length) {
  const select = (target) => {
    navButtons.forEach((b) => {
      const on = b.dataset.navTarget === target;
      b.selected = on;
      if (on) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
  };
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) select(entry.target.dataset.nav);
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  spySections.forEach((s) => spy.observe(s));
  customElements.whenDefined("m3e-button").then(() => select(spySections[0].dataset.nav));
}

/* ------------------------------------------------- Shape morph on hover --- */

// Any [data-morph] container morphs its descendant <m3e-shape data-hover-shape> while hovered or focused.
document.querySelectorAll("[data-morph]").forEach((host) => {
  const shapes = [...host.querySelectorAll("m3e-shape[data-hover-shape]")];
  shapes.forEach((s) => (s.dataset.baseShape = s.getAttribute("name")));
  const morph = (on) => shapes.forEach((s) => s.setAttribute("name", on ? s.dataset.hoverShape : s.dataset.baseShape));
  host.addEventListener("pointerenter", () => morph(true));
  host.addEventListener("pointerleave", () => morph(false));
  host.addEventListener("focusin", () => morph(true));
  host.addEventListener("focusout", (e) => {
    if (!host.contains(e.relatedTarget)) morph(false);
  });
});

/* ------------------------------------------------------ Hero shape loop --- */

const heroShape = document.getElementById("hero-shape");
if (heroShape) {
  const names = ["12-sided-cookie", "sunny", "flower", "8-leaf-clover", "soft-burst", "pentagon"];
  let i = 0;
  let timer = null;
  const next = () => heroShape.setAttribute("name", names[(i = (i + 1) % names.length)]);
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const start = () => {
    if (!timer && !reducedMotion.matches) timer = setInterval(next, 4500);
  };
  // Only animate while the hero is on screen.
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(heroShape);
  reducedMotion.addEventListener("change", () => (reducedMotion.matches ? stop() : start()));
  heroShape.parentElement.addEventListener("click", next);
}

/* ------------------------------------------------------- Scroll reveal --- */

const reveals = document.querySelectorAll(".reveal");
if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("is-visible"));
} else {
  // Stagger siblings inside [data-stagger] grids.
  document.querySelectorAll("[data-stagger]").forEach((grid) => {
    [...grid.children].forEach((child, n) => child.style.setProperty("--reveal-delay", `${Math.min(n, 8) * 60}ms`));
  });
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  reveals.forEach((el) => io.observe(el));
}
