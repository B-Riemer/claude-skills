#!/usr/bin/env node
// measure.mjs - reusable live-site measurements for the apple-design-pro review.
//
// Usage: node measure.mjs <baseUrl> [route1,route2,...] [--out results.json]
//                         [--widths 320,390,1440] [--shots dir]
// Needs Playwright (`npm i -D playwright && npx playwright install chromium`).
//
// Per route x width x color scheme (light, dark): horizontal overflow (+culprits), tap targets,
// CLS/LCP, console errors, failed requests, font size/weight inventory, DOM contrast and, for
// texts with an unreliable DOM background (image, canvas, video, gradient, semi-transparent
// layer), a pixel contrast measurement. Per route once: reduced-motion and no-JS passes at
// 390 px (content with links/buttons that stays at opacity 0 / visibility hidden, compared to a
// normal load) and a keyboard pass at 1440 px (Tab stops, focus indicator, visibility).
//
// Limitations (also written to the JSON under `limitations`):
// - Pixel contrast: text is hidden per element and the box re-shot. Canvas/WebGL/rAF animation
//   cannot be paused (reducedMotion does not stop it); CSS/WAAPI animations are paused. Two
//   clean shots are compared and `bgChangedPct` reports how much of the box moved in between.
//   If it is high, min/p5 are a sample of a moving background, not a stable value.
// - Pixel contrast covers the element's whole box (min / 5th percentile), plus `underGlyph`
//   stats over pixels where the text actually drew (the more relevant number on stable
//   backgrounds; box min is conservative and can hit 1.0 from unrelated pixels in the box).
//   Gradient text with a transparent fill is skipped (pixelSkipped.transparentTextFill).
// - DOM contrast ignores text-shadow, mix-blend-mode, filters and backdrop-filter.
// - Focus indicator = outline or box-shadow only; border/background/filter cues are not seen.
// - Tap targets: inline links inside running text are flagged `inline` (WCAG 2.5.8 exempts them).

import fs from 'node:fs';
import path from 'node:path';

const HELP = `Usage: node measure.mjs <baseUrl> [route1,route2,...] [--out results.json] [--widths 320,390,1440] [--shots dir]
  baseUrl   e.g. https://example.com or http://localhost:3000
  routes    comma-separated paths, default "/"
  --out     JSON output file (default measure-results.json)
  --widths  viewport widths (default 320,390,1440)
  --shots   write full-page screenshots plus viewport-height slices into this directory`;

