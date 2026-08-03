# Phase 6 — the owner's view

Date: 2026-08-03
Roadmap: `docs/management/ROADMAP.md`
Held to: `docs/management/GUIDELINES.md`

Written before phase 5 deliberately. Reports are analysis over the same figures
this screen needs; building the owner's view first shows which of them anybody
actually asks for, rather than guessing six reports and finding five unopened.

## Goal

An owner is a franchise partner who put a building into Kostella's hands. This
screen answers the only question they have: **is my building doing well, and is
the money coming in.**

It is read-only. Every action belongs to the manager.

## The decision this phase turns on

**What an owner must not see.**

They are entitled to know how their building performs. They are not entitled to
know who lives in it. The people in those rooms did not sign anything with the
owner; they gave their names, their parents' phone numbers and their occupations
to Kostella.

| Shown | Never shown |
|---|---|
| Okupansi, and which rooms are empty | Who is in the occupied ones |
| Pemasukan bulan ini, and the trend | Which tenant paid what |
| Tunggakan as a figure | Who is behind, or by how much |
| Biaya listrik kamar kosong | Any phone number, guardian, or occupation |
| How many rooms need attention | The audit log |

The arrears line is the sharp case, and it is the reason this is a decision
rather than a filter. An owner seeing "Rp 3.545.000 belum terbayar" is being
told about their money. An owner seeing "Sari Handayani, kamar 304, terlambat 29
hari" is being handed a tenant's financial difficulty by a company that has no
standing to hand it over — and that tenant would have no idea it happened.

**This is why the owner view is its own shell, decided on 2026-08-01 before it
was built.** A partner logging into the manager's panel and finding "Penghuni"
and "Tagihan" in the navigation would be reading a menu of things they must not
open. That is the wrong model, not a permissions bug to patch later.

## Who is looking

There is no authentication anywhere in this prototype, so there is none here.
The owner is *chosen*, the same way the manager's actor is, and the screen says
so: **Masuk sebagai · Pemilik Kostella Grogol 362**.

A real deployment would resolve the owner from a login and drop the switcher.
Nothing else changes: every figure is already derived per building.

## Screens

### `/owner` — one page

A partner checks in; they do not browse. One page, scrolled once.

**Heading.** The building's name, and the month. Not a portfolio: an owner has
one building, or a few, and each is its own answer.

**Okupansi.** The percentage, the count, and the same floor grid the public
site and the manager both read — **with no names on it**. Which rooms are
empty is the owner's business; who is behind the closed doors is not. That the
grid is the same one a renter sees is the project's whole argument, and it is
worth an owner seeing it.

**Pemasukan.** What came in this month against what the building could earn if
full, and the trend behind it. The figures exist and are real: 362 shows
Rp 9,2 jt of a possible Rp 14,6 jt, and six months running 13,4 → 27,2 jt.

**Belum terbayar.** One figure. Rp 3.545.000 for 362 today. No names, no rows,
no ages — the manager's screen has all of that, and the manager is who chases it.

**Yang sedang dikerjakan.** A count, not a list: *3 kamar sedang ditangani
pengelola*. It answers "is anyone doing anything" without naming a tenant.

**Biaya.** Electricity billed by PLN on rooms with nobody in them —
Rp 174.000 for 362 last month. This is the owner's money leaving, it is
invisible in Kostella's books today, and it is the one figure on this screen
they could not get by asking.

### No second page

No reports, no export, no history browser. If a partner wants a year's figures
they ask, and phase 5 decides whether that becomes a screen.

## Scope

In scope:

- `app/owner/**` and `components/owner/**` — its own shell, its own navigation,
  nothing shared with `/management` except the design system and the records.
- Owner-facing derivations in `lib/content/management/owner.ts`, so what an
  owner may see is decided in one file that can be read on its own.
- An owner switcher, labelled as chosen rather than authenticated.

Out of scope:

- Any action. Read-only, with no exceptions.
- Anything per tenant. Not a name, not a room's occupant, not a payment.
- Authentication. Named, not faked.
- Reports and export — phase 5.

## Verification

1. `tsc`, `lint`, `build` clean.
2. **Nothing identifying reaches the page.** Automated, not eyeballed: render
   `/owner` and assert that no seeded tenant name, phone, guardian or occupation
   appears anywhere in the DOM. This is the check that matters most, and the one
   a later change is most likely to break.
3. Figures match the manager's screens exactly for the same building — one
   derivation, two audiences.
4. No `/management` route is reachable from the owner shell.
5. The trend is drawn from real payment records, not a shape.
6. Contrast measured on any new tone; targets at a real 390px viewport; no
   console errors with the clock weeks ahead.

## Invented in this phase

- **That an owner sees arrears at all.** Defensible either way — it is their
  money, but it is also a number they can do nothing about. Worth asking.
- Which buildings belong to which owner. There is no owner record; the
  switcher stands in.
- **The shape of the revenue trend.** The figures are real payments against real
  charges, but they rise across the seeded months because tenants were seeded
  with staggered move-in dates, not because anything grew. It is honest data of
  an invented history, and a client should not read it as a track record.
