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
- [ ] **A label states what is known, not what is expected.** A tenancy ending
      is not the same as a tenant leaving — they may simply renew — so "Akan
      keluar" claimed more than anyone knew. It reads "Kontrak akan habis", and
      the action that clears it reads "Kontrak dilanjutkan".
- [ ] **The operator's vocabulary outranks the model's, including when the
      model is right.** A kos manager says "kontrak habis" whether or not
      anything was signed; the records holding no fixed term is an
      implementation fact, not a reason to invent a phrase nobody uses.
      *I argued this one down twice — first to "Akan keluar", then to "Rencana
      keluar" — on the grounds that the system models no contract. That was the
      builder's vocabulary winning, which the rule above already forbids.*
- [ ] **A label uses the operator's vocabulary, never the builder's.** Words
      like *dimodelkan*, *entitas*, *status sinkron* describe how the thing was
      made; a pengelola names what they manage. If a label needs the reader to
      know how the software works, rewrite it.
      *A strip cell read "Gedung dimodelkan" and the first person to see it
      asked what it meant. It now reads "Gedung", with "dari 31 yang dikelola
      Kostella" underneath.*
- [ ] **A caveat goes in the sentence, not compressed into the label.** The
      label names the thing; the line below it carries the qualification.

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
- [ ] **What the client claims and what the system counts are never mixed on
      one screen.** A claim is legitimate on the public site, where a company
      states things about itself. In the panel it must not sit beside derived
      figures: there it reads as data, and nothing will ever update it.
      *The buildings strip said "dari 31 yang dikelola Kostella" beside counts
      taken from the records. The 31 was typed by hand, read off the client's
      current website — a snapshot of a marketing page that may already be
      stale, which the system has no way to notice. Whoever inherits the app
      would reasonably read it as data and wonder why it never moves.*
- [ ] **Every claim is written once.** `lib/content/company.ts` holds what
      Kostella says about itself — building count, cities, founding year —
      with `confirmed: false` until the client confirms it.
      *That one number had been typed into five places across three pages and
      the meta description. Changing it meant finding all five.*
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

- [ ] Tenant and prospect names are **Indonesia's stock example names** — Budi,
      Siti, Dewi, Bambang, the ones that fill every form sample. Phone numbers
      are masked (`0812 xxxx 3456`).
      *This repository is public and Kostella is a real company at a real
      address, so a name must not be mistakable for one of their tenants. A
      stock example name is read as "contoh" the way an English reader takes
      John Doe, while still reading as a person.*
- [ ] **Not letters.** The rule was "obviously fictional" and produced
      "Penghuni A" through "Penghuni V", which is safe and looks like an
      unfinished wireframe — the wrong trade for the screen a client is shown.
      A convincingly real invented name is the opposite mistake: "Amelia
      Wijaya" beside a room number at a real Grogol address reads as a leak.
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
- [ ] **A demo aid says it is one, and never borrows a product surface to do
      its job.** The three faces needed a way between them for pitching, and a
      "Masuk pengelola" link in the public footer would have read as a claim
      that Kostella has accounts. `DemoSwitcher` is labelled *Demo* on its face
      and says in words that there is no login. *It is also the first thing to
      delete when authentication arrives.*
- [ ] **Every face has a way out.** `/owner` shipped with zero links because a
      real owner has nowhere else to go — which made it a dead end nobody could
      leave without editing the address bar.

## Forms

- [ ] **A public control is not an admin input.** The search filter's seven
      price steps exist so every option reaches inventory; reused for setting a
      price they could not express five of Kostella's seven room rents, so the
      control opened showing Rp 1.200.000 for a room let at Rp 1.950.000 and
      saving without touching it cut the price by three quarters of a million.
- [ ] **Amounts are typed, with grouping applied as they are typed.** A
      seven-figure number without separators cannot be checked at a glance, and
      checking it is the reason it is being typed.
- [ ] **A row of fields aligns by shared rows, never by `items-end`.** A column
      carrying a hint is taller, so its label and its field both sit lower than
      the ones beside it. `Field` and `FieldRow` do this with `subgrid`.