let chromium;
for (const mod of ['playwright', 'playwright-core']) {
  try { ({ chromium } = await import(mod)); break; } catch { /* try next */ }
}
if (!chromium) {
  console.error('Playwright not found. Install it, e.g.:\n  npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}

// ---------- CLI ----------
const argv = process.argv.slice(2);
const flags = {}, pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--help' || argv[i] === '-h') { console.log(HELP); process.exit(0); }
  if (argv[i].startsWith('--')) flags[argv[i].slice(2)] = argv[++i]; else pos.push(argv[i]);
}
if (!pos[0]) { console.error(HELP); process.exit(1); }
const BASE = pos[0];
const ROUTES = (pos[1] || '/').split(',').map((r) => r.trim()).filter(Boolean);
const WIDTHS = (flags.widths || '320,390,1440').split(',').map(Number);
const OUT = flags.out || 'measure-results.json';
const SHOTS = flags.shots;
const MAX_PIXEL_ELEMENTS = 20;
const slug = (r) => r.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home';

// ---------- in-page measurement (runs in the browser; mode 'full' or 'hidden') ----------
function inPage(mode) {
  const vw = document.documentElement.clientWidth;
  const opCache = new WeakMap();
  const effOpacity = (e) => {
    if (!e) return 1;
    if (opCache.has(e)) return opCache.get(e);
    const v = parseFloat(getComputedStyle(e).opacity) * effOpacity(e.parentElement);
    opCache.set(e, v); return v;
  };
  const visible = (e) => {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && effOpacity(e) > 0.05;
  };
  const sel = (e) => {
    let s = e.tagName.toLowerCase() + (e.id ? '#' + e.id : '');
    const c = (e.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.');
    if (c) s += '.' + c;
    const t = (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return s + (t ? ` "${t}"` : '');
  };

  if (mode === 'hidden') { // content with links/buttons that is invisible although it takes up space
    const hit = [];
    for (const e of document.body.querySelectorAll('*')) {
      const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      if (cs.display === 'none' || r.width === 0 || r.height === 0) continue;
      const hidden = effOpacity(e) < 0.01 || cs.visibility === 'hidden';
      if (!hidden) continue;
      const n = e.querySelectorAll('a[href], button').length + (e.matches('a[href], button') ? 1 : 0);
      if (!n) continue;
      const p = e.parentElement; // report only the outermost hidden element
      if (p && p !== document.body && (effOpacity(p) < 0.01 || getComputedStyle(p).visibility === 'hidden')) continue;
      hit.push({ el: sel(e), interactive: n, opacity: +effOpacity(e).toFixed(2), visibility: cs.visibility, h: Math.round(r.height) });
    }
    return hit.slice(0, 40);
  }

  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const blend = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });

  // Overflow: culprits stick out right of the viewport and are not clipped by a scroll container
  const overflow = { scrollWidth: document.documentElement.scrollWidth, viewport: vw, culprits: [] };
  if (overflow.scrollWidth > vw) {
    const clipped = (e) => {
      for (let p = e.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
        const cs = getComputedStyle(p);
        if (cs.overflowX !== 'visible' && p.getBoundingClientRect().right <= vw + 1) return true;
      }
      return false;
    };
    const all = [];
    for (const e of document.body.querySelectorAll('*')) {
      const r = e.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed' && !clipped(e)) all.push({ e, right: Math.round(r.right) });
    }
    all.sort((a, b) => b.right - a.right);
    overflow.culprits = all.slice(0, 10).map((x) => ({ el: sel(x.e), right: x.right }));
  }

  // Tap targets
  const tapTargets = { small: [], belowRecommended: [], srOnly: [] };
  for (const e of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], summary')) {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    if (r.width === 0 && r.height === 0) continue;
    if (cs.visibility === 'hidden' || effOpacity(e) < 0.05) continue;
    const rec = { el: sel(e), w: Math.round(r.width), h: Math.round(r.height) };
    if (r.width <= 2 || r.height <= 2) { tapTargets.srOnly.push(rec); continue; }
    rec.inline = cs.display === 'inline' && !!e.closest('p, li, dd, td');
    if (r.width < 24 || r.height < 24) tapTargets.small.push(rec);
    else if (r.width < 44 || r.height < 44) tapTargets.belowRecommended.push(rec);
  }

  // Typography inventory + contrast
  const sizes = {}, weights = {};
  const media = [...document.querySelectorAll('canvas, video, img, picture, svg')].filter((m) => {
    const r = m.getBoundingClientRect();
    return visible(m) && (m.tagName !== 'svg' || r.width * r.height > 10000);
  }).map((m) => ({ m, r: m.getBoundingClientRect() }));
  const rootDark = /dark/.test(getComputedStyle(document.documentElement).colorScheme);
  const contrast = { checked: 0, failures: [], unreliable: [] };
  const seen = new Set();
  let idx = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const el = n.parentElement;
    if (!n.textContent.trim() || !el || seen.has(el) || el.closest('svg, script, style, noscript') || !visible(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el), size = parseFloat(cs.fontSize), wt = parseInt(cs.fontWeight);
    sizes[cs.fontSize] = (sizes[cs.fontSize] || 0) + 1;
    weights[cs.fontWeight] = (weights[cs.fontWeight] || 0) + 1;
    const fg = parse(cs.webkitTextFillColor) || parse(cs.color); if (!fg) continue; // fill color wins over color
    fg.a *= effOpacity(el);
    const need = size >= 24 || (size >= 18.66 && wt >= 700) ? 3 : 4.5;
    const rec = { el: sel(el), size, weight: wt, need, color: `rgba(${fg.r},${fg.g},${fg.b},${+fg.a.toFixed(2)})` };
    let bg = null, reason = null;
    for (let e = el; e && !reason; e = e.parentElement) {
      const s = getComputedStyle(e), c = parse(s.backgroundColor);
      if (s.backgroundImage !== 'none') reason = 'background-image/gradient on ' + e.tagName.toLowerCase();
      else if (c && c.a > 0 && c.a < 1) reason = 'semi-transparent background on ' + e.tagName.toLowerCase();
      else if (c && c.a === 1) { bg = c; break; }
    }
    const tr = el.getBoundingClientRect();
    if (!reason) {
      const m = media.find(({ m, r }) => !m.contains(el) && !el.contains(m) && r.left < tr.right && r.right > tr.left && r.top < tr.bottom && r.bottom > tr.top);
      if (m) reason = m.m.tagName.toLowerCase() + ' overlaps text';
    }
    if (!reason && !bg) { if (rootDark) reason = 'no opaque background, dark color-scheme'; else bg = { r: 255, g: 255, b: 255, a: 1 }; }
    contrast.checked++;
    if (reason) {
      el.setAttribute('data-ms-unrel', String(idx));
      contrast.unreliable.push({ ...rec, unreliable: true, reason, idx: idx++ });
    } else {
      const r = ratio(blend(fg, bg), bg);
      if (r < need) contrast.failures.push({ ...rec, ratio: +r.toFixed(2), bg: `rgb(${bg.r},${bg.g},${bg.b})` });
    }
  }
  for (const u of contrast.unreliable) { const e = document.querySelector(`[data-ms-unrel="${u.idx}"]`); const cs2 = getComputedStyle(e), c = parse(cs2.webkitTextFillColor) || parse(cs2.color); c.a *= effOpacity(e); u.fg = c; }

  return { overflow, tapTargets, typography: { sizes, weights }, contrast };
}

