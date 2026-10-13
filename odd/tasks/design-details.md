# Design detail polish

Refine the CPU learning interface without replacing its visual language or CPU simulations.

## Objective, scope, and constraints

The approved unit improves decorative details, wording, navigation accessibility, and the identity mark. It preserves Spanish product copy, chapter routes, CPU behavior, keyboard focus, system-preference themes, the cobalt/aluminum palette, and existing typography. No menus, theme toggle, dependencies, or production redesign were added.

The accepted T2 identity is a custom native-SVG open-die mark: filled open-package/core geometry with an exposed die, a transparent 36px wrapper, and a 32px symbol. Header and favicon share the same paths; the header uses `currentColor`, while the favicon uses matching light/dark theme colors. The rejected T1 pinned-chip logo is not part of this delivery.

## Work unit

- [x] **T1 — Shared polish.** Delegated direct: four source files plus a regression test required preparation and coordinated edits. It corrected `8 bit`, replaced the `⌁`, kept numeric chapter indices accessible while hiding only decorative project markers, and kept mobile simulator/navigation access usable.
- [x] **T2 — Open-die logo.** Delegated direct: vector identity, layout/CSS, and regression coverage changed together. Current source and browser evidence confirm the final mark and retain T1 non-logo improvements.
- [ ] **T3 — Deliver verified unit.** The user authorized committing and a regular push on the existing sole `main`; parent owns those Git/remote steps. This document is organized, but publication is not yet claimed.

## Acceptance and current evidence

- Header and favicon share the open-die geometry; SVG decoration is hidden from assistive technology and the named home link remains.
- At 320px, simulator, home, and navigation targets remain at least 44px, visible, unobscured, non-overlapping, and horizontally contained; chapter navigation and focus remain usable.
- Final T2 browser evidence covers six current-production cases at 320/390/1280px in light/dark: transparent wrapper, 32px mark, `currentColor` on both paths, no black default paint, 44px targets, no overflow, and a visible 3px home-link focus outline.
- Final local verification passed: six combined tests, six-route production build, and whitespace check. Documentation consolidation preserved all five source/test file hashes. The existing >500 kB minified-chunk warning is unrelated.
- Historical evidence is not current proof: T1's 20 browser cases used the earlier pinned logo; its regression cycles were RED 0/4 → GREEN 4/4 and RED 1/4 → GREEN 4/4. The original T2 replacement was RED 3/4 → GREEN 4/4; the resumed paint check observed already-correct `currentColor` paths and claimed no new RED.
- External local verification artifacts (not committed): `design-details-layout-evidence.json`, `design-details-interaction-evidence.json`, `design-details-mobile-light.png`, `design-details-desktop-dark.png`, `open-die-logo-evidence.json`, `open-die-logo-mobile-light.png`, and `open-die-logo-navbar.png`.

## Verification

- `node --test tests/design-details.test.mjs tests/cpu-underside.test.mjs`
- `npm run build`
- `git diff --check`
- Browser/fixture evidence above; no physical-device or OS-preference claim.

## Delivery record

- Base: `f972bc15d6d0d1fd8763633810b35914f8ac4f69` on sole `main`; RDD is globally off and must remain off.
- Authored source/test changes: 141 lines (61 additions + 22 deletions in tracked source; 58-line new regression test). Generated output and this tracking document are excluded.
- Commit metadata: pending parent-created Conventional Commit; no branch, force push, PR, or publication assertion is recorded here.
- Rollback boundary: revert only this unit's logo, navbar, glyph/copy, and regression-test changes; do not revert CPU simulation work.