- [ ] **When a layout flaw is reported, fix every instance of the pattern.**
      *The misalignment was reported twice, on two different forms, before it
      was searched for — all seven had it. Auditing the pattern took less time
      than the second report did.*
- [ ] **A required reason has to still be earned.** *The room-price reason was
      required from phase 1, when a room's rent was also the tenant's. Once a
      tenant carried their own agreed rent with its own logged action, changing
      the asking price affected nobody's money — and a mandatory sentence for it
      only produced sentences typed to get past the form.* Required stays where
      the change moves real money or removes a room from the public site.
- [ ] **A panel that opens animates both ways.** Closing instantly reads as the
      page jumping. Exit animation means the content must outlive the state that
      opened it — see `Disclosure`, which also stops a form re-rendering against
      a guard that has just become false.

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
- [ ] **Sweep the public pages too, not only the screen being built.** *A
      full-site pass found four targets under 44px on Beranda, pencarian and
      detail — the footer's phone link at 22px, the filter's radio pills at 36,
      the wordmark at 30, and Leaflet's zoom buttons at 30 — none of them
      touched by the management work and none ever measured.*
- [ ] **A third-party stylesheet imported from a component lands after
      `globals.css`.** Matching its specificity is not enough.
      *Leaflet's 30px zoom controls survived a same-specificity override.*
- [ ] **"Recessive" is not a licence to be unreadable.** *The room number on a
      taken cell was set to a faded grey deliberately and measured 1,63:1 — on
      a cell a manager clicks to change what is in the room. It is 5,2:1 now
      and still visibly quieter than an available cell.*
- [ ] Status is never carried by colour alone; a word accompanies every hue.
- [ ] Works down to 390px. A data table gets a deliberate small-screen form,
      not a horizontal scrollbar by accident.
- [ ] **Cells in a row align by shared rows, not by luck.** A strip whose
      labels happen to be the same length is one wording change away from
      breaking. `grid-rows-subgrid` keeps label, value and detail in step
      whatever the copy does.
      *Renaming "Gedung" to "Total gedung yang dikelola" wrapped one label to
      two lines and pushed its value out of step with the one beside it, at
      every phone width.*
- [ ] **Resize the viewport, do not resize the window and assume.** Chrome
      will not go below ~500px wide; a screenshot labelled 390 may be 500.
      *A layout break at 320, 360 and 390 was invisible in exactly that way.*
- [ ] **A link inside a flex row is a block-level control, not inline text.**
      WCAG exempts inline links from the 44px floor; a flex item is not one.
      Measure `display` before claiming the exemption.
      *Every tenant row's building link measured 20px and read as prose.*
- [ ] **Adding a navigation destination means re-measuring the strip at 390px.**
      *A fourth item pushed "Aktivitas" off-screen behind a sideways scroll.*

## Static export

- [ ] **Nothing is rendered from "now" during the server pass.** The HTML is
      built once and served for weeks; a date read at build time disagrees with
      the browser on every later day and React throws #418. Date-dependent text
      comes from `useToday()`, which returns null on the server.
      *Proven by shifting the browser clock five days forward before the bundle
      loaded: a clean console became a hydration failure. It would have fired
      during the pitch, not during development.*
- [ ] **Seed data holds offsets, not dates.** A module that calls `new Date()`
      at load bakes the build date into the bundle.
- [ ] Every date-bearing screen is checked once with the clock shifted weeks
      ahead, not only on the day it was written.

## JSX text

- [ ] **A sentence built from expressions goes in one template string.** JSX
      drops the whitespace around an expression that falls at a line break, and
      Prettier moves line breaks.
      *A conflict warning shipped reading "Penghuni Dbelum dikonfirmasi".*
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.

## Verification

- [ ] **Verify the effect, not the appearance.** A form that renders is not a
      form that works.
      *The move-out electricity field was checked by confirming it appeared.
      It collected the amount and threw it away — the call that stored it had
      been lost to a failed edit, and only an unused-import warning caught it.*
