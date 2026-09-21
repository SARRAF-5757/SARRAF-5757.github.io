import "https://esm.sh/@material/web/all.js";
      import { themeFromSourceColor, applyTheme, argbFromHex } from "https://esm.sh/@material/material-color-utilities";
      import { NAVBAR_LOGO_SVG, FAVICON_SVG_TEMPLATE } from "./svgs.js";
      document.getElementById("navbar-logo-container").innerHTML = NAVBAR_LOGO_SVG;

      const allColors = ["#4CAF50", "#2196F3", "#9C27B0", "#FF9800", "#F44336", "#FFEB3B"];
      let currentColorHex = localStorage.getItem("m3-theme-color") || "#4CAF50";
      let currentTheme = null;
      let isPickerOpen = false;

      function renderColorOptions() {
        const optionsContainer = document.getElementById("color-options");
        optionsContainer.innerHTML = "";
        allColors.forEach((color) => {
          if (color !== currentColorHex) {
            const btn = document.createElement("button");
            btn.className = `w-9 h-9 rounded-full flex-shrink-0 transition-transform hover:scale-110`;
            btn.style.backgroundColor = color;
            btn.onclick = (e) => window.setColor(color, e);
            optionsContainer.appendChild(btn);
          }
        });
        document.getElementById("current-color-circle").style.backgroundColor = currentColorHex;
      }

      window.setColor = function (hex, event) {
        if (event) {
          event.stopPropagation();
        }
        currentColorHex = hex;
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches || true;
        currentTheme = themeFromSourceColor(argbFromHex(hex));
        applyTheme(currentTheme, { target: document.body, dark: true });
        localStorage.setItem("m3-theme-color", hex);
        // Update favicon dynamically
        const faviconSvg = FAVICON_SVG_TEMPLATE(hex);

        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.type = "image/svg+xml";
        link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(faviconSvg);

        renderColorOptions();

        if (window.closeColorPicker) window.closeColorPicker();
      };

      window.toggleColorPicker = function (event) {
        if (event) event.stopPropagation();
        const container = document.getElementById("color-picker-container");
        const options = document.getElementById("color-options");

        if (!isPickerOpen) {
          container.style.height = "280px";

          options.classList.remove("opacity-0", "pointer-events-none");
          options.classList.add("opacity-100", "pointer-events-auto");
          isPickerOpen = true;
        } else {
          if (window.closeColorPicker) window.closeColorPicker();
        }
      };

      window.closeColorPicker = function () {
        const container = document.getElementById("color-picker-container");
        const options = document.getElementById("color-options");
        if (isPickerOpen) {
          container.style.height = "52px";

          options.classList.remove("opacity-100", "pointer-events-auto");
          options.classList.add("opacity-0", "pointer-events-none");
          isPickerOpen = false;
        }
      };

      document.addEventListener("click", (e) => {
        const container = document.getElementById("color-picker-container");
        if (isPickerOpen && !container.contains(e.target)) {
          if (window.closeColorPicker) window.closeColorPicker();
        }
      });

      window.setColor(currentColorHex, null);

      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (currentTheme) {
          applyTheme(currentTheme, { target: document.body, dark: window.matchMedia("(prefers-color-scheme: dark)").matches });
        }
      });