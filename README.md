# sayom.me

Personal research & portfolio site for **Nazmus Shakib Sayom**, PhD researcher in
cyber-physical systems safety and security at the University of Utah.

Live at **[sayom.me](https://sayom.me)**.

## Stack

A dependency-free static site: hand-written **HTML, CSS, and vanilla JavaScript**.
No framework, no build step, no bundler. What's in the repo is what ships.

- `index.html`: all page content (five sections: intro, work, timeline, portfolio, connect)
- `assets/css/style.css`: styling; theming via CSS custom properties (dark default, light via `[data-theme="light"]`)
- `assets/js/main.js`: a single `PortfolioInterface` class (theme toggle, scroll-spy nav, filters, image modal)

## Develop

No build required. Serve the repo root over static HTTP:

```bash
python3 -m http.server 5501   # http://localhost:5501
```

Or use the VS Code **Live Server** extension (configured for port 5501 in `.vscode/settings.json`).

## Deploy

Hosted on **GitHub Pages** from `main`, served at the custom domain in `CNAME`.
Pushing to `main` publishes the site.
