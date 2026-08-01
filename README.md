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

Three of the four screens are built. Everything outside `project/` is the
implementation; `project/` stays as the read-only design reference.

| Route | Screen | Status |
| --- | --- | --- |
| `/` | Beranda | Built |
| `/pencarian` | Hasil pencarian | Built |
| `/detail` | Detail properti 362 | Built |
| — | Dashboard pengelola | Not built. The design gives it no entry point from any public screen. |

The three built screens link to each other in both directions. Links still
pointing at `#` are screens the design does not specify — survey booking, the
rental application, the partnership page. They are listed in `lib/routes.ts`.

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
| `app/*/page.tsx` | One file per route. |
| `components/ui/` | Design-system primitives, shared across screens. |
| `components/beranda/` `components/pencarian/` `components/detail/` | Sections, one per section of each design. |
| `lib/content/` | All copy and figures, one file per screen. |
| `lib/content/geography.ts` | Coordinates every map reads from. |
| `lib/routes.ts` | Link targets — where the unbuilt screens get wired in. |
| `docs/superpowers/specs/` | The implementation design specs. |

Client Components are kept to where state or the DOM genuinely requires them:
`Hero`, `HeroGallery`, `RoomExplorer`, `SearchResults`, `FloorGrid`, and
`LeafletMap`. Everything else renders on the server.

Read the specs in `docs/superpowers/specs/` before changing anything visual —
they record which design-system rules the code is holding to, and where it
knowingly departs from the prototype.

---

# Deployment

Live at **https://kostella.hyperscore.cloud**.

The site ships as **static files** — `output: 'export'` in `next.config.ts`.
There is no Node process on the server: nginx serves the build folder directly.
It can do that because the site has no API routes, no server actions and no
middleware, and every route prerenders. The cost is `images.unoptimized`, since
the image optimiser is a server feature.

`next start` therefore does not work. `npm run dev` is unaffected, and
`npx serve out` previews a production build.

```bash
ssh hyperscore-vps /srv/www/kostella/deploy/deploy.sh   # deploy
ssh hyperscore-vps /srv/www/kostella/deploy/rollback.sh  # revert, no rebuild
```

Neither needs sudo. A deploy builds in a separate working copy and only then
moves the `current` symlink, so the site stays up throughout — measured at 146
requests during a full deploy with zero non-200 responses, not assumed. Five
releases are kept, so a rollback is a symlink move rather than another build.

**`deploy/README.md` is the reference** for the server layout, why it is shaped
that way, and the two steps that do need sudo (installing the nginx vhost, and
Certbot).

Server access details are in `server-info.md`, which is gitignored — this
repository is public.
