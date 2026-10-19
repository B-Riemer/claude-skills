# Visual Craft

> Own guidance, not from Apple sources. Use this file for the **Visual craft and template look** lens. Judgments here are design opinion; label them as assessments, and back them with a measurement or a concrete observation wherever you can.

The goal is not "more decoration". A page feels premium when its decisions are consistent, its hierarchy is obvious, and nothing is there by default.

## 1. Typography hierarchy

- **Few levels, clearly different.** Most pages need roughly: one display size, one section heading, one body, one small/caption. If two levels differ by less than ~15 to 20 percent in size and share weight and color, they read as the same level.
- **Use a scale, not ad-hoc sizes.** Collect all distinct `font-size` values (DevTools or a script). More than about 8 to 10 across a site signals missing tokens.
- **One family, maybe two.** A second family needs a job (for example, a serif for editorial headlines). Three families is a finding.
- **Weight carries emphasis** with less layout cost than size. Avoid the combination of bold, large, uppercase, tracked-out and colored on one line: pick one or two.
- **Line length** for running text: roughly 45 to 75 characters is the common guideline. Measure with `ch`-based `max-width` (for example `65ch`).
- **Line height and tracking** scale inversely with size; see motion-principles.md §15.
- **Numbers:** tabular figures (`font-variant-numeric: tabular-nums`) for prices, tables and counters that update.
- Avoid centered paragraphs beyond two or three lines; avoid justified text without hyphenation.

## 2. Spacing rhythm

- **Pick a base unit** (4 or 8 px) and a short list of steps. Collect distinct `margin`/`padding`/`gap` values; a long tail of near-duplicates (13, 14, 15, 17 px) means spacing was eyeballed.
- **Proximity expresses relation.** The gap between a heading and its content should be clearly smaller than the gap between sections. If both are equal, grouping disappears.
- **Spacing grows with importance and scale.** Section padding on a landing page is often two to four times component padding. Crowded edges are a more common failure than too much air.
- **Align to a shared grid or edge.** Elements that nearly align but miss by 1 to 4 px look careless; they either align or differ on purpose.
- **Optical alignment:** icons next to text, circles and triangles, and large type with side bearings often need a small manual nudge to look aligned.
- **Consistent radii and borders.** One radius family (for example small/medium/large), nested radii that shrink with the padding (inner radius = outer radius minus padding), one border weight.

## 3. Color: one meaning per color

- **Neutral base + one accent + semantic colors.** The accent marks the primary action and key state. If the accent also decorates headings, icons, borders and backgrounds, it no longer signals anything.
- **Semantic colors keep their meaning:** red is error or destructive, green is success, amber is warning. Do not reuse red for a promo or brand flourish next to an error state.
- **Count the palette.** List distinct text and background colors. Many near-identical grays (for example six slightly different `#888` variants) point to missing tokens.
- **Tint neutrals** slightly toward the accent hue instead of mixing pure gray with a saturated accent; the page feels more cohesive.
- **Gradients and shadows** should have a physical reason (light direction, depth). Rainbow or multi-hue gradients on text and buttons are a template signal.
- Contrast requirements are in web-lens.md section 4.

## 4. Restraint

- **Each screen has one primary action** and one most important message. If three things shout, nothing does.
- **Every element earns its place.** Apply the removal test: if you delete it and nobody would miss it, it was decoration.
- **Don't border everything.** Use space, background shifts and type weight to group before reaching for lines and cards. Cards inside cards inside cards is a flag.
- **Effects are a budget.** Blur, glow, parallax, tilt, animated gradients and cursor followers each cost attention and performance. Spend them where they support the message, not on every section.
- **Motion budget:** one or two signature motions per page, plus consistent small feedback everywhere; see motion-principles.md.

## 5. One signature element

Distinctive pages usually have a single memorable, deliberate thing that belongs to this product, and a quiet everything-else. Examples of what that can be (illustrative only):

- an unusual but disciplined typographic voice (a single oversized numeral treatment, an unexpected serif for headlines)
- a custom illustration or diagram style that explains the product
- a recurring layout device, such as one strong asymmetry or an unusual grid break
- a real product artifact shown big and well: a live UI, a printed result, a physical object photographed with intent
- a precise interaction that is better than the default (a pricing slider with satisfying physics)

Review question: "If I removed the logo, could this be any company?" If yes, suggest where a signature element could come from (the product, the audience, the founder's craft), not a random effect.

## 6. Recognizing a generic, templated look

Template look is not a style but the sum of defaults nobody chose. Look for clusters; one item alone is rarely a problem. Report the cluster, with what you observed.

Layout and structure
- The same section skeleton as thousands of landing pages: centered hero, three equal feature cards, logo strip, testimonials grid, pricing trio, big final call-to-action.
- Every section is a centered column of the same width with identical vertical padding, so there is no pacing.
- Identical cards in a grid with an icon in a tinted rounded square, a bold two-word title, and two lines of text.

Surface and effect
- Purple-to-blue or pink-to-orange gradients as the hero background or on headline text.
- Glassmorphism applied everywhere, blurred colored blobs behind the hero, glow on every card hover.
- Default component-library look (radius, shadow, gray scale) left unchanged, so the site is recognizable as that library.
- Emoji or stock icon sets used as the only visual content.

Type and content
- The common default sans-serif at default weights for everything; a hero headline of the form "Supercharge your X with AI" or "The all-in-one platform for Y".
- Vague claims without proof: "seamless", "powerful", "next-generation", "unlock", with no number, screenshot or customer name behind them.
- Placeholder-quality imagery: abstract 3D shapes, generic office photos, device mockups showing nothing real.
- Fake or unverifiable social proof (round-number stats, unnamed avatars).

Interaction
- Fade-up-on-scroll applied to every block with the same timing and distance.
- Hover effects identical on every element regardless of importance.

For each cluster, the fix is specific: replace the generic piece with something only this product could say or show, or remove it.

A signal the owner chose on purpose (documented in the project's rules or approval notes) is not a default nobody chose, so it does not count toward a cluster. Report only its concrete side effects, as described in Step 1 of SKILL.md.

## 7. Checklist: what can go

Go through the page and ask of each item, "would the page be worse without this?"

- [ ] decorative gradients, blobs, glows, grain that carry no meaning
- [ ] icons that repeat the adjacent word
- [ ] a section that restates the hero in different words
- [ ] second and third calls to action that compete with the primary one
- [ ] borders and card containers where whitespace would group just as well
- [ ] more than one accent color, more than two typefaces, more than three weights
- [ ] shadows with different directions or blur values on the same screen
- [ ] animations that play once and only delay reading
- [ ] carousels for content users must see (most users never advance them)
- [ ] pop-ups, banners and chat widgets that appear before the user has seen the product
- [ ] stock photography that could be swapped with another site's without anyone noticing
- [ ] navigation items nobody needs on the first visit
- [ ] placeholder or lorem text, leftover template copy, default favicon, default page title
