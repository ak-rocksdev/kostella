# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read `kostella-design-system/project/ui_kits/beranda/index.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `kostella-design-system/README.md` — this file
- `kostella-design-system/project/` — the `Kostella Design System` project files (HTML prototypes, assets, components)

---

# The implementation

The Beranda screen has been built for real. Everything outside `project/` is the
implementation; `project/` stays as the read-only design reference.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

Next.js App Router, TypeScript, Tailwind v4.

| Path | What it holds |
| --- | --- |
| `app/globals.css` | Design tokens, restated in Tailwind's `@theme`. Edit values here. |
| `app/layout.tsx` | The three brand typefaces, loaded via `next/font`. |
| `app/page.tsx` | The Beranda composition. |
| `components/ui/` | The design-system primitives Beranda uses. |
| `components/beranda/` | Page sections, one per section of the design. |
| `lib/content.ts` | All copy and figures. |
| `lib/routes.ts` | Link targets — where the unbuilt screens get wired in. |
| `docs/superpowers/specs/` | The implementation design spec. |

Only `Hero` and `FooterMap` ship as Client Components; the rest render on the
server. Read `docs/superpowers/specs/2026-07-29-beranda-implementation-design.md`
before changing anything visual — it records which design-system rules the code
is holding to and why.
