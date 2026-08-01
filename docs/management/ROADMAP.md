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

| Role | Sees | Can |
|---|---|---|
| **Manager** (`/management`) | individual rooms, tenants, bills | change status, set price, confirm surveys |
| **Owner** (`/management/owner`) | aggregates and trends for their buildings | read only |

An owner is a franchise partner. They are entitled to know how their building
performs; they are not entitled to the names of the people living in it.

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
| 1 | **Buildings & rooms** — the data spine, the building switcher, room states, and the audit log every later phase writes to | `/management/buildings`, `/management/activity` | `2026-08-01-management-01-buildings-rooms.md` |
| 2 | **Dashboard** — the screen the bundle designs: metrics, floor grid with actions, today's surveys | `/management` | not written yet |
| 3 | **Tenants & contracts** — who is in which room, move-in date, contract end, deposit, expiry warnings | `/management/tenants` | not written yet |
| 4 | **Billing** — rent, electricity, laundry, other services, penalties; paid / unpaid / short-paid with the reason | `/management/billing` | not written yet |
| 5 | **Reports & owner view** — monthly income, occupancy, arrears; the owner's read-only overview | `/management/reports`, `/management/owner` | not written yet |

A later phase's spec is written when the phase before it has shipped, so it can
be written against code that exists rather than code that was imagined.

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
