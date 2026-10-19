# Web Lens

> Own guidance, not from Apple sources. Web-platform checks that Apple's guidelines (written for native apps) do not cover. Numeric thresholds below are from WCAG 2.2 and the web.dev Core Web Vitals documentation as the author knows them; re-check them against the linked specs before quoting them in a published report (see "Verify" at the end).

Use this file for the **Web lens** in review mode. For every finding, say how you measured it or mark it as an assessment.

## 1. Responsiveness and layout

- **No horizontal scrolling at 320 CSS px width** (WCAG 1.4.10 Reflow, AA). Exception: genuinely two-dimensional content such as data tables or maps.
- Test at least: 320, ~390, ~768, ~1024, ~1440+. These are test widths, not required breakpoints; breakpoints should come from where the content breaks.
- Find overflow culprits in DevTools:
  ```js
  [...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth)
  ```
- Never block zoom: no `user-scalable=no` or restrictive `maximum-scale` in the viewport meta tag.
- Use `dvh`/`svh` instead of `100vh` for full-height mobile sections (the URL bar changes `100vh` behavior). Use `env(safe-area-inset-*)` with `viewport-fit=cover` for notched devices.
- Text must survive 200% zoom and user font-size changes (WCAG 1.4.4). Prefer `rem` for type and spacing. Long words and URLs need `overflow-wrap: anywhere` (or `break-word`) in narrow containers.
- Sticky headers hide anchor targets: set `scroll-padding-top` on `html`.

## 2. Touch and pointer

- **Target size:** WCAG 2.2 SC 2.5.8 requires 24x24 CSS px minimum (AA); SC 2.5.5 recommends 44x44 (AAA). Apple's own guidance for touch is around 44 pt. Treat 44px as the quality target for primary touch controls, 24px as the failure line.
- A small icon may have a larger hit area via padding or a pseudo-element; measure the hit area, not the glyph.
- Spacing between adjacent targets matters as much as size.
- Hover is not available on touch. Gate hover styling: `@media (hover: hover) and (pointer: fine) { ... }`. Nothing essential may be reachable only via hover (tooltips, menus, previews).
- `touch-action: manipulation` on controls removes double-tap-zoom delay. Press feedback belongs on `:active` (see motion-principles.md §1).
- iOS Safari zooms into inputs with a computed font size below 16px on focus; keep form fields at 16px or larger (widely observed behavior, check on a real device).

## 3. Interactive states and keyboard

Every interactive element needs distinct states: default, hover, `:focus-visible`, active/pressed, disabled, and where relevant loading and error.

- **Focus must be visible** on every focusable element. `outline: none` with no replacement is a High finding. Prefer `:focus-visible` so mouse clicks do not show rings. A solid 2px outline with `outline-offset` and 3:1 contrast against adjacent colors is a safe default.
- WCAG 2.2 SC 2.4.11 (AA): a focused element must not be fully hidden by sticky headers, cookie banners or chat widgets.
- **Keyboard path:** tab through the whole page. Order follows visual order; no `tabindex` above 0; no keyboard traps; a "skip to content" link exists on pages with large headers.
- Use native elements: `<button>` for actions, `<a href>` for navigation, `<dialog>` or an equivalent with focus management for modals. A clickable `<div>` is a finding.
- Overlays: Escape closes, focus moves in on open and returns to the trigger on close, background is `inert`.
- Custom widgets (tabs, menus, comboboxes) must follow the WAI-ARIA Authoring Practices keyboard patterns, or be replaced by native controls.
- Visible label or accessible name on every icon-only button (`aria-label`).

## 4. Color and contrast (WCAG 2.2)

- Body text: **4.5:1** against its background (AA). Large text (at least 24px, or at least ~18.66px bold): **3:1**.
- UI component boundaries, icons that carry meaning, focus indicators, chart marks: **3:1** against adjacent colors (SC 1.4.11).
- Placeholder text, disabled-looking secondary text, and text over images or gradients are the usual failures. Measure the worst point of a gradient or photo, not the average.
- Do not encode meaning by color alone (errors, status, links inside text need a second cue such as underline, icon or text).
- Measure with DevTools' color picker (contrast ratio shown), or axe / Lighthouse. Report the measured ratio and the required one.
- DOM-based tools (axe, Lighthouse, scripts reading computed styles) only see CSS background colors. Text over a canvas, image, video, gradient or semi-transparent layer is unmeasured by them, not passed. Measure pixels: screenshot the text's bounding box, screenshot it again with the text set to `color: transparent` (and `-webkit-text-fill-color: transparent`), then compute the ratio of the text color against every background pixel and report the minimum and the 5th percentile. For animated backgrounds, sample several moments and report the worst. `scripts/measure.mjs` implements this.
- `prefers-contrast: more` and Windows `forced-colors: active` should not break the layout; check that borders and icons survive.

## 5. Loading and Core Web Vitals

Core Web Vitals are assessed at the **75th percentile of real-user page loads**, per metric, mobile and desktop separately. Current "good" thresholds:

| Metric | Good | Poor |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | 2.5 s or less | over 4 s |
| INP (Interaction to Next Paint) | 200 ms or less | over 500 ms |
| CLS (Cumulative Layout Shift) | 0.1 or less | over 0.25 |

