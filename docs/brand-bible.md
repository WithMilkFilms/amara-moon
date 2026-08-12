# Amara Moon — Brand & Strategy Bible

_Working document. Focus: growing visual presence and brand identity, across the sanctuary today,
the Buddha division next, and the offerings that may follow._

---

## 0. How to read this, and how much to trust it

This document mixes three kinds of statement. They are labelled throughout, because treating a
guess as a fact is how brands drift.

| Marker | Meaning |
| --- | --- |
| **[REAL]** | Taken from the live site, the codebase or details you have given me. Reliable. |
| **[PROPOSED]** | My recommendation. Reasoned from the real material, but a decision you still own. |
| **[OPEN]** | A question I cannot answer from here. Gathered in §8 so nothing hides. |

**What this document is not.** I have no market research, competitor analysis, audience analytics,
traffic data or revenue figures for Amara Moon. Nothing here is validated against the Cape Town
wellness market. It is a coherent framework built from your actual brand assets — not a
research-backed business case. Where I would be inventing numbers, I have left **[OPEN]** instead.

**A standing caveat on money.** Every price in the codebase except the two sauna rates is a
placeholder (`needsPrice: true`). Any revenue thinking below is structural, not forecast.

---

# PART I — THE CORE BRAND

## 1.1 What Amara Moon actually is

**[REAL]** A yoga and wellness sanctuary at 10a Connemara Drive, Orangekloof Valley, Hout Bay, Cape
Town. On one property: a timber-and-glass yoga studio, an infrared sauna, a self-contained cabin for
two, a pool and deck, and private access to mountain trails leading to Myburghs waterfall ravine.
Off the mountain and on the beach in 3km.

**[REAL] The name.** _Amara_ carries the sense of eternal or undying in Sanskrit; _Moon_ is the
nightly, cyclical counterpart. The logo already commits to this: a gold tree of life inside a
crescent moon, on near-black.

### The positioning line

**[PROPOSED]** Internally, hold this:

> **Amara Moon is a threshold, not a destination.** Mountain on one side, sea on the other, and a
> quiet property in between where people cross from one state into another.

This is not a public tagline. It is the sentence that settles arguments — if a proposed offering,
photo or product does not serve *crossing over into a different state*, it does not belong.

**[REAL]** The public tagline stays as it is: _Yoga & Wellness Sanctuary_.

### The single strongest asset

**[PROPOSED]** The geography is the moat. Anyone can open a studio; nobody else has *this* valley
with private trail access on one side and the beach 3km on the other. Competitors can copy classes,
pricing and interiors. They cannot copy the location.

**Strategic consequence:** the land should appear in the brand as heavily as the practice. Sell the
threshold, not the timetable.

## 1.2 Who it is for

**[PROPOSED]** — unvalidated, and worth checking against who actually walks in.

**Primary — the local restorer.** Cape Town residents, roughly Hout Bay and the Atlantic seaboard,
who come repeatedly for sauna, class or breathwork. They are the revenue base: high frequency, low
acquisition cost, and the source of word of mouth.

**Secondary — the visiting practitioner.** Teachers, therapists and facilitators who hire the Oasis
Studio. Small in number, disproportionately valuable: they bring their own audiences onto the
property and fill hours you are not teaching.

**Tertiary — the seeker in transit.** Travellers and locals wanting a night or two in the Pine
Forest Cabin. Lower frequency, higher ticket, most sensitive to photography, and the group most
likely to find you through Instagram and search.

**[PROPOSED]** Serve them in that order when they conflict. A decision that pleases travellers but
irritates regulars is the wrong decision.

## 1.3 Voice

**[REAL]** The existing copy already has a voice, and it is good. Observed traits, drawn from lines
already on the site:

- **Short declaratives.** "Come as you are." "Towels provided."
- **Sensory and concrete over abstract.** "The air smells of fynbos, and the loudest thing you will
  hear is the stream" — not "a peaceful atmosphere."
- **Plain about logistics.** "Breakfast is not included, but there is everything you need to make
  your own." Honesty over polish.
- **Directly addressed, never salesy.** "Tell us what you are planning and we will find the hours
  that work."
- **No exclamation marks. No hype. No wellness jargon.**

### Rules

**[PROPOSED]**

**Do** — write what a person would notice standing there. Name real things: fynbos, timber, the
stream, the ravine. Answer the practical question in the same breath as the poetic one. Let
sentences end early.

