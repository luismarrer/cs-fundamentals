# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Educational Computer Science website in Spanish ("Fundamentos de Computación — Del transistor a la CPU"): a landing page plus five chapters that explain, bottom-up, how transistors become logic gates, gates become arithmetic, and arithmetic plus memory becomes a CPU. Static output; deploy target is Vercel/GitHub Pages. Remote: github.com/luismarrer/cs-fundamentals.

## Commands

Astro + Tailwind CSS v4 + pnpm. No tests, no linter.

```bash
pnpm dev        # dev server → http://localhost:4321
pnpm build      # production build → dist/
pnpm preview    # serve dist/
```

Verification is manual: open the affected page and exercise its interactive demo in the browser. Run `pnpm build` before committing — it's the only automated check that pages compile.

## Architecture

- `src/layouts/BaseLayout.astro` — the only place header/nav/footer exist; imports `global.css`.
- `src/layouts/ChapterLayout.astro` — wraps BaseLayout; renders kicker, heading, and the prev/next pager from props. Chapter pages pass `prev`/`next` as `{href, label}`.
- `src/pages/index.astro` — landing page; chapter/project cards use `src/components/Card.astro`.
- `src/pages/capitulos/NN-nombre.astro` — one page per chapter, numbered 01–05.

Each chapter's interactive demo lives in a `<script>` at the bottom of that page (MOSFET toggle, gate lab, 4-bit ripple-carry adder, SR latch, step-through CPU simulator). The demo scripts intentionally mirror the hardware being taught (e.g. the adder computes bit-by-bit with XOR/AND carry logic, not `a + b`) — keep that property when editing them.

## Styling (Tailwind v4, CSS-first)

There is no `tailwind.config.*`; everything lives in `src/styles/global.css`:

- Raw theme variables on `:root` flip with `prefers-color-scheme: dark`, and `@theme inline` maps them to semantic utilities: `bg-bg`, `bg-elev`, `text-ink`, `text-soft`, `border-line`, `*-accent`, `*-accent-soft`, `text-ok`, `text-off`, `bg-code`. Use these — never hardcode colors in markup.
- `@layer components` defines classes that are reused across chapters or **generated from JS at runtime** (`.demo`, `.bit`, `.action`, `.readout`, `.truth`, `.note`, `.mem-row`, `.cpu-*`, chapter prose under `.chapter`). JS-generated HTML can't use Astro scoped styles or get picked up as new utility classes, so runtime-built markup must stick to classes already declared in this layer.
- One-off layout styling goes as Tailwind utilities directly in `.astro` markup.

## Conventions

- All content and UI text is Spanish (`lang="es"`); code identifiers and class names are English or established terms.
- Chapters build strictly on prior chapters — a chapter may only use concepts already introduced, and each ends with an `aside.note` summary.
- Internal links are extensionless routes (`/capitulos/01-el-transistor`), derived from the file path.
- Adding a chapter: create `src/pages/capitulos/NN-nombre.astro` using ChapterLayout, update the `prev`/`next` props of the adjacent chapters, and add its `<Card>` to `index.astro#curso` and the table in `README.md`.