- [ ] An "unused import" warning after an edit means a call went missing, not
      that the import is surplus. Find the call before deleting the import.
- [ ] Behaviour is checked **in the browser**, not inferred from the build log.
      *The search filters looked finished and filtered nothing; the deploy
      script's own health check would have rolled back every good deploy.*
- [ ] A claim in a commit message ("no downtime", "sorted by distance") is
      measured before it is written.
- [ ] Each phase ships with its own verification notes in the spec.

## Screens that list things

- [ ] **Ask what proportion of the rows demand anything today.** If most demand
      nothing, the screen is a register pretending to be a worklist.
      *The tenant list rendered 22 identical cards of which 18 asked nothing —
      82%. The strip announced "3 jatuh tempo, 1 akan keluar" and then made a
      manager hunt the list to find which four.*
- [ ] **One screen, two jobs, two treatments.** "What must I do today" wants a
      short list with the job named on each row. "Where is Rina" wants a table
      with aligned columns. Giving both the same uniform cards serves neither.
- [ ] **Ranking a worklist first is not the same as giving it the page.** The
      screen's heading names its subject, and the subject has to be visible.
      *"Perlu tindakan" opened as five expanded cards — 613px before the tenant
      table appeared, on a page titled Penghuni. It is a collapsed banner now:
      44px, and the register starts underneath it.*
- [ ] **A collapsed warning names what is inside it.** A bare count makes
      somebody open it to find out whether it matters; "1 terlewat · 1 kontrak
      akan habis · 3 jatuh tempo" usually answers that on the line itself.
- [ ] **A worklist has to be able to empty.** If it looks identical tomorrow
      there is no finishing it, and it stops being read.
- [ ] **A repeated control is not an affordance.** The same words on every row —
      "Buka kamar" ×22 — say nothing about why to go there. Name the job, or
      remove it.
- [ ] **Seed the loudest state, or the design cannot be judged.** A tone that
      never occurs in the demo data renders every row identical.
      *The tenant list shipped with two tones and seeded data in which the
      urgent one never fired: 0 of 4 rows. It looked flat because it was — the
      same failure as an insight that never fires, one screen later.*
- [ ] **Urgency is a scale, not a flag.** "Besok" and "3 hari lagi" reading
      alike means the reader still has to do the sorting. Three steps is
      usually enough: already wrong, today, later.
- [ ] **Colour follows urgency, not category.** A departure and a payment at the
      same distance should look alike, because to the person working the list
      they are the same amount of "not yet".
- [ ] **One filled button per list, at most.** Four filled buttons in a column
      rank nothing.
- [ ] **Composite translucent colours through a canvas before reporting
      contrast.** `bg-plum/10` measured 1,58:1 by naive parsing and 11,01:1
      when the browser actually painted it.
- [ ] **A worklist groups by whoever gets contacted, not by record.** One
      person owing two things is one phone call; two rows read as two jobs.
      *The billing list showed rent and electricity separately until it was
      grouped by tenant, with one payment spread across both.*
- [ ] **Two functions answering nearly the same question will disagree.**
      *`nextDue` derived each due date from the move-in; `rentPeriods` walked a
      month at a time from the period before, so a 31st move-in clamped to the
      28th in February and never came back. Only one of them was wrong, which
      is how it survived review.*
- [ ] **A table inside an `overflow-hidden` card does not scroll — it
      disappears.** Measure the widest column at 500px, not just the page.
      *The electricity stage column, the one the section exists for, was cut
      off with no way to reach it.*
- [ ] **Detail wanted rarely, about one record, belongs on that record's page.**
      *The guardian contact sat on all 22 rows for something needed in an
      emergency about one person; it lives on the room now.*

## Scope

- [ ] One phase per spec. A phase is shippable on its own and leaves the site
      working.
- [ ] Buildings and rooms come first: every other record points at a room.
- [ ] Anything invented rather than briefed is listed at the end of its spec,
      so the client can be asked about it in one message.
