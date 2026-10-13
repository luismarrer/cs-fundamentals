import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('header uses a shared open-die mark with a named home link', async () => {
  const layout = await readSource('src/layouts/BaseLayout.astro');
  const css = await readSource('src/styles/global.css');
  const brandMarkRules = css.match(/\.brand-chip\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.match(layout, /aria-label="CPU abierta, página principal"/);
  assert.match(layout, /class="brand-chip" aria-hidden="true"/);
  assert.match(layout, /const openDieMark = \{/);
  assert.match(layout, /package: 'M5 4H31/);
  assert.match(layout, /core: 'M21 14H29V22H21Z'/);
  assert.match(layout, /const faviconHref = `data:image\/svg\+xml,\$\{encodeURIComponent\(faviconSvg\)\}`/);
  assert.match(layout, /href=\{faviconHref\}/);
  assert.match(layout, /data-open-die-mark viewBox="0 0 36 36"/);
  assert.match(layout, /<path d=\{openDieMark\.package\} fill="currentColor"><\/path>/);
  assert.match(layout, /<path d=\{openDieMark\.core\} fill="currentColor"><\/path>/);
  assert.doesNotMatch(layout, /data-chip-logo|stroke-width/);
  assert.match(brandMarkRules, /width:\s*36px/);
  assert.match(brandMarkRules, /color:\s*var\(--accent\)/);
  assert.doesNotMatch(brandMarkRules, /border|background/);
  assert.match(layout, /class="simulator-index"/);
});

test('narrow navigation keeps all primary and simulator targets reachable at 44px', async () => {
  const css = await readSource('src/styles/global.css');
  const mobileRules = css.slice(css.indexOf('@media (max-width: 620px)'), css.indexOf('@media (max-width: 380px)'));
  const mobileSimulator = mobileRules.match(/\.header-simulator\s*\{([^}]*)\}/)?.[1] ?? '';
  const mobileNavLinks = mobileRules.match(/\.site-nav a\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.match(css, /\.site-nav a\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(css, /\.header-simulator\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(mobileSimulator, /display:\s*inline-flex/);
  assert.doesNotMatch(mobileSimulator, /display:\s*none/);
  assert.doesNotMatch(mobileNavLinks, /min-height:\s*40px/);
  assert.match(css, /\.header-simulator \.simulator-index\s*\{[\s\S]*?font:/);
  assert.doesNotMatch(css, /\.header-simulator span\s*\{/);
});

test('CPU details use an intentional signal graphic and corrected bit copy', async () => {
  const explorer = await readSource('src/components/CpuExplorer.astro');

  assert.doesNotMatch(explorer, /⌁/);
  assert.match(explorer, /class="panel-signal" aria-hidden="true"/);
  assert.match(explorer, /d="M3 16H8V10H15V16H25"/);
  assert.match(explorer, /CPU didáctica · 8 bits/);
});

test('only nonnumeric card markers are hidden from accessible link names', async () => {
  const card = await readSource('src/components/Card.astro');

  assert.match(card, /const isDecorativeMarker = !\/\^\\d\+\$\//);
  assert.match(card, /class="card-index" aria-hidden=\{isDecorativeMarker \? 'true' : undefined\}/);
});