**Don't** — write "unlock," "elevate," "journey," "immerse," "holistic," "curated," "sacred space,"
"dive deep," "transformative." Don't stack three adjectives. Don't promise outcomes ("you will leave
renewed") — describe conditions and let the reader conclude.

**The test:** read it aloud. If it sounds like a brochure, cut it until it sounds like a person who
lives there.

## 1.4 Visual identity

### Logo **[REAL]**

Gold tree of life within a crescent moon, on near-black. Built as an inline SVG
(`components/logo.tsx`), so it scales without assets.

**[PROPOSED]** Protection rules: always on ink or a dark photographic ground, never on white, never
on a busy mid-tone area of a photo, never recoloured, never stretched, never with added effects.
Clear space of at least the crescent's width on all sides. Below ~24px use the crescent alone.

### Palette **[REAL]** — five hues, and that is the whole system

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Ink | `--background` | `oklch(0.15 0.012 265)` | The ground. Everything sits on it. |
| Gold | `--primary` | `oklch(0.79 0.105 85)` | Logo, CTAs, hairline rules. **Scarce by design.** |
| Moss | `--secondary` | `oklch(0.34 0.045 155)` | The valley. Supporting surfaces. |
| Bone | `--foreground` | `oklch(0.95 0.008 85)` | Primary text. |
| Sand | `--muted-foreground` | `oklch(0.8 0.016 85)` | Secondary text. |

**[REAL]** The site is dark-mode only — one token set, no light variant.

**[PROPOSED]** Gold is the signature and it works *because it is rationed*. It marks the logo, the
action you want taken, and the rule that divides sections. The moment gold becomes a background
fill, a large text colour or a decorative flourish, the brand reads cheap. **If a layout feels flat,
add space, not gold.**

### Typography **[REAL]**

- **Cormorant Garamond** (300/400) — display. Large, airy, high contrast. Carries the poetry.
- **Inter** (400/500) — body and UI. Schedules, forms, prices, buttons.

Two families, and no third. Headings carry `-0.015em` tracking; small uppercase labels use the
`.label-xs` / `tracking-widest-xs` pattern at `0.22em`.

**[PROPOSED]** The pairing is doing real work: Cormorant for how the place *feels*, Inter for
anything a person must act on. Never set a price, a time or a form label in Cormorant — legibility
belongs to Inter.

### Form language **[REAL]** / **[PROPOSED]**

`--radius` is `0.25rem` **[REAL]** — nearly square. Hold that restraint. Hairline gold rules divide
sections; photography is framed by the dark ground rather than competing with it. Generous vertical
space is the primary layout tool. Asymmetric two-column sections, not centred text walls.

### Photography — the highest-leverage asset **[PROPOSED]**

The dark identity only works with photography that has genuine depth. The golden-hour ravine shot
now on the homepage is the reference standard: warm low light, real shadow, no flat midday glare.

**Direction:** shoot at golden hour or in overcast shade. Let shadows stay dark — do not lift them
in editing. Favour warm light against cool green. Include the land in interior shots wherever a
window allows. People appear mid-practice and unposed, rarely looking at camera, never grinning at
it. Empty rooms are permitted and often better — they invite the viewer in.

**Never:** hard flash, HDR, heavy clarity/dehaze, teal-orange grading, stock imagery of strangers
doing yoga on unrelated beaches.

**[PROPOSED]** Photography is where I would spend first. Every channel below is fed by it, and the
identity fails without it. One strong shoot outperforms any amount of copywriting.

---

# PART II — GROWING VISUAL PRESENCE

**[PROPOSED]** throughout this part. Sequenced by leverage, on the assumption that time is the real
constraint. Do these in order rather than all at once.

## 2.1 First: fix what is already broken

Presence leaks before it grows.

1. **Claim the Facebook vanity URL.** The page currently resolves only as
   `facebook.com/profile.php?id=61579342080219` **[REAL]**. A numeric URL is unshareable in print,
   unmemorable aloud, and reads as unestablished. Setting `@amaramoon.capetown` aligns it with
   Instagram. Smallest effort, immediate credibility.
2. **Google Business Profile.** For a destination people must *drive to*, this outranks both social
   accounts. Maps placement, hours, photos and reviews are how locals find a Hout Bay sauna. If it
   is not claimed and populated with the real photography, that is the single biggest visibility gap
   in the whole plan. **[OPEN]** — I cannot see whether it exists.
3. **Consistent handle everywhere.** One handle, `amaramoon.capetown`, on every surface.

## 2.2 Instagram — the primary channel

The offering is visual, atmospheric and place-bound. Instagram is where that converts.

**Grid strategy.** The account is a portfolio, not a diary. Because the site is dark and gold, the
grid should read dark and gold too — a visitor moving from feed to site should feel one continuous
place. Post the strong image, not the available one.

**Five content pillars** — rotate; never let one dominate:

| Pillar | What it shows | Why |
| --- | --- | --- |
| The land | Trail, ravine, valley light, weather turning | The moat. Nobody can copy it. |
| The space | Studio, sauna, cabin, deck — often empty | Sells stays and studio hire directly. |
| The practice | Hands, breath, mid-posture detail, unposed | Human warmth without stock cliché. |
| The practical | Schedule, a class added, what to bring | Converts. Atmosphere alone does not. |
| The objects | Statues, texture, gold on dark (see Part III) | Seeds the retail line before it launches. |

**Cadence.** Sustainable beats ambitious: 2–3 grid posts a week, stories more freely. Consistency
matters more than volume, and an abandoned account signals a closed business.

**Stories and reels.** Stories carry logistics and the unpolished middle of the week. Reels are the
only real discovery mechanism left — slow, quiet motion suits this brand well: mist moving through
the valley, water over stones, the sauna door opening onto trees. No trending audio that fights the
mood.

**Captions.** Voice rules from §1.3 apply unchanged. Two lines and a full stop beats a paragraph.

## 2.3 The property as a medium

The strongest brand surface is the place itself, and it is free.

- **Make one photogenic threshold.** Guests photograph *arrival* — a gate, a sign, a lit path. One
  deliberately composed moment near the entrance generates more authentic content than any
  campaign.
- **Signage in the real identity.** Gold on dark timber, Cormorant, restrained. Appears in every
  guest photo whether you plan it or not.
- **Ask, once and lightly.** A small card in the cabin with the handle. Guest photography is the
  most trusted content there is; it needs permission and a prompt, not a request for reviews.

## 2.4 Search and local discovery

Beyond Instagram, people search for *what they want near where they are*: "infrared sauna Hout Bay,"
"yoga Orangekloof," "cabin Hout Bay." The site metadata already names the valley, the beach distance
and trail access **[REAL]**, which is the right instinct.

**[PROPOSED]** The offering detail pages are the real SEO asset — each targets a distinct intent.
Over time, writing genuinely about the trails, the ravine and the valley builds relevance no
competitor can borrow, because they are not here.

## 2.5 Partnerships over paid media

**[PROPOSED]** With no budget stated, borrowed audiences beat bought ones:

- **Visiting practitioners** who hire the studio market to their own followings. The studio-hire line
  is a marketing channel disguised as revenue.
- **Neighbouring businesses** — Hout Bay cafés, trail runners, surf schools. Same customer,
  different need.
- **Photographers.** Trade a stay for a proper shoot. Solves §1.4's dependency without cash.

## 2.6 What to measure

Vanity metrics will mislead. Watch instead: enquiries and bookings per week, returning versus new
faces, studio-hire hours filled, which offering pages get traffic, and where bookings say they heard
about you — a question worth adding to the forms. **[OPEN]** No baseline exists yet.

---

# PART III — THE BUDDHA DIVISION

Statues and décor, sold on site **and** online. A sub-brand under Amara Moon.

## 3.1 Architecture and name

**[REAL]** Your decision: sub-brand under Amara Moon, sharing the existing identity.

**[PROPOSED]** That is the right call. The sanctuary is what makes the objects credible — the same
statue is a commodity in a homeware shop and meaningful when it comes from a place people
associate with practice. Do not spend that advantage by hiding the parent.

**Naming.** "Buddha division" is a fine internal label but wrong as a customer-facing name — it
describes your org chart, not the offer, and it foregrounds the commodity rather than the curation.

**[PROPOSED]** Recommendation: **Amara Moon Objects**. Gallery-like, quiet, extends naturally beyond
statues to textiles, vessels and incense without a rename. Alternatives if it does not sit right:
*Amara Moon Sanctuary Objects* (clearer, heavier), *Amara Moon Atelier* (implies you make them —
only honest if you finish or commission work), *The Moon Room* (evocative, less searchable).
**[OPEN]** — needs your approval before anything is built.

**Visual treatment.** Same palette, same fonts, same gold restraint. The one permitted flex is
**scale**: retail wants larger, closer, more tactile photography than the sanctuary pages — surface,
patina, the grain of stone or bronze filling the frame.

## 3.2 The thing I would get wrong at my peril

**[PROPOSED]** — and the most important section here.

Selling Buddha figures as "décor" carries real reputational risk in exactly the audience most likely
to buy from you. Practising Buddhists and much of the informed wellness world treat these as
devotional images, not ornaments, and the objection is neither fringe nor quiet. Several Asian
countries treat disrespectful use as a genuine offence, and travellers have been detained over it.

This is not a reason to avoid the line. It is a reason to be the seller who evidently understands
it — which is also a durable commercial advantage, because most competitors sound like importers.

**Concrete rules:**

- **Never the word "ornament," "décor item," "knick-knack" or "accessory"** for a Buddha figure.
  Prefer *figure*, *image*, *statue*, *piece*. The umbrella brand can say "objects"; an individual
  Buddha should not be described as decoration.
- **Never depict one on the floor, in a bathroom, as a doorstop, a candle holder, a coaster, or
  anything with an object resting on the head.** This applies to product photography as strictly as
  to the property.
- **Show placement respectfully** — raised, upright, at or above eye level, clean surroundings.
- **Say where each piece comes from.** Country, material, maker or workshop where known. Provenance
  is both respect and a premium signal.
- **Include a short, unpatronising note on caring for a figure** — a sentence or two on placement.
  This is the detail that marks a serious seller.
- **Never carve, drill, paint over or truncate a figure** to fit a product idea.

**[PROPOSED]** If a piece cannot be sold under these rules, it should not be in the range.

## 3.3 What the range should be

**[PROPOSED]** — structure only; I have no supplier or margin data.

- **Small pieces** — incense holders, small figures, candles. Impulse purchase after a class. The
  volume driver, and how someone becomes a customer.
- **Considered pieces** — mid-size figures, singing bowls, textiles. The core of the line.
- **Statement pieces** — large figures, garden-scale stone. Low volume, high value, and the range's
  credibility anchor even when it rarely sells.

**Keep it narrow.** A tight, evidently chosen range fits the brand and reads as curation. A broad
catalogue reads as drop-shipping and would undo §3.2 entirely.

## 3.4 The tension nobody will flag but you should know

**[PROPOSED]** Two structural frictions, worth deciding on deliberately rather than discovering:

1. **Dark-only site versus retail conversion.** The site is dark-mode only **[REAL]**, and that is
   right for a sanctuary. Retail generally converts better on light grounds with clear, evenly lit
   product shots — shoppers want to see the object plainly. Options: keep dark and lean into
   gallery-style shopping (on brand, likely lower conversion); or give shop pages a lighter ground
   (better conversion, a visible seam in the identity). **My recommendation:** stay dark, but shoot
   products on a *warm neutral stone or timber* surface rather than pure black, so form stays
   readable without breaking the palette. **[OPEN]** — your call.
2. **Commerce inside a sanctuary.** Every retail cue added to the site trades a little calm for a
   little conversion. Keep the shop a distinct, contained area rather than threading "buy" prompts
   through the practice pages. The sanctuary must not start feeling like a gift shop.

## 3.5 What selling online actually requires

**[REAL]** Stripe is connected and already used for bookings; the codebase has a working
server-side-priced checkout pattern in `lib/offerings.ts` and `startBookingCheckout`.

**[PROPOSED]** Physical goods are nonetheless a different build from bookings, and the gap is
usually underestimated:

- **Product data** — a products table (or Stripe as catalogue), variants, stock levels. Bookings
  price by time; goods price by unit and can *sell out*.
- **Shipping** — zones, weight bands, courier, tracking. Heavy stone changes the economics
  completely, and shipping a large statue may cost more than the piece.
- **Tax** — SA VAT applies once turnover crosses the compulsory registration threshold (R1m in any
  12 months, worth confirming with your accountant), plus import duties on landed stock. Prices
  should be quoted VAT-inclusive for a consumer audience.
- **Returns, breakage and insurance** — fragile goods in transit will break sometimes; the policy
  has to exist before the first order.
- **The same security spine as bookings** — recompute totals server-side from stored prices, never
  trust a client-sent amount, use idempotency keys. Already the established pattern here **[REAL]**.

**[PROPOSED] Sequence:** sell on site and by enquiry first, with the range visible on the site
before checkout exists. Real demand signals tell you what to stock and ship. Building full
e-commerce ahead of that is the expensive way to learn what people actually want.

---

# PART IV — FUTURE OFFERINGS

**[REAL]** The four you selected. **[PROPOSED]** for all analysis below.

For each: why it fits, brand rules, prerequisites, and the honest risk.

## 4.1 Retreats & multi-day programmes

**Fit — strongest of the four.** Retreats are the natural product of this property: they use the
studio, the cabin, the sauna and the trails *together*, and the threshold positioning (§1.1) is
literally what a retreat sells. Highest value per guest of anything in the plan.

**Rules.** Small enough that the valley stays quiet — capacity should be a stated feature, not a
limitation. The land is a scheduled part of the programme, not a backdrop.

**Needs.** Sleeping capacity is the binding constraint: the Pine Forest Cabin sleeps 2 **[REAL]**,
which is not a retreat. Either partner with nearby accommodation, run non-residential day retreats,
or add capacity. Also: multi-day pricing, deposits and part-payments, cancellation terms, catering
(→ §4.2), and an itinerary.

**Risk.** Deposits and cancellations are materially more complex than single bookings, and one
badly handled cancellation on a high-ticket booking does real reputational damage. **[OPEN]** —
sleeping capacity is the first question to answer.

## 4.2 Café, nourishment or produce

**Fit — good, with a caveat.** It closes a real gap: the cabin states breakfast is not included
**[REAL]**, and retreats cannot run without food. Also the most natural everyday reason for locals
to come without booking anything.

**Rules.** Food must feel grown from the valley, not catered into it. Short menu, few things done
properly, in the same plain voice — "bread, eggs, coffee" rather than "artisanal offerings."

**Needs.** This is the biggest operational step-change in the document: kitchen, health and safety
compliance, licensing, staff, perishable stock, waste, and hours that no longer flex around class
times. **[OPEN]** — whether any commercial kitchen exists.

**Risk.** A café is a different business with different margins and staffing, and it can quietly
consume the attention the sanctuary needs. **My recommendation:** start at the smallest viable
version — breakfast provisions for cabin guests, simple catering for retreats — and let demand pull
you further rather than opening a café.

## 4.3 Events & venue hire beyond the studio

**Fit — commercially strong, brand-risky.** The most immediate revenue of the four: the property is
beautiful, and whole-property hire commands far more than hourly studio hire. It also needs almost
no new infrastructure.

**Rules.** Screen by *kind* of event, not just by price. A small ceremony or a quiet corporate day
fits; a loud party does not. Noise, alcohol and volume are where this line damages everything else.

**Needs.** Whole-property pricing, a written conduct and noise policy, damage deposits, liability
insurance, and clear rules about which spaces are included.

**Risk — the highest in this document.** One unsuitable event can undo years of positioning: it
disturbs neighbours, displaces regulars, and produces photographs that contradict the brand
entirely. The sanctuary is the asset; events are the line most able to spend it. If you take this
on, the right to decline must be exercised routinely.

## 4.4 Practitioner residencies & partnerships

**Fit — excellent, and underrated.** This is an extension of studio hire, which already exists
**[REAL]**. Visiting practitioners fill hours you are not teaching, bring their own audiences (§2.5),
and broaden the timetable without you having to be present for all of it. Low capital, low risk,
compounding.

**Rules.** Practitioners are guests of the brand, not tenants. Curate for genuine alignment — a
therapist whose work contradicts the ethos costs more in confusion than they contribute in rent.
Their promotion of the residency should be part of the arrangement, not an afterthought.

**Needs.** Revenue-share versus flat-hire terms, a simple practitioner agreement, insurance and
qualification checks, and a decision on whether they appear on your schedule and site as guests or
as fixtures.

**Risk.** Guests read anyone teaching here as endorsed by Amara Moon. That is the whole value, and
the whole exposure. **[OPEN]** — revenue share versus flat hire.

## 4.5 The two you did not select

Noted so the omission is a decision rather than an oversight. **Teacher training** is typically the
highest-margin line in wellness but demands a lineage, a curriculum and certification. **Online and
digital** breaks the property's capacity ceiling but competes globally rather than locally, and
sits awkwardly with a brand whose entire advantage is *being here*. Both can be revisited; neither
belongs in the near term.

---

# PART V — BRAND ARCHITECTURE

**[PROPOSED]**

```
AMARA MOON  (master brand — the valley, the identity, the voice)
│
├── The Sanctuary                        [live today]
│     ├── Pranic Balancing Yoga
│     ├── Breathwork
│     ├── Sauna — 40 / 20 min (Infrared)
│     ├── Oasis Studio Hire              → also a marketing channel (§2.5, §4.4)
│     └── Pine Forest Cabin              → the stay
│
├── Amara Moon Objects   [PROPOSED name]  [next]
│     └── Statues, figures, textiles, incense — on site, then online
│
└── Future
      ├── Retreats & programmes          strongest fit; capacity-bound
      ├── Nourishment                    start minimal
      ├── Events & venue hire            highest revenue, highest brand risk
      └── Practitioner residencies       lowest risk, compounding
```

## 5.1 Naming conventions

**[REAL]** The naming already in place is sound and worth holding to as a pattern: the **Oasis
Studio** (the practice space) and the **Pine Forest Cabin** (where you sleep). Each name says what
the thing *is* and where it *is* — concrete, physical, unpretentious. That is the house style.

**[PROPOSED]** Rules for anything named next:

1. **Name the place or the thing, plainly.** Physical and specific beats evocative and vague.
2. **One name per thing, everywhere.** Site, signage, Instagram, invoices.
3. **Sub-brands carry "Amara Moon."** No orphan names competing with the master brand.
4. **Do not reuse a retired name.** "Oasis" moved from the cabin to the studio, so any surviving
   reference to an "Oasis" bedroom is now actively misleading. Retired names stay retired.
5. **Check the slug before the name is public.** Names live in URLs, and URLs are hard to change
   once shared or stored against records.

---

# PART VI — GUARDRAILS

**[PROPOSED]** The things most likely to erode this brand, in rough order of how quietly they happen:

1. **Gold everywhere.** The signature dies by overuse. Ration it.
2. **Weak photography.** A dark identity is unforgiving; flat or badly lit images make the whole
   site feel cheap in a way copy cannot rescue.
3. **Voice drift into wellness marketing.** The first "unlock your journey" is the beginning of
   becoming generic.
4. **Volume over fit in events.** Accepting the wrong event for the money (§4.3).
5. **Breadth over curation in retail.** A sprawling catalogue turns a sanctuary into a gift shop.
6. **Cultural carelessness with devotional objects** (§3.2). Recovery is slow and public.
7. **Growing past the quiet.** Every line here adds people to a property whose core promise is that
   "the loudest thing you will hear is the stream" **[REAL]**. Capacity is a brand attribute. At
   some point the correct strategic answer is *no*.

**The decision test.** For anything new, in order: Does it serve the threshold (§1.1)? Does it keep
the valley quiet? Would a regular be glad or annoyed? Can it be photographed in this identity? Only
then: does it make money?

---

# PART VII — SEQUENCING

**[PROPOSED]** Ordered by leverage per unit of effort, not by ambition.

**Now — costs almost nothing, compounds immediately**

1. Claim the Facebook vanity URL (§2.1)
2. Claim and populate the Google Business Profile (§2.1) — likely the largest single visibility gap
3. Commission or trade for one proper photography shoot (§1.4) — everything else depends on it
4. Set the real prices in `lib/offerings.ts`; placeholders currently block revenue on four of six lines **[REAL]**

**Next — builds on the above**

5. Establish the Instagram pillars and a sustainable cadence (§2.2)
6. Approve the sub-brand name (§3.1); begin selling objects on site and by enquiry
7. Formalise practitioner residencies (§4.4) — lowest risk, fills existing hours

**Then — needs real decisions first**

8. Online store, once on-site demand shows what to stock (§3.5)
9. Retreats, once the sleeping-capacity question is answered (§4.1)
10. Minimal nourishment offer, pulled by retreat and cabin demand (§4.2)
11. Events, only with a written conduct policy and the willingness to decline (§4.3)

## 8. Open questions

Everything I could not resolve from here, gathered so none of it hides in the prose:

1. Does a Google Business Profile exist, and is it claimed? (§2.1)
2. Approve or replace the name **Amara Moon Objects**. (§3.1)
3. Shop pages: stay fully dark, or lighter ground for conversion? (§3.4)
4. Retreats: total sleeping capacity, or partner accommodation? (§4.1)
5. Is there a commercial kitchen, or would one need building? (§4.2)
6. Practitioner terms: revenue share or flat hire? (§4.4)
7. Real prices for the four placeholder lines. (standing caveat, §0)
8. Any marketing budget at all, or strictly organic? Parts II–III assume organic.
9. Who actually walks in today — does §1.2 match reality?
10. Supplier, landed cost and margin for the objects range. (§3.3)
