# Repository notes

Personal portfolio for Nazmus Shakib Sayom, hosted on GitHub Pages at `sayom.me`.
Pushing `main` deploys the site. Do not commit or publish before the user has
reviewed the requested change brief.

This is plain HTML, CSS, and JavaScript, with no build step or runtime package
dependencies. See README.md for static and hot-reloading preview commands.

## Structure

- `index.html`: five sections in order: `intro`, `work`, `portfolio`, `timeline`,
  `connect`. Navigation uses native fragment links. Keep stable section IDs.
- `assets/css/style.css`: CSS custom properties for colors; dark default,
  light theme selected through `data-theme` on the root element.
- `assets/js/main.js`: `PortfolioInterface` progressively enhances theme controls,
  scroll navigation state, project filtering, the terminal name animation, and
  the native image dialog.

An early script sets the theme before paint. Default to dark regardless of the
system theme; light mode is an explicit toggle choice, remembered across visits.
Both theme paths tolerate blocked
localStorage. Filters hide non-matching cards with `hidden`; the controls are
hidden until JavaScript initializes. Do not hide ordinary content behind JS.

## Content and assets

Use only public, verified project information. Local private repositories and
unpublished research can provide context but must not be copied into this site.
Keep development status accurate and show all selected projects in the main gallery.

Label the research, Buggy Drone, disaster-tracking, and Theia banners as concept
artwork in the viewer. Do not describe them as actual deployments or measured
results. DePen and TALK-E retain their AI-assisted captions and original-photo links.

SEO metadata, social preview, JSON-LD, canonical URL, and sitemap should remain
consistent. The site retains Google Analytics. Fonts come from Google Fonts;
there is no icon-font dependency. The older local Font Awesome files are unused.

Résumé PDFs are versioned under `assets/files`; the visible link is simply
“Résumé.” Do not silently substitute a private résumé.

## Validation

Exercise desktop/mobile layouts and both themes, native anchor navigation,
filters and image dialogs (keyboard opening,
Escape, focus trapping, focus return). Check console errors, local asset paths,
duplicate IDs, structured data, and outgoing links. The static page must remain
readable and navigable if JavaScript or localStorage is unavailable.

Keep the name on a single line in monospace, with a typewriter reveal and blinking block cursor.
The user explicitly requested these. Respect reduced motion by showing the full
name and a steady cursor. Keep the theme toggle in the bottom navigation dock;
on mobile, the dock becomes an icon-only hamburger menu. Do not add a separate
masthead. Keep email addresses encoded in source; initialize native mailto links
and show the decoded address in Contact so visitors can copy it.
