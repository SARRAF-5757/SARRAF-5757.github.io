// Entry point bundled into js/dist/main.js by `bun run build`.
// prefs.js runs first so <m3e-theme> has the saved color/scheme before it upgrades.
import "./prefs.js";

import "@m3e/web/theme";
import "@m3e/web/button";
import "@m3e/web/icon-button";
import "@m3e/web/button-group";
import "@m3e/web/icon";
import "@m3e/web/shape";
import "@m3e/web/card";
import "@m3e/web/chips";
import "@m3e/web/tabs";
import "@m3e/web/toolbar";

import "./site.js";