// ---------- pixel contrast (runs on a blank util page, decodes the PNGs via canvas) ----------
async function pixelStatsInPage({ normal, clean, clean2, fg, need }) {
  const load = (b64) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = 'data:image/png;base64,' + b64; });
  const px = async (b64) => { const i = await load(b64), c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, i.width, i.height).data; };
  const [A, B, C] = await Promise.all([px(normal), px(clean), px(clean2)]);
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const L = Array.from({ length: 256 }, (_, v) => lin(v));
  const all = [], glyph = []; let moved = 0;
  const n = B.length / 4;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const r = B[o], g = B[o + 1], b = B[o + 2];
    const lb = 0.2126 * L[r] + 0.7152 * L[g] + 0.0722 * L[b];
    // text color blended over the background pixel (handles semi-transparent text)
    const lt = 0.2126 * lin(fg.r * fg.a + r * (1 - fg.a)) + 0.7152 * lin(fg.g * fg.a + g * (1 - fg.a)) + 0.0722 * lin(fg.b * fg.a + b * (1 - fg.a));
    const rt = (Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05);
    all.push(rt);
    if (Math.abs(A[o] - r) + Math.abs(A[o + 1] - g) + Math.abs(A[o + 2] - b) > 48) glyph.push(rt);
    if (Math.abs(C[o] - r) + Math.abs(C[o + 1] - g) + Math.abs(C[o + 2] - b) > 24) moved++;
  }
  const stat = (a) => { if (!a.length) return null; a.sort((x, y) => x - y); return { min: +a[0].toFixed(2), p5: +a[Math.floor(a.length * 0.05)].toFixed(2), px: a.length }; };
  const s = stat(all), g = stat(glyph);
  return { min: s.min, p5: s.p5, pixels: s.px, underGlyph: g, bgChangedPct: +(moved / n * 100).toFixed(1), need, minPass: s.min >= need, p5Pass: s.p5 >= need };
}

// ---------- orchestration ----------
const browser = await chromium.launch();
const mkCtx = (width, extra = {}) => browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 }, isMobile: width < 500, hasTouch: width < 500, ...extra });
const util = await (await browser.newContext()).newPage();
// timers run in Node, not in the page: setTimeout in the page never fires with JS disabled
const scrollThrough = async (page) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < Math.min(h, 20000); y += 500) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(100); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(600);
};
const load = async (page, url) => {
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(1500);
  return resp.status();
};

const result = { base: BASE, date: new Date().toISOString(), widths: WIDTHS, pages: [], passes: [], keyboard: [],
  limitations: ['Canvas/WebGL animation cannot be paused; see bgChangedPct for background stability.', 'Pixel contrast covers the element box, not only glyph area (see underGlyph).', 'DOM contrast ignores shadows, blend modes, filters.', 'Focus indicator: outline/box-shadow only.'] };

