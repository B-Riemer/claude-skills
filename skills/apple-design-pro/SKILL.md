---
name: apple-design-pro
description: Review, audit or build websites with Apple-grade polish in motion, interaction and visual craft. Use when the user asks to review or audit their website or UI, find small flaws, make a page look more premium or less generic or less like a template, or wants Apple-style UI, spring animations, gestures, drag/swipe/sheet interactions, translucent materials, refined typography, or reduced-motion and dark-mode handling. Web only (HTML/CSS/JS and frameworks such as React, Next.js, Vue, Svelte), not native iOS or macOS apps.
---

# Apple Design Pro (web)

Two modes for websites: **Review** (find what is wrong, rank it, say how to fix it) and **Build** (get motion and interaction right while writing code). The bar is Apple-like quality: instant response, continuous feedback, restraint, and details that are consistent rather than decorative.

Scope: websites and web apps. Apple's Human Interface Guidelines are written for native apps, so use them for reasoning and translate to the web; do not copy iOS patterns literally.

## Pick the mode

- The user shares a URL, repo, file, screenshot or says "review / audit / check / what's wrong / make it look better": **Review mode**.
- The user is building or changing something ("add a bottom sheet", "make this feel native", "animate this menu"): **Build mode**.
- Unclear: ask one short question. If the user wants both, review first, then build the fixes.

## Reference files (load only what you need)

| File | Load when |
| --- | --- |
| `references/web-lens.md` | Review: always. Build: when touching layout, forms, fonts, images, dark mode or accessibility. |
| `references/motion-principles.md` | Review: whenever the page moves or layers at all: any CSS transition or animation (hover lifts included), scroll-linked or scroll-triggered effects, canvas or WebGL animation, overlays, gestures, or translucent materials (`backdrop-filter`). Build: always, it is the main guide. |
| `references/visual-craft.md` | Review: always for a "make it look better / less generic" request. Build: when designing layout, type or color. |
| `references/hig-links.md` | When you need Apple's own wording for a reason or citation. Open the linked page for the specific topic only; never cite from memory. |

Do not load every file by default. Only a truly static page (no transitions, no animation, no canvas, no translucent layers) may skip the full motion file; then read motion-principles.md §14 (reduced motion) and §15 (type) at most. Cite only sections you have actually read in this session.

## Measurement script

`scripts/measure.mjs` measures a live site with Playwright: horizontal overflow with culprits, tap targets, CLS/LCP, console errors, type inventory, DOM contrast, pixel contrast for text over canvas/images/gradients, a reduced-motion and a no-JavaScript pass, and a keyboard focus pass. Run `node scripts/measure.mjs --help` for usage. Use it instead of writing a measurement script from scratch; extend it with targeted probes only for what it does not cover. If Playwright is not installed, the script says how to install it; ask before installing anything into the user's project.

## Review mode

### Step 1: Establish context

Find out, asking only for what is missing:

1. **What is being reviewed:** live URL, local code, screenshots, or a design file. Note what you can and cannot see.
2. **Audience and goal:** who visits, what the page should make them do, and on which devices.
3. **Stack:** framework, CSS approach (Tailwind, CSS modules, plain CSS), animation library. Fixes must be written in this stack.
4. **Scope:** whole site, one page, or one component.
5. **Deliberate decisions:** read the project's own rules and decision records before judging anything (CLAUDE.md, AGENTS.md, design docs, a design-system page, approval notes, comments next to the code). A choice the owner made on purpose (a hover effect, an approved animation, a brand color) is not a finding in itself. Report only its concrete side effects (for example "the hover lift sticks after a tap on touch devices"), and mark such findings as touching an approved decision so the owner decides. If you cannot tell whether something is deliberate, say so in the finding instead of calling it a template signal.

### Step 2: Measure, do not guess

- With a **live URL** and browser tools available (browser automation, DevTools, Lighthouse, a Playwright or Chrome session), actually load the page at mobile (about 390 px) and desktop widths and measure: contrast ratios, tap target sizes, horizontal overflow, layout shifts, font loading, image sizes, console errors, focus visibility via keyboard. Prefer real numbers. Start with `scripts/measure.mjs`.
- **Text over canvas, images, video or gradients:** DOM-based contrast tools cannot see what is drawn behind the text, so their result there is neither a pass nor a fail. Measure pixels instead: screenshot the text box, screenshot it again with the text made transparent, and compute the contrast of the text color against the worst background pixels (`measure.mjs` does this; method in `web-lens.md` §4). For animated backgrounds, take several samples and report the worst. Leave contrast as an assessment only if pixel measurement is impossible, and say why.
- With **code only**, read the relevant files and say which findings come from code reading and could not be confirmed at runtime.
- With **screenshots only**, you can judge visual craft, hierarchy and contrast approximately; you cannot judge motion, focus, performance or responsiveness. Say so, and do not report those lenses as clean.
- If you cannot run a tool you would need (no browser access, no network), say so and mark the dependent findings as unverified instead of substituting a guess.

### Step 3: Run the lenses in this order

Work through them in sequence. Skip a lens only when it truly does not apply, and say that you skipped it.

