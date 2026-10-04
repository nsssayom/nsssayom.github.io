# sayom.me

Personal research and software portfolio for **Nazmus Shakib Sayom**, PhD
researcher in cyber-physical systems safety and security at the University of Utah.

Live at **[sayom.me](https://sayom.me)**.

## Stack

A static site written in HTML, CSS, and vanilla JavaScript. No framework,
build step, or runtime package dependencies.

- `index.html`: introduction, research, selected projects, career (including
  honors and awards), and contact. Award announcement links use event names;
  team recognition is explicitly attributed to the team.
  External websites and PDF documents open in a new tab with `noopener noreferrer`;
  section navigation, email links, and the image viewer retain their native behavior.
- `assets/css/style.css`: responsive layout, dark/light themes, and print styles.
- `assets/js/main.js`: terminal name animation, theme preference, active navigation, project filters,
  mobile menu, and native image dialogs. Content and section links work without
  JavaScript. Email links decode the contact address on initialization into native
  `mailto:` links; the Contact section displays the address for copying. The
  address stays encoded in source, but is visible to browsers running JavaScript.
  Other contact links remain available without JavaScript.
- `assets/images/social-preview-v2.png`: 1200 × 630 social card shared by Open Graph
  and Twitter metadata. The versioned URL avoids reusing the old preview asset.
- `assets/images/thumbnails/`: prefiltered 400, 600, and 800-pixel artwork exports
  for smooth linework on standard-density screens. Responsive `srcset`/`sizes`
  select the appropriate file; the image viewer always opens the full original.
  Regenerate with `bash scripts/build-artwork-thumbnails.sh` (ImageMagick).
- `assets/images/portfolio/disaster-tracking.webp`: AI-generated concept
  illustration, not a deployment photograph or measured topology. Its caption
  identifies it as such.
- `assets/images/research/property-guided-surrogation.webp`: original AI-generated
  conceptual illustration of the published paper’s method, not an experimental
  plot or a hardware schematic.
- `assets/images/portfolio/theia-omr.webp`: AI-generated OMR workflow illustration
  showing answer-sheet detection and response extraction, without a wordmark.
- `assets/images/portfolio/buggy-drone.webp`: AI-generated concept artwork of the
  simulator's emergency-flight scenario, not a screenshot or measured trajectory.
- `assets/images/portfolio/depen-banner.webp` and `talk-e-banner.webp`: AI-assisted
  presentations based on the original prototype photographs, with hands removed
  and settings reconstructed. Originals remain in `DePen.jpg` and `talkie.jpg`.
- `assets/images/portfolio/voice-remote.webp`: concept presentation of the
  transmitter and receiver together, based on the prototype photographs in the
  public `VoiceRemoteTx` and `VoiceRemoteRx` repositories. The card links both
  repositories and uses the same neutral artwork in either theme.
  The unmodified source photographs are retained as `voice-remote-tx-original.jpg`
  and `voice-remote-rx-original.jpg`, accessible from the image-viewer caption.

Project descriptions and links should be grounded in public artifacts. Do not
add unpublished research details or private repository links.

## Develop

Serve the repository root:

```bash
python3 -m http.server 5501 --bind 127.0.0.1
```

For live CSS updates and automatic reloads when files change, optionally use
BrowserSync through npm (development only; it is not a site dependency):

```bash
npx --yes browser-sync start --server . \
  --files 'index.html' 'assets/css/*.css' 'assets/js/*.js' 'assets/images/**/*' \
  --host 127.0.0.1 --port 5502 --no-open --no-ui --no-notify
```

Open <http://localhost:5502> for the hot-reloading preview.

## Check changes

- Check desktop and mobile layouts in both themes.
- Check mobile menu opening, Escape, outside clicks, section navigation, and
  footer clearance in portrait and landscape.
- Exercise anchor navigation, browser back/forward, and all project filters.
- Open a figure by keyboard; check Escape, focus trapping, and focus return.
- Check reduced motion, page overflow, image loading, links, and console errors.
- Validate local asset paths, unique IDs, and JSON-LD after content edits.
- Keep `sitemap.xml` and structured-data dates aligned with content changes.

The résumé currently linked is `assets/files/sayom_resume_oct_2026.pdf`; the visible
link is labeled “Résumé.” Its editable LaTeX source is maintained in
`~/Dev/resume/main.tex`. Rebuild and review that PDF before updating both links
in `index.html` to a new versioned file.

## Deploy

GitHub Pages serves `main` at the custom domain in `CNAME`.
**Pushing to `main` publishes the site.** Review changes before committing or
pushing.