async function pixelPass(page, unreliable, pageRec) {
  await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.pause(); } catch { /* ignore */ } }));
  const style = await page.addStyleTag({ content: '/* measure.mjs */' });
  pageRec.contrast.pixel = [];
  // media overlap first (canvas/video), then image/gradient/translucent; a cap of 20 must not be eaten by headers
  const prio = (u) => (/^(canvas|video)/.test(u.reason) ? 0 : /^img/.test(u.reason) ? 2 : 1);
  const todo = unreliable.filter((u) => u.fg.a >= 0.05).sort((a, b) => prio(a) - prio(b) || a.idx - b.idx);
  pageRec.contrast.pixelSkipped = { transparentTextFill: unreliable.length - todo.length, overCap: Math.max(0, todo.length - MAX_PIXEL_ELEMENTS) };
  for (const u of todo.slice(0, MAX_PIXEL_ELEMENTS)) {
    const loc = page.locator(`[data-ms-unrel="${u.idx}"]`);
    try {
      const normal = (await loc.screenshot({ timeout: 5000 })).toString('base64');
      await style.evaluate((s, i) => { s.textContent = `[data-ms-unrel="${i}"], [data-ms-unrel="${i}"] * { color: transparent !important; text-shadow: none !important; -webkit-text-fill-color: transparent !important; }`; }, u.idx);
      const clean = (await loc.screenshot({ timeout: 5000 })).toString('base64');
      const clean2 = (await loc.screenshot({ timeout: 5000 })).toString('base64');
      await style.evaluate((s) => { s.textContent = ''; });
      const stats = await util.evaluate(pixelStatsInPage, { normal, clean, clean2, fg: u.fg, need: u.need });
      pageRec.contrast.pixel.push({ el: u.el, reason: u.reason, size: u.size, color: u.color, ...stats });
    } catch (e) { pageRec.contrast.pixel.push({ el: u.el, error: e.message.split('\n')[0] }); }
  }
  await style.evaluate((s) => s.remove());
}

async function shoot(page, tag) {
  fs.mkdirSync(SHOTS, { recursive: true });
  const { h, vh } = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, vh: innerHeight }));
  const vw = page.viewportSize().width;
  await page.screenshot({ path: path.join(SHOTS, `${tag}_full.png`), fullPage: true });
  for (let i = 0, y = 0; y < h && i < 15; i++, y += vh)
    await page.screenshot({ path: path.join(SHOTS, `${tag}_part${String(i + 1).padStart(2, '0')}.png`), fullPage: true, clip: { x: 0, y, width: vw, height: Math.min(vh, h - y) } });
}

