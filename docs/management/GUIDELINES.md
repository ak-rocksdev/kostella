# Management panel — guidelines

Date: 2026-08-01

Rules every phase of the management panel is held to. Each one is here because
something in this project already went wrong the other way — the reference is
named so the rule is arguable, not folklore.

Check this list before opening a pull request, and again before demoing.

## Naming

- [ ] Routes, files, components, types and fields under `/management` are
      **English**. Public routes stay Indonesian (`/pencarian`, `/detail`);
      that boundary is deliberate, not an oversight — the client scoped the
      English convention to the internal panel to keep the change small.
- [ ] All user-visible text is **Indonesian**. A screen reads "Pengelola",
      "Tagihan", "Penghuni" while its route reads `/management/billing`.
- [ ] `admin` is not used for this panel. It is reserved for the Kostella HQ
      tier that will later manage users, tariffs and all 31 buildings.

## Figures

- [ ] **Every number is derived, never typed twice.** If two screens can state
      the same figure, they call one function.
      *Beranda once claimed a Rp3.150.000 first payment while the detail page
      for the same room said Rp1.650.000. The bundle's own dashboard mockup
      says "Okupansi 8/11" over a grid of 8 rooms with 5 occupied.*
- [ ] Totals, counts and occupancy come from the room and tenancy records, not
      from a constant beside them.
- [ ] A figure the client has not confirmed is marked `placeholder: true` in
      the data with a comment saying what it would take to replace it.
      *Four invented buildings on Beranda carry this flag.*
- [ ] **A rate is never shown without the counts it divides, and never the
      other way round.** "63%" alone hides that it is 63% of eight rooms;
      "5/8" alone makes the reader divide before they can compare two
      buildings.
- [ ] **A denominator says why it is not the number beside it.** When a room
      is blocked the strip reads 29 lettable next to 30 total; without
      "1 diblokir, di luar hitungan" that looks like a miscount.
- [ ] **No figure appears twice in one block.** *The building row briefly read
      "5/8 kamar" directly above a legend already saying "5 terisi", and
      "+1 diblokir" beside a badge already saying "1 kamar dalam perbaikan".*
- [ ] **A derived insight must fire on plausible data before it ships.**
      Set the test before building it, and cut it when it fails.
      *A "the empty rooms are the expensive ones" line was written, then
      removed: across every scenario tried — emptying the priciest building,
      then the cheapest — room occupancy and revenue occupancy stayed within
      two points, because kos rents span 1,4 to 2,4 million rather than an
      order of magnitude. Two figures that always agree are noise dressed as
      insight.*

## Personal data

- [ ] Tenant and prospect names are **obviously fictional**. Phone numbers are
      masked (`0812 xxxx 3456`).
      *This repository is public. The bundle's dashboard mockup contains
      "Nadia Putri — 0812 3456 7890" verbatim.*
- [ ] Real tenant data never enters the repository, gitignored or not.
- [ ] No screenshot committed to the repo shows a full phone number or a real
      name.

## Auditability

- [ ] Every action that changes a record writes an **audit entry**: who, when,
      which room, from what value to what value.
- [ ] Changing a price or withdrawing a room **requires a stated reason**. A
      change without one is the change an auditor cannot resolve later.
- [ ] The log is **append-only**. A mistake is corrected by another logged
      change, never by editing or deleting an entry.
- [ ] A status change records the date it takes **effect**, which is not always
      the date it was entered. Billing reads that date.
      *Left out of the phase-1 draft; billing would have had to retrofit it.*

## Public-facing attributes

- [ ] Anything a manager edits that also appears publicly is stored as an **id
      from a fixed list**, never free text.
      *`facilityFacet` groups the search filter chips by exact string. One
      manager typing "WiFi" where the data says "Wifi" splits the filter into
      two chips matching half the buildings each, silently.*
- [ ] A value shown in two places is stored once and rendered through a label
      map. *Tenancy is "Khusus putri" on Beranda and "putri" on the search
      screen — two shapes for one fact, and they could already have drifted.*
- [ ] An edit screen says in plain words where the change will appear. A
      manager should not have to guess how far a tick travels.
- [ ] Adding a genuinely new option is a code change. That friction is correct
      for something that reshapes a public filter.

## Roles

- [ ] The **owner** view shows aggregates and trends. It never lists individual
      tenants, and it has no write actions.
- [ ] The **manager** view shows individuals and can act on them.
- [ ] A field added to one view is checked against the other before shipping:
      "would an owner be entitled to see this?"

## Prototype honesty

- [ ] The site is a **static export**. State changes live in `localStorage`,
      are visible only in the browser that made them, and vanish when it is
      cleared.
- [ ] Stored data carries a **schema version**. A mismatch discards and
      reseeds — loudly and predictably — rather than reading a stale shape.
      *Otherwise a deploy breaks a demo already in progress.*
- [ ] There is a **reset to seeded state**. Without one, the second pitch of the
      day starts from whatever the first left behind.
- [ ] Any screen that appears to save something says on screen that it is a
      prototype. A client must never leave the demo believing data persists.
- [ ] Nothing in the UI implies a backend, a login, or multi-user sync that
      does not exist.

## Design system

- [ ] The panel uses the **same tokens and components** as the public site.
      Radii 16px card / 8px tag, `rounded-full` controls, `--shadow-card` at
      rest, plum for actions only.
- [ ] No second visual language for "internal". The floor grid the manager
      clicks is the one a renter sees — that shared surface is the argument the
      internal side exists to make.
- [ ] New primitives go in `components/ui/`, not `components/management/`, if a
      public screen could ever use them.

## Quality floor

- [ ] Keyboard reachable: every action has a visible focus ring and a sane tab
      order. Tables are navigable without a mouse.
- [ ] Touch targets ≥ 44px — **measured in the browser**, not assumed from
      padding. *`Button` computed to 35px at `sm` and 38px at `md` for weeks
      under this very rule, because nobody read the box.*
- [ ] Contrast ≥ 4.5:1 for body text, measured — not eyeballed.
- [ ] Status is never carried by colour alone; a word accompanies every hue.
- [ ] Works down to 390px. A data table gets a deliberate small-screen form,
      not a horizontal scrollbar by accident.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.

## Verification

- [ ] Behaviour is checked **in the browser**, not inferred from the build log.
      *The search filters looked finished and filtered nothing; the deploy
      script's own health check would have rolled back every good deploy.*
- [ ] A claim in a commit message ("no downtime", "sorted by distance") is
      measured before it is written.
- [ ] Each phase ships with its own verification notes in the spec.

## Scope

- [ ] One phase per spec. A phase is shippable on its own and leaves the site
      working.
- [ ] Buildings and rooms come first: every other record points at a room.
- [ ] Anything invented rather than briefed is listed at the end of its spec,
      so the client can be asked about it in one message.
