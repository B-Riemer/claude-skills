# Changelog

All notable changes to this repository are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.2.0] - 2026-10-22

Changes from the second real review run (a full review of a Next.js web app, 7 public and 18 logged-in pages, followed by fixes and a re-measurement).

### Added
- `measure.mjs --state`: Playwright `storageState` for pages behind a login.
- `measure.mjs --schemes` and `--skip` to shorten re-measurements.
- Preferences pass at 390 px: DOM contrast and remaining `backdrop-filter` layers under `prefers-contrast: more` and `forced-colors: active`.
- Per-route summary at the end of a run, also written to `<out>.summary.txt`, so the agent no longer writes its own aggregation scripts.
- Review rule: on a live site, behavior found by reading code is Verified only after it was reproduced in the browser; sub-agent findings are spot-checked before reporting. In the second run, one finding from code reading turned out to be wrong.
- Review rule: measure 768 and 1024 px when the layout changes between phone and desktop.
- "After fixes: re-measure" step with a before/after table.

### Changed
- Severity examples are a floor; ranking a matching finding lower needs a stated reason. In the second run, tap targets under 24 px and text under 4.5:1 were ranked one level too low.
- "From code" is a source, not a third evidence label; findings stay Verified or Assessment.

### Fixed
- `measure.mjs` overflow: an absolutely positioned element inside a scroll container whose containing block lies outside it (for example an `.sr-only` span in a table wrapper without `position: relative`) is now reported as the culprit. Before, the page overflowed with an empty culprit list.
- `measure.mjs` contrast: visually hidden `.sr-only` text no longer produces contrast failures.
- `measure.mjs` keyboard: a focus ring drawn on a child element, or a border/background change, now counts as a focus indicator (focused vs. unfocused comparison).

## [1.1.0] - 2026-10-19

Changes from the first real review run (a full-site review of a live Astro site).

### Added
- `apple-design-pro/scripts/measure.mjs`: reusable Playwright measurement script, so a review no longer starts by writing one from scratch.
- Pixel-based contrast measurement for text over canvas, images, video and gradients, which DOM-based tools cannot judge.
- Review step "Deliberate decisions": read the project's rules first; owner-approved choices are not reported as flaws, only their side effects.

### Changed
- The motion lens is mandatory as soon as anything on the page moves or is translucent, and `motion-principles.md` must be loaded before writing motion findings. In the first run it was skipped silently.
- Every skipped or partial lens must appear under "Not checked".
- Citations always name the file ("web-lens.md §4"), never a bare "§N".

## [1.0.0] - 2026-10-19

### Added
- Initial release of `apple-design-pro`: review and build modes for web interfaces, five review lenses, severity ranking, and reference files for web checks, motion, visual craft and Apple HIG links.
- Claude Code plugin marketplace manifest (`bjorvik-skills`).
- CI validation of skill frontmatter, relative links and the marketplace manifest.
