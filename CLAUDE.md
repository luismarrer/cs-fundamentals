# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Educational Computer Science website in Spanish ("Fundamentos de Computación — Del transistor a la CPU"): a landing page plus five chapters that explain, bottom-up, how transistors become logic gates, gates become arithmetic, and arithmetic plus memory becomes a CPU. Deployed target: Vercel/GitHub Pages as a static site. Remote: github.com/luismarrer/cs-fundamentals.

## Commands

100% static — vanilla HTML/CSS/JS, no dependencies, no build, no lint, no tests.

```bash
python3 -m http.server 4173   # serve locally → http://localhost:4173
```

Verification is manual: open the affected page and exercise its interactive demo in the browser.

## Architecture

- `index.html` — landing page: chapter cards (`#curso`) and external project links (`#proyectos`, links to Boolean Synth and the Soroban Learning System on Vercel).
- `capitulos/NN-nombre.html` — one file per chapter, numbered 01–05.
- `assets/styles.css` — the only stylesheet, shared by all pages.

There is **no templating**: the header, nav, and footer are duplicated in every HTML page. A change to any shared chrome must be applied to all six HTML files.

Each chapter is self-contained: its interactive demo is an inline `<script>` at the bottom of that page (MOSFET toggle, gate lab, 4-bit ripple-carry adder, SR latch, step-through CPU simulator). There is no shared JS file. The demo scripts intentionally mirror the hardware being taught (e.g. the adder computes bit-by-bit with XOR/AND carry logic, not `a + b`) — keep that property when editing them.

Theming: CSS custom properties on `:root` with a `prefers-color-scheme: dark` override block. Reusable demo UI classes live in `styles.css` (`.demo` panel, `button.bit` toggles driven by `aria-pressed`, `button.action`, `.readout`, `table.truth`). Use these rather than inventing new patterns; chapter-specific styles (only chapter 05 has them) go in a `<style>` block in that page's `<head>`.

## Conventions

- All content and UI text is Spanish (`lang="es"`); code identifiers and class names are English or established terms.
- Chapters build strictly on prior chapters — a chapter may only use concepts already introduced, and each ends with an `aside.note` summary plus a `.pager` with prev/next links.
- Adding a chapter: create `capitulos/NN-nombre.html` following an existing page's skeleton, update the `.pager` links of the adjacent chapters, and add its card to `index.html#curso` and the table in `README.md`.
