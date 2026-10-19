# Changelog

All notable changes to this repository are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