for (const route of ROUTES) {
  const url = new URL(route, BASE).href;
  for (const width of WIDTHS) for (const scheme of ['light', 'dark']) {
    const ctx = await mkCtx(width, { colorScheme: scheme });
    const page = await ctx.newPage();
    const errors = [], failed = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 200)));
    page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 120)}`));
    page.on('response', (r) => { if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url().slice(0, 120)}`); });
    await page.addInitScript(() => {
      window.__cls = 0; window.__lcp = null; window.__shifts = [];
      new PerformanceObserver((l) => { const e = l.getEntries().at(-1); window.__lcp = { ms: Math.round(e.startTime), el: e.element ? e.element.tagName.toLowerCase() + '.' + String(e.element.className).slice(0, 40) : e.url }; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls += e.value; window.__shifts.push({ v: +e.value.toFixed(4), at: Math.round(e.startTime), node: e.sources?.[0]?.node?.nodeName }); } }).observe({ type: 'layout-shift', buffered: true });
    });
    const rec = { route, width, scheme };
    try {
      rec.status = await load(page, url);
      await scrollThrough(page);
      const perf = await page.evaluate(() => ({ cls: +window.__cls.toFixed(4), lcp: window.__lcp, shifts: window.__shifts.slice(0, 5) }));
      Object.assign(rec, perf, await page.evaluate(inPage, 'full'));
      rec.consoleErrors = [...new Set(errors)].slice(0, 10);
      rec.failedRequests = [...new Set(failed)].slice(0, 10);
      if (SHOTS) await shoot(page, `${slug(route)}_${width}_${scheme}`);
      if (rec.contrast.unreliable.length) await pixelPass(page, rec.contrast.unreliable, rec).catch((e) => { rec.pixelError = e.message.split('\n')[0]; });
    } catch (e) { rec.error = e.message.split('\n')[0]; }
    result.pages.push(rec);
    await ctx.close();
    // short human-readable summary
    const o = rec.overflow, t = rec.tapTargets, c = rec.contrast;
    console.log(`\n${route} @${width} ${scheme}: ${rec.error ? 'ERROR ' + rec.error : `HTTP ${rec.status}`}`);
    if (rec.error) continue;
    console.log(`  overflow: scrollWidth ${o.scrollWidth} vs ${o.viewport}${o.culprits.length ? ` -> ${o.culprits.slice(0, 3).map((x) => `${x.el} (right ${x.right})`).join('; ')}` : ''}`);
    console.log(`  tap targets: ${t.small.length} <24px, ${t.belowRecommended.length} <44px, ${t.srOnly.length} sr-only  | CLS ${rec.cls}, LCP ${rec.lcp?.ms ?? 'n/a'} ms  | errors ${rec.consoleErrors.length}, failed requests ${rec.failedRequests.length}`);
    console.log(`  fonts: ${Object.keys(rec.typography.sizes).length} sizes, ${Object.keys(rec.typography.weights).length} weights  | contrast: ${c.failures.length} fail, ${c.unreliable.length} unreliable of ${c.checked}`);
    for (const p of (c.pixel || []).slice(0, 3)) console.log(p.error ? `  pixel ${p.el}: ${p.error}` : `  pixel ${p.el.slice(0, 50)}: min ${p.min}, p5 ${p.p5} (need ${p.need}), bg moved ${p.bgChangedPct}%`);
  }

  // extra passes at 390 px: normal vs reduced motion vs no JS
  const modes = { normal: {}, reducedMotion: { reducedMotion: 'reduce' }, noJS: { javaScriptEnabled: false } };
  const pass = { route, width: 390 };
  for (const [name, opts] of Object.entries(modes)) {
    const ctx = await mkCtx(390, opts); const page = await ctx.newPage();
    try { await load(page, url); await scrollThrough(page); pass[name] = await page.evaluate(inPage, 'hidden'); } catch (e) { pass[name] = { error: e.message.split('\n')[0] }; }
    await ctx.close();
  }
  const base = new Set((pass.normal || []).map((x) => x.el));
  for (const k of ['reducedMotion', 'noJS']) if (Array.isArray(pass[k])) pass[k] = pass[k].map((x) => ({ ...x, alsoHiddenInNormal: base.has(x.el) }));
  result.passes.push(pass);
  console.log(`\n${route} hidden-content @390 (elements with links/buttons, opacity 0 or visibility hidden): normal ${pass.normal?.length ?? 'err'}, reduced-motion ${pass.reducedMotion?.length ?? 'err'} (${pass.reducedMotion?.filter?.((x) => !x.alsoHiddenInNormal).length} not hidden in normal), no-JS ${pass.noJS?.length ?? 'err'} (${pass.noJS?.filter?.((x) => !x.alsoHiddenInNormal).length} not hidden in normal)`);

  // keyboard pass at 1440 px
  {
    const ctx = await mkCtx(1440); const page = await ctx.newPage();
    const kb = { route, stops: [] };
    try {
      await load(page, url);
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(250);
        const s = await page.evaluate(() => {
          const e = document.activeElement;
          if (!e || e === document.body) return null;
          const cs = getComputedStyle(e), r = e.getBoundingClientRect();
          let op = 1; for (let p = e; p; p = p.parentElement) op *= parseFloat(getComputedStyle(p).opacity);
          const label = e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + ' "' + (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30) + '"';
          const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
          const shadow = cs.boxShadow !== 'none';
          return { el: label, outline, boxShadow: shadow, hasIndicator: outline || shadow, opacity: +op.toFixed(2), visible: op > 0.05 && cs.visibility !== 'hidden' && r.width > 0, inViewport: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth };
        });
        if (!s) { kb.endedAt = i + 1; break; }
        if (kb.stops.length && kb.stops[0].el === s.el) { kb.endedAt = i + 1; break; }
        kb.stops.push(s);
      }
    } catch (e) { kb.error = e.message.split('\n')[0]; }
    await ctx.close();
    result.keyboard.push(kb);
    const noInd = kb.stops.filter((s) => !s.hasIndicator).length, bad = kb.stops.filter((s) => !s.visible || !s.inViewport).length;
    console.log(`${route} keyboard @1440: ${kb.stops.length} stops, ${noInd} without focus indicator, ${bad} not visible/in viewport${kb.error ? ' ERROR ' + kb.error : ''}`);
  }
}

await browser.close();
fs.writeFileSync(OUT, JSON.stringify(result, null, 1));
console.log(`\nFull data: ${OUT}`);
