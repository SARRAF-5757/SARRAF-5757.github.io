// Material 3 color roles are CSS variables written by <m3e-theme>.
// color-mix() lets Tailwind opacity modifiers (e.g. bg-surfaceContainer/80) work with them.
const token = (name) => `color-mix(in srgb, var(--md-sys-color-${name}) calc(<alpha-value> * 100%), transparent)`;

const roles = {
  primary: "primary",
  onPrimary: "on-primary",
  primaryContainer: "primary-container",
  onPrimaryContainer: "on-primary-container",
  secondary: "secondary",
  onSecondary: "on-secondary",
  secondaryContainer: "secondary-container",
  onSecondaryContainer: "on-secondary-container",
  tertiary: "tertiary",
  onTertiary: "on-tertiary",
  tertiaryContainer: "tertiary-container",
  onTertiaryContainer: "on-tertiary-container",
  background: "background",
  onBackground: "on-background",
  surface: "surface",
  onSurface: "on-surface",
  onSurfaceVariant: "on-surface-variant",
  surfaceContainerLowest: "surface-container-lowest",
  surfaceContainerLow: "surface-container-low",
  surfaceContainer: "surface-container",
  surfaceContainerHigh: "surface-container-high",
  surfaceContainerHighest: "surface-container-highest",
  inverseSurface: "inverse-surface",
  inverseOnSurface: "inverse-on-surface",
  outline: "outline",
  outlineVariant: "outline-variant",
};

module.exports = {
  content: ["./*.html", "./projects/**/*.html", "./js/*.js"],
  theme: {
    extend: {
      colors: Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, token(v)])),
      borderRadius: {
        "4xl": "28px",
        "5xl": "32px",
      },
      fontFamily: {
        sans: ['"Google Sans Flex"', '"Google Sans"', "Roboto", "system-ui", "sans-serif"],
      },
    },
  },
};
