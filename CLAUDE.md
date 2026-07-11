# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal academic/portfolio website for Nazmus Shakib Sayom, served by **GitHub Pages** from the repo root at the custom domain `sayom.me` (see `CNAME`). Any push to `main` deploys the live site.

**It is a plain static site: vanilla HTML/CSS/JS with no build step, no framework, no bundler, no dependencies.** The `README.md` claim of "React, Tailwind CSS, and Vite" and its `npm run dev/build/preview` commands are inaccurate: there is no `package.json`, `src/`, or `node_modules/`. Edit the source files directly; the files in the repo *are* what ships.

## Developing

There is no compile/build/test step. Open `index.html` directly, or serve the root over static HTTP to preview:

```bash
python3 -m http.server 5501    # then open http://localhost:5501
```

The `.vscode/settings.json` also configures the VS Code **Live Server** extension on port 5501, which is the author's normal workflow.

To validate changes, load the page in a browser and exercise: theme toggle, panel navigation (dock + keyboard), mobile FAB menu, portfolio/timeline filters, and image modals.

## Architecture

Three source files hold everything:

- **`index.html`** (~49 KB) holds the entire page. All content is authored inline as `<section class="panel">` blocks; there is no templating or data file. The five panels, in navigation order, are `intro`, `work`, `timeline`, `portfolio`, `connect` (this order is mirrored in `main.js`'s `panelOrder` array, so keep them in sync). The `<head>` is deliberately heavy with SEO/social metadata: schema.org JSON-LD, Open Graph + Twitter cards, and Google Analytics (`gtag`, id `G-Y843CB9BRK`).
- **`assets/css/style.css`** (~44 KB) holds all styling. Theming is driven by **CSS custom properties**: dark is the default in `:root`, light overrides live in `[data-theme="light"]`. Reference colors/spacing/motion through these variables rather than hardcoding values.
- **`assets/js/main.js`** (~14 KB) is a single `PortfolioInterface` class instantiated on load. Its `init()` wires up focused methods: `setupTheme`, `setupNavigation`/`setupScrollSpy`, `setupMobileNavigation`, `setupImageModal` (keyboard-accessible figures + dialog focus management), `setupInteractions` (name typewriter), `setupKeyboard` (number-key panel shortcuts), and `initPanels` (research-domain / timeline / portfolio filters). Active-nav state flows through one helper, `updateActiveNav()`, which also sets `aria-current`. No state persists server-side.

Theme handling: the active theme is the `data-theme` attribute on `<html>`, persisted to `localStorage` under `theme`. If the user has never toggled manually, it follows the OS `prefers-color-scheme` and reacts to system changes; a manual toggle sets `manualThemeOverride` and stops the OS from overriding it.

## Conventions & gotchas

- Adding or renaming a panel means updating three places: the `<section id="...">` and its dock/mobile-nav buttons in `index.html`, the `panelOrder` array in `main.js`, and any panel-specific CSS.
- Fonts and icons load from CDNs (Google Fonts: JetBrains Mono + Space Grotesk; Font Awesome 6.4.0). A local Font Awesome **4.7.0** copy also exists under `assets/icons/`, so check which one a given icon uses before editing markup.
- SEO surface is intentional and coupled: when content or URLs change, keep `sitemap.xml` (`lastmod`), the canonical/OG tags, and the JSON-LD in `index.html` consistent.
- Résumé PDFs are versioned by filename in `assets/files/` (e.g. `sayom_resume_sept_2025.pdf`); links in `index.html` point at a specific file, so update the link when adding a newer one.
