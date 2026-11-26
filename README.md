# SARRAF-5757.github.io

[Portfolio Website](https://sarraf-5757.github.io/)

Built with [M3E](https://matraic.github.io/m3e/) (Material 3 Expressive web components) and Tailwind CSS.

## Run locally

```bash
bun install
bun start
```

`bun start` rebuilds the site, then serves it at http://localhost:3000. The build:

1. `scripts/sync-icons.js` finds every `<m3e-icon name="...">` and updates the Material Symbols font link so only those icons are downloaded.
2. Tailwind CSS v4 compiles `css/input.css` (the theme config lives there) to `css/tailwind.css`.
3. Bun bundles `js/main.js` (M3E components + site logic) to `js/dist/main.js`.