INP replaced FID as the responsiveness metric in 2024.

- **Lab vs field:** Lighthouse and DevTools give lab numbers (one device, one run). Real-user numbers come from CrUX (PageSpeed Insights "field data") or your own RUM. Say which one a figure is. Never present a single Lighthouse run as the page's Core Web Vitals.
- **LCP:** identify the LCP element (DevTools Performance panel, Lighthouse). Typical fixes: do not lazy-load it, `fetchpriority="high"` on a hero image, serve it at the right size and modern format, cut render-blocking CSS/JS, reduce server response time.
- **INP:** long main-thread tasks on interaction. Look for heavy handlers, large re-renders, synchronous third-party scripts. Break work up, defer non-urgent work.
- **CLS:** see section 6.
- Third-party scripts (chat widgets, tag managers, embeds) are the most common avoidable cost; list them with their weight.
- Show feedback within ~100 ms of input even when the work takes longer (spinner, optimistic state, skeleton). Skeletons should match the final layout.

## 6. Layout shifts

- Every `<img>`, `<video>` and `<iframe>` has `width` and `height` attributes (or CSS `aspect-ratio`) so space is reserved before load.
- Reserve space for late content: cookie banners, ads, embeds, injected promos. Insert new content below the viewport or in reserved slots, never above what the user is reading.
- Web fonts: see section 8; a font swap can reflow text.
- Animate `transform` and `opacity`, not `top`, `left`, `width`, `height`, `margin`.
- Check: DevTools Performance panel "Layout Shifts" track, or the Layout Shift Regions highlight in rendering settings.

## 7. Images and media

- Formats: AVIF or WebP for photos, SVG for icons and logos, PNG only when needed. Compare the actual byte size; a 2 MB hero is a finding on its own.
- Responsive: `srcset` with `sizes` so phones do not download desktop images. Render width times device pixel ratio is the useful upper bound for the source width.
- `loading="lazy"` for below-the-fold images only; never on the likely LCP image. `decoding="async"` is fine for non-critical images.
- Meaningful `alt` text; empty `alt=""` for decoration.
- Autoplaying video: muted, `playsinline`, a poster image, and respect reduced motion and data-saving contexts. No sound without user action.

## 8. Fonts

- Serve WOFF2, subset to the needed character ranges, as few weights as the design truly uses (variable fonts help).
- `font-display: swap` (visible fallback first) or `optional` (no late swap, fewer shifts). Never leave text invisible while the font loads.
- Preload only the one or two critical font files (`<link rel="preload" as="font" type="font/woff2" crossorigin>`).
- Reduce swap jumps by tuning the fallback with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` in a fallback `@font-face`.
- A system font stack (`system-ui`) costs zero bytes and matches the platform; see motion-principles.md §15 for typographic tuning.

## 9. Dark mode and user preferences

- Support `prefers-color-scheme`. Declare `color-scheme: light dark` (CSS or meta) so native controls and scrollbars follow. Use CSS custom properties for color tokens and swap them in one place.
- Dark mode is not inversion: re-check contrast, reduce pure `#fff` on pure `#000` glare, and lower the visual weight of large bright surfaces. Images and logos need dark variants or safe backgrounds.
- If a manual theme toggle exists, it must persist, respect the system default on first visit, and avoid a flash of the wrong theme on load (set the attribute before first paint).
- `prefers-reduced-motion: reduce`: replace movement with fades or nothing. Auto-playing carousels, parallax and looping background video are the usual offenders. Scroll-linked effects and `scroll-behavior: smooth` should be gated too. Details: motion-principles.md §14.
- Also consider `prefers-reduced-transparency` and `prefers-contrast` (motion-principles.md §14); browser support varies, so test rather than assume.
- Check by emulation: DevTools > Rendering > "Emulate CSS media feature".

## 10. Forms

- Every field has a visible, programmatically associated `<label>`. Placeholder text is not a label.
- Correct `type`, `inputmode` and `autocomplete` tokens (`email`, `tel`, `one-time-code`, `street-address`, ...), so mobile keyboards and autofill work.
- Do not block paste, including password fields. Authentication must not depend on a cognitive test (WCAG 2.2 SC 3.3.8, AA); do not ask users to re-enter data you already have (SC 3.3.7).
- Validation: say what is wrong and how to fix it, next to the field, linked with `aria-describedby`; do not rely on color alone. Validate on blur or submit rather than on every keystroke. Keep the user's input after an error.
- Mark required fields in text, not only with a color or asterisk-only convention that is not explained.
- The submit button states its action ("Create account", not "Submit"), shows a pending state, and prevents double submission.
- Multi-step forms: show progress, allow going back without data loss.

## 11. Verify

Items in this file that should be re-checked against primary sources before being cited publicly (author's assessment: believed correct, not re-verified against the sources in this session):

- WCAG 2.2 criteria numbers and levels: https://www.w3.org/TR/WCAG22/
- Core Web Vitals thresholds and percentile rule: https://web.dev/articles/vitals
- iOS Safari 16px input zoom behavior: test on a device.
- `dvh`/`svh`, `font-display`, `size-adjust`, `:focus-visible`, `inert`, `<dialog>` support: https://caniuse.com
