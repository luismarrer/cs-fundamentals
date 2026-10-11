# Open a CPU in 3D

## Objective
Let visitors encounter a tangible 3D CPU package, open its lid, and explore the logical components inside. Evolve the existing educational explorer rather than add an unrelated hero.

## Problem and scope
The current welcome uses a flat SVG. The user approved a 3D transformation and specifically wants the experience of opening a CPU. Preserve the six component selectors, contextual explanations, chapter links, and fetch/decode/execute journey. Clearly distinguish the teaching model from a physical commercial die layout.

Local implementation and adoption of the relevant pending CPU landing baseline are explicitly authorized by the user's "Sí te autorizo". No push, PR, merge, remote execution, new chapter, or unrelated redesign is authorized. Preserve all pre-existing pending work; stage only the relevant landing baseline and feature deltas, never unrelated chapter/layout edits.

## Workflow
- Route: delegated direct. Mapping requires 4+ files; new scene plus component/integration triggers a bounded writer. Preparation and primary-source library research were delegated.
- Branch: `codex/cpu-opening`, starting at `4f2a4ef` after the completed carry-journey work. Existing pending files remain in place.
- TDD: off for this feature, explicitly authorized by the user. Runner: `pnpm build` plus functional browser verification; no existing test suite or linter.
- Checks: `pnpm build`, `git diff --check`, and browser interaction/visual verification. No test suite or linter is currently configured.
- RDD: disabled/unmanaged, global source confirmed by `gentle-ai review mode status`. Do not start native reviews.
- Delivery: `exception-ok`, explicitly accepted as one cohesive over-budget local delivery. Forecast approximately 800 new authored additions + deletions, excluding generated lockfile changes; adopting the required landing baseline adds committed lines. Record the actual count honestly. No PR or chain is authorized; any future PR size policy remains applicable.
- Implementation: direct Three.js ESM without React/GSAP, procedural geometry without remote model assets. Primary-source research verified Three.js 0.186.1 and WebGL 2 requirements. Install only the runtime dependency and necessary development types.

## Task
- [x] **T1 — Deliver the opening CPU welcome.** Build the package/lid/interior, synchronize selection and instruction phases with the existing explorer, preserve fallback and accessibility, verify the full behavior, and close with a Conventional Commit. Route: delegated; evidence: multiple non-trivial files and renderer/lifecycle preparation.

## Acceptance and applicable checks
- Start with a recognizable closed package. Opening visibly lifts/removes the lid and exposes the schematic die; closing reverses it without losing educational state.
- Allow bounded rotation, zoom, and camera reset, including keyboard-equivalent controls. Distinguish taps from orbit drags; hidden blocks cannot be picked through the closed lid.
- Selecting any of six blocks synchronizes its HTML selector, explanation, chapter link, and visual highlight. Preserve existing fetch/decode/execute/reset behavior without a second instructional state machine.
- The visual explains logical responsibilities, not actual physical floorplanning. Spanish UI follows the existing project; identifiers and technical documentation remain English.
- Keep the SVG/HTML experience until the first successful WebGL 2 render, and restore it on initialization/context failure. Mobile and unsupported devices retain the lesson.
- Honor reduced motion immediately and on preference changes. Render on demand; avoid decorative perpetual rotation. Pause offscreen/hidden work and dispose renderer, controls, resources, observers, and listeners on teardown.
- Verify desktop and 320/390px mobile, light/dark themes, keyboard focus, open/close/reopen, all selections, camera reset, instruction phases, reduced motion, and renderer/context failure.
- Run the production build and whitespace check. Record exact results, skipped/pending checks, rollback scope, and commit identity. Do not sweep unrelated pending changes into the commit.