1. **Accessibility.** Contrast, focus visibility, keyboard path, target size, reduced motion, text zoom, labels, alt text, semantic elements. Failures here are the most serious and the most objective. Details: `web-lens.md` sections 1 to 4, 9 and 10, and `motion-principles.md` §14.
2. **Web lens.** Responsiveness, no horizontal scroll, touch vs. hover, Core Web Vitals, layout shifts, images, fonts, dark mode, forms. Details: all of `web-lens.md`.
3. **Visual craft and template look.** Type hierarchy, spacing rhythm, color discipline, restraint, signature element, generic-template signals, removal checklist. Details: `visual-craft.md`.
4. **Motion and interaction.** Response latency, 1:1 tracking, interruptibility, springs vs. fixed easings, enter/exit symmetry, rubber-banding, materials, feedback, press states. Check each against the 17 principles in `motion-principles.md`; cite as "motion-principles.md §N". Only evaluate what exists; a page without gestures does not get gesture findings. But if anything on the page moves or is translucent, this lens is mandatory: load `motion-principles.md` before writing findings, and check at least response, interruptibility, easing choice, reduced motion and, for `backdrop-filter`, materials and `prefers-reduced-transparency` (§12, §14).
5. **Content and microcopy.** Button labels that name the action, specific headings, error messages that say how to fix it, empty and loading states, vague marketing filler, inconsistent terminology, placeholder text left in.

### Severity

| Level | Meaning | Examples |
| --- | --- | --- |
| **Critical** | Blocks users or fails a legal/accessibility baseline; fix before shipping | Content unreadable or unreachable by keyboard, zoom disabled, form that cannot be submitted on mobile, text below 3:1 contrast, page unusable at 320 px |
| **High** | Clearly hurts experience, trust or conversion for many users | Missing focus styles, body text under 4.5:1, layout shift while reading, hero image far too heavy, clickable elements under 24 px, no reduced-motion handling for large motion |
| **Medium** | Noticeable polish gap or inconsistency | Ad-hoc font sizes and spacing, fixed-duration easing on a draggable element, hover-only affordance, generic template cluster |
| **Low** | Small refinement or taste-level improvement | Tracking tweaks, slight misalignment, minor microcopy, optional dark-mode touch-ups |

Rank by user impact, not by how easy the fix is. Do not inflate severity to fill a section; an empty severity level is fine.

### Rules for findings

- **Review only what is actually present.** No finding without something observed on the page or in the code. No generic advice lists.
- **Evidence or label.** Each finding is either **Verified** (measured or directly seen, with the value) or **Assessment** (judgment or inference, with how to verify it).
- **Cite with the file name, always:** "web-lens.md §4", "motion-principles.md §11", "the project's CLAUDE.md §7". Never a bare "§N", because the skill and the project both number their sections.
- **Quote the numbers:** "body text #8a8a8a on #ffffff is 3.4:1, needs 4.5:1", "CTA is 32x32 px".
- **Credit what works.** Mention up to three things that are genuinely good, so the user knows what to keep.
- **One root cause, one finding.** Group repeats ("12 buttons lack focus styles") with a count and examples.
- **Do not fix unasked.** In review mode, report; change code only if the user asks. Mention side observations outside the requested scope briefly at the end.
- **Do not cargo-cult Apple.** If a web convention is better than an Apple pattern for this context, say that.

### Report format

Start with a 3 to 5 line summary: overall impression, the one or two things that matter most, what was and was not verified. Then findings grouped by severity (Critical first). For each finding:

```
### [Severity] Short title
**Problem:** what is wrong, where (selector, component, URL, or screenshot region), with measured values. Verified / Assessment.
**Why it matters:** the reason, with a source: references/web-lens.md §N, motion-principles.md §N, visual-craft.md §N, or an HIG link from hig-links.md.
**Fix:** concrete change in the user's stack (code snippet or exact CSS/JS values).
```

End with:

1. **Quick wins:** the findings that take minutes and visibly lift the page.
2. **Not checked:** every lens or item skipped or only partly run, and why (no browser access, screenshot only, reference file not loaded, and so on). A lens that is missing from the findings and missing from this list counts as a reporting error.
3. **Side observations:** things noticed outside the scope, not acted on.

## Build mode

Use `references/motion-principles.md` as the working guide. Core defaults to apply without being asked:

- **Respond on press, track 1:1, stay interruptible.** Feedback on `pointerdown`, content follows the pointer from where it was grabbed, nothing locks input during a transition (§1 to §3).
- **Springs for anything the user touches, fixed easing only for passive transitions.** Critically damped by default; add bounce only when the gesture carried momentum (§4).
- **Hand release velocity to the animation and project momentum** for flicks, sheets and carousels (§5, §6).
- **Enter and exit along the same path, from the trigger's origin** (§7). Soft boundaries instead of hard stops (§9).
- **Animate `transform` and `opacity`** only for motion, and keep first-paint work off the critical path (§11 and `web-lens.md` sections 5 and 6).
- **Always ship the fallbacks:** `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast` (§14), visible `:focus-visible`, keyboard operation, 44 px touch targets (`web-lens.md`).
- **Prefer existing libraries** the project already uses (Motion/Framer Motion, GSAP, Vaul, Embla, native CSS View Transitions) over hand-rolled physics, unless the project has none and the interaction needs it.

Build workflow:

1. Read how the project animates today (library, CSS conventions, tokens) and match it.
2. Name the interaction in one sentence: what the user touches, what moves, what can interrupt it.
3. Implement it using the matching principle section; keep spring parameters in one shared config rather than scattering literals.
4. Test: interrupt it mid-flight, reverse it, drag it past the edge, use only the keyboard, turn on reduced motion, throttle the CPU in DevTools.
5. Report what you changed and what you could not test.

## Principles that apply to both modes

- Say what is verified and what is judgment; name the way to check anything unverified.
- Report blockers (no access to the URL, missing tool, unreadable file) instead of working around them silently.
- Stay inside the request: report side findings instead of fixing them unasked.
- Prefer fewer, well-evidenced findings over a long list of generic ones.
