# Management panel — roadmap

Date: 2026-08-01
Source: `project/ui_kits/dashboard/Dashboard.jsx` (the one screen the handoff
bundle designs), plus operational requirements given by the client on
2026-08-01.

## Why this exists

The public site makes two claims: the rooms it shows are genuinely free, and
the price it states is the whole price. The management panel is where both
become true — and showing it beside the public site turns a promise into a
demonstrable mechanism.

The bundle's own design says it in a label: **"Kisi lantai — sama dengan
halaman publik"**. The manager marks a room taken on the same grid a renter
reads. That shared surface is the thesis; every phase below serves it.

## Audiences

| Role | Entry | Sees | Can |
|---|---|---|---|
| **Manager** | `/management` | individual rooms, tenants, bills | change status, set price, confirm surveys |
| **Owner** | `/owner` | aggregates and trends for their buildings | read only |

An owner is a franchise partner. They are entitled to know how their building
performs; they are not entitled to the names of the people living in it.

**The owner view is a separate shell, not a tab in the manager's panel.**
Corrected on 2026-08-01, before it was built. A partner logging in and finding
"Penghuni" and "Tagihan" in their navigation would be reading a menu of things
they have no right to open — the wrong model, not a permissions bug to patch
later. Different role, different entry, different navigation, and a much shorter
one. It shares the design system and the records; it shares no chrome.

Both read one **append-only audit log**, written by every phase. Who changed a
price, who marked a room taken, and when — those questions arrive as disputes,
long after the fact, and are unanswerable unless the record was kept at the
time. Phase 1 builds it so no later phase has to retrofit it.

## Constraint that shapes everything

The site is a **static export** — no backend, no database. State changes are
held in `localStorage`: real enough to demonstrate the loop end to end in one
browser, and clearly labelled on screen as a prototype. Nothing may imply
persistence, login, or multi-user sync that does not exist.

## Phases

Each phase is a separate spec, shippable on its own, leaving the site working.
Buildings and rooms come first because every other record points at a room.

| # | Phase | Route | Spec |
|---|---|---|---|
| 1 ✅ | **Buildings & rooms** — the data spine, the building switcher, room states, per-building facilities and tenancy, and the audit log every later phase writes to | `/management/buildings`, `/management/activity` | `2026-08-01-management-01-buildings-rooms.md` |
| 2 ✅ | **Dashboard** — today's surveys, what needs attention, portfolio occupancy | `/management` | `2026-08-01-management-02-dashboard.md` |
| 3 ✅ | **Tenants** — who is in which room, since when, what they agreed to pay, the monthly due date derived from their move-in, and notice of departure | `/management/tenants` | `2026-08-01-management-03-tenants.md` |
| 4 | **Billing** — rent, electricity, laundry, other services, penalties; paid / unpaid / short-paid with the reason. Phase 3 gives the due date; this gives whether it was met | `/management/billing` | not written yet |
| 5 | **Reports** — monthly income, occupancy, arrears for the manager | `/management/reports` | not written yet |
| 6 | **Owner view** — its own shell, its own navigation; aggregates and trends, no individuals | `/owner` | not written yet |

A later phase's spec is written when the phase before it has shipped, so it can
be written against code that exists rather than code that was imagined.

## Navigation

**Top bar, not a sidebar.** Reviewed on 2026-08-01 against what the roadmap
actually produces, and kept for four reasons rather than inertia:

- **No second level is needed.** Every sub-view the later phases imply — a month
  for billing, a filter for arrears, a section within reports — is a control
  inside a page, not a branch of a menu. A top bar only fails when it has to
  hold a tree.
- **Six manager destinations**, which a top bar carries and a sidebar would
  make look empty.
- **The building axis argues against it.** A sidebar naturally reads as "this
  building's sections", and these sections are not all per-building: the
  buildings list and reports are portfolio-wide. The top bar leaves building
  selection in the pages that are actually scoped to one.
- **The layout is two-column and the manager may be on a phone.** A 260px rail
  costs ~280px of content width on every page forever, and on a phone a drawer
  costs a tap on every navigation.

**Revisit when** a section genuinely needs persistent sub-navigation, or
destinations pass eight (settings, users and tariffs would do it), or it turns
out managers never use a phone — that last one removes the strongest argument.

Cheap to change: the navigation lives entirely in `components/management/
Shell.tsx`.

## Held to

`docs/management/GUIDELINES.md` — the checklist every phase is measured
against, and the reason for each rule.

## Open with the client

Carried forward and re-asked as each phase makes it concrete:

- Does Kostella still charge a deposit? The public site currently says the
  first payment is one month's rent and nothing else.
- Which building numbers are real — Beranda shows 360 and 2C, the search
  screen and footer show 361 and 2A3.
- Real data for the four invented buildings (358, 355, 364, 2A).
- Real photographs. Three shipped images are Cove's product photography.
- What a manager actually does in a day that this panel is missing.
- **Does Kostella raise rent on a sitting tenant, or only for the next one?**
  Phase 3 assumes the latter and stores an agreed rent per tenant, because the
  alternative silently re-prices people already living there. If they do raise
  it across the board, the per-tenant figure becomes needless bookkeeping.
- **Is a guardian contact always available?** Phase 3 requires one, on the
  reasoning that a khusus-putri kos must be able to reach a family. A karyawan
  renting alone may not want to give one.
- **Does a building's name change when a neighbour is added?** The rule drops
  the number where a district holds one building, so "Kostella Setiabudi"
  becomes "Kostella Setiabudi 18" the day a second Setiabudi building opens —
  a building renamed because a *different* one appeared, with signage,
  contracts and bookmarks left wrong. Always numbering avoids it and reads
  clumsier for a lone building. Left as designed until the client answers,
  because it is their naming, not ours. Rule lives in
  `lib/content/naming.ts`.