## Evidence and progress
- Read-only exploration confirms the existing explorer owns all six selectors/dossiers and three instruction phases. A narrow selection/phase adapter avoids duplicating educational content.
- The reference demo is paused; its public source demonstrates object-centered selection, contextual explanation, and corrective quiz feedback. No live reference interaction was claimed.
- Primary Three.js/Astro documentation supports direct ESM client integration, WebGL 2 guards, on-demand rendering, OrbitControls, raycast gating, explicit disposal, and fallback after context loss.
- Implemented the procedural Three.js package, lifting/parked lid, six selectable logical blocks, finite camera controls, phase highlights and HTML state adapter. The initial closed chip and opening action are visible in the arrival viewport; the stage comes first on mobile.
- Selective candidate includes exactly eight paths: this document, CpuExplorer, CpuOpening, cpu-opening.ts, the relevant landing replacement, CPU-scoped CSS, package manifest and lock. Original course/project markup, layouts, cards, chapter files, Astro/Tailwind versions and all unrelated pending bytes are preserved. Shadow index/export prevents whole-file staging from adopting the unrelated redesign.
- Independent clean verification: `pnpm install --frozen-lockfile` exit 0; `pnpm build` exit 0, six pages; `git diff --check` and shadow cached whitespace check exit 0. Final runtime code snapshot: `7277f60f3076c94203333c60b0e39757579ede89` (before tracking-only updates). Exact hashes/logs are stored outside the repository in the session's `cpu-opening-verification-mOsaij/evidence.json` and `build-final.log`.
- Browser checks against production builds: closed/open/close/reopen; six direct canvas picks with correct selected buttons/dossiers/chapter links; drag does not select; camera buttons/reset/arrow-plus-Home keyboard controls and visible focus (source-enforced distance 8–23 and polar angle .2–1.16 bounds); fetch/decode/execute/reset; explicit repeat and offscreen pause; 390/320px arrival, with no horizontal overflow after the narrow landing header correction.
- Clean browser fixtures verified initial/live light-dark and reduced-motion behavior, immediate opening under reduced motion, initial denied WebGL 2 fallback with keyboard selection/phase advance, and real `WEBGL_lose_context` loss/restoration events (1/1) returning to 3D while retaining selection/phase. Preference fixtures are simulated, not operating-system changes; viewport checks are browser simulations, not physical-device testing.
- Deterministic probes against exact production source passed: pending async generation race, full resource teardown, three early renderer/control failure paths, and 15 SVG lifecycle scenarios (initial mount failure, lost context, visibility, reduced motion, offscreen, bfcache, detached host). SVG owns fallback motion independently of renderer readiness; InstancedMesh instance buffers are explicitly disposed.
- Warning retained: the lazy scene chunk is 579,846 bytes (144,212 gzip), exceeding Vite's 500 kB threshold. No automated test suite/linter is configured; TDD and native RDD were intentionally not run. No push, PR or merge.
- Final clean browser additionally observed actual SVG motion through the disposable fixture: paused while 3D-ready/reduced motion/offscreen, running while visible normal-motion fallback, and correctly resuming after scrolling back. Initial renderer failure and real lost/restored context paths both passed. The readonly CUA DOM facade did not expose SVG `animationsPaused()`; the fixture reads the actual SVG API and displays its result instead.
- Reproducible deterministic command: `node /Users/luis/.codex/visualizations/2026/10/10/01a12817-6f91-75e1-95d5-9435fd0b27d8/cpu-opening-source-probes.mjs /Users/luis/Dev/cs-fundamentals` — exit 0; command/output in `cpu-opening-source-probes.log` beside the script. Controlled doubles/type stripping supplement actual browser/GPU tests, not replace them.
- Browser runtime command: `node /Users/luis/.codex/visualizations/2026/10/10/01a12817-6f91-75e1-95d5-9435fd0b27d8/cpu-opening-clean-harness.mjs`; unmodified clean production at `http://127.0.0.1:4325/`, fixtures only when `fixture=1`. Final screenshot: `cpu-opening-final.jpg` in the same session artifact directory.
- Work-unit commit: `6981a1f12698b7fcc886f20788b4996ba2222ddf` — `feat(cpu): open an explorable 3d processor`. Observed 2,611 authored additions/deletions including adopted CPU baseline; 54 generated lock additions excluded. One accepted `exception-ok` local slice, no PR. Real working bytes preserved during selective commit. Running local feature delivery: 2,617 authored additions/deletions including tracking evidence, excluding generated lock changes. RDD outcome: disabled/unmanaged. Recovery mirror: `odd/cpu-opening/tasks`.
- Unrelated pending README, Card, layouts, five chapter pages, index and global CSS compare byte-for-byte with the preserved pre-writer baseline. Manifest/lock current working files retain the pre-existing unrelated upgrades; staged candidate adds only Three and types to HEAD.
- Rollback boundary: remove the new 3D scene/component and only its integration/dependency deltas; retain the original educational explorer and all unrelated pending work.

## Next step
T1 is complete and committed locally. The clean preview is available at http://127.0.0.1:4325/. Bundle-size optimization is an optional follow-up; publishing/pushing/PR creation remain user decisions. No implementation or required functional check remains pending. Physical-device/OS preference testing and automated suite/lint were not claimed.
