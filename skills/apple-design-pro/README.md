# apple-design-pro

Reviews websites for flaws and missing polish, and guides building motion and interaction to an Apple-like standard: instant response, continuous feedback, restraint, consistent detail. The agent-facing instructions are in [SKILL.md](SKILL.md); this page is the human-facing overview.

Scope is websites and web apps (HTML/CSS/JS and frameworks such as React, Next.js, Vue, Svelte). Apple's Human Interface Guidelines are written for native apps; the skill uses them for reasoning and translates to the web.

## Modes

| Mode | Trigger | Result |
| --- | --- | --- |
| Review | A URL, repo, file or screenshot, or "review / audit / what's wrong / make it look better" | A severity-ranked report with evidence and fixes. No code is changed unless asked. |
| Build | "Add a bottom sheet", "make this feel native", "animate this menu" | Implementation following the motion principles, with accessibility fallbacks. |

If the intent is unclear, the skill asks one short question. If you want both, it reviews first, then builds the fixes.

## Review lenses

Applied in this order. A lens is skipped only when it does not apply, and the report says so.

1. **Accessibility.** Contrast, focus visibility, keyboard path, target size, reduced motion, text zoom, labels, alt text, semantic elements. Failures here are the most serious and the most objective.
2. **Web lens.** Responsiveness, horizontal scroll, touch versus hover, Core Web Vitals, layout shifts, images, fonts, dark mode, forms.
3. **Visual craft and template look.** Type hierarchy, spacing rhythm, color discipline, restraint, signature element, and signals of a generic template.
4. **Motion and interaction.** Response latency, 1:1 tracking, interruptibility, springs versus fixed easings, enter/exit symmetry, rubber-banding, materials, feedback. Only motion that exists on the page is evaluated, but any transition, animation, canvas or translucent layer makes this lens mandatory.
5. **Content and microcopy.** Button labels that name the action, specific headings, error messages that say how to fix the problem, empty and loading states, filler text, placeholder text left in.

## Severity

| Level | Meaning |
| --- | --- |
| Critical | Blocks users or fails an accessibility baseline; fix before shipping. |
| High | Clearly hurts experience, trust or conversion for many users. |
| Medium | Noticeable polish gap or inconsistency. |
| Low | Small refinement or taste-level improvement. |

The examples in the severity table are a floor: a finding that matches one is ranked at least that high, or the report says why not.

Each finding is marked Verified (measured or directly seen) or Assessment (judgment, with a way to verify it). On a live site, behavior found by reading code (an overlay without Escape, a sticky hover) only counts as Verified once it has been reproduced in the browser, and findings from delegated sub-agents are spot-checked before they are reported. Choices the project documents as deliberate are not reported as flaws; only their concrete side effects are. The report ends with quick wins, what was not checked (every skipped or partial lens), and side observations.

If you ask for the findings to be fixed, the skill measures again with the same settings afterwards and reports a before/after table. A fix counts as done when the re-measurement shows it.

## Reference files

| File | Content | Used |
| --- | --- | --- |
| [`references/web-lens.md`](references/web-lens.md) | Responsiveness, touch and pointer, states and keyboard, contrast, Core Web Vitals, layout shifts, images, fonts, dark mode, forms | Review: always. Build: layout, forms, fonts, images, dark mode, accessibility. |
| [`references/motion-principles.md`](references/motion-principles.md) | 17 principles for motion, interaction and materials; adapted from Emil Kowalski (MIT) | Review: whenever anything moves or is translucent. Build: always. |
| [`references/visual-craft.md`](references/visual-craft.md) | Type hierarchy, spacing, color, restraint, signature element, generic-template signals, removal checklist | Review: for "less generic" requests. Build: layout, type, color. |
| [`references/hig-links.md`](references/hig-links.md) | Links to Apple's HIG pages, not copies | When a reason or citation needs Apple's own wording. |

## Measurement script

[`scripts/measure.mjs`](scripts/measure.mjs) measures a live site with Playwright across widths and light/dark: horizontal overflow and its culprits, tap targets, CLS/LCP, console errors, type inventory, DOM contrast, pixel contrast for text over canvas, images or gradients, a reduced-motion and a no-JavaScript pass, a high-contrast and forced-colors pass, and a keyboard focus pass. It ends with a compact per-route summary (`<out>.summary.txt`).

```
node scripts/measure.mjs https://example.com /,/pricing --out results.json
```

| Option | Purpose |
| --- | --- |
| `--widths 320,390,1440` | Viewport widths. Add `768,1024` for layouts with tablet breakpoints. |
| `--schemes light,dark` | Color schemes; one scheme is enough for a quick re-measurement. |
| `--state file.json` | Playwright `storageState` for pages behind a login. Use a test or demo account and keep the file out of the project. |
| `--skip passes,prefs,keyboard,pixel` | Skip passes to shorten a re-measurement. |
| `--shots dir` | Full-page screenshots plus viewport-height slices. |

What it deliberately ignores or handles: visually hidden `.sr-only` text is left out of contrast and type checks; an absolutely positioned element that escapes a scroll container is reported as an overflow culprit; a focus ring drawn on a child element counts as a focus indicator. `prefers-reduced-transparency` cannot be emulated by Playwright and has to be checked in code.

Requires Playwright (`npm i -D playwright && npx playwright install chromium`).

## Example prompts

```
Review https://example.com with apple-design-pro
Audit this component for accessibility and motion: src/components/Sheet.tsx
Make this landing page look less generic
Add an interruptible bottom sheet with spring physics
Make this menu animation respect reduced motion
```

## Limits

- **Screenshots only:** visual craft, hierarchy and approximate contrast can be judged. Motion, focus, performance and responsiveness cannot, and the report does not mark those lenses as clean.
- **Code only:** runtime behavior is not confirmed; affected findings are labeled as coming from code reading.
- **No browser or network access:** dependent findings are marked unverified rather than guessed.
- **Native iOS and macOS apps** are out of scope.
- Visual-craft findings are design opinion and are labeled as assessments.
- Numeric thresholds in `web-lens.md` should be re-checked against the linked specs before being quoted in a published report (see its "Verify" section).
