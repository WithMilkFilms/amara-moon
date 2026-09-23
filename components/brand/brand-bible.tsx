'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** The three provenance markers used throughout the bible. Rendering them as
 * badges keeps the "how much to trust this" contract visible at a glance. */
type MarkerKind = 'real' | 'proposed' | 'open'

const MARKER_META: Record<MarkerKind, { label: string; className: string }> = {
  real: {
    label: 'Real',
    className: 'border-primary/40 bg-primary/10 text-primary',
  },
  proposed: {
    label: 'Proposed',
    className: 'border-secondary-foreground/30 bg-secondary/40 text-foreground',
  },
  open: {
    label: 'Open',
    className: 'border-muted-foreground/30 bg-muted/40 text-muted-foreground',
  },
}

function Marker({ kind }: { kind: MarkerKind }) {
  const meta = MARKER_META[kind]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 align-middle font-sans text-[0.6rem] font-medium uppercase tracking-[0.18em]',
        meta.className,
      )}
    >
      {meta.label}
    </span>
  )
}

/** A numbered section with an anchor the table of contents can jump to. */
function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow?: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-6 border-t border-border pt-10">
        {eyebrow ? (
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-3xl leading-tight text-balance text-foreground sm:text-4xl">
          {title}
        </h2>
      </div>
      <div className="space-y-5 font-sans text-[0.95rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-3 font-serif text-xl text-foreground sm:text-2xl">{children}</h3>
  )
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6', className)}>{children}</div>
  )
}

const NAV = [
  { id: 'read', label: 'How to read this' },
  { id: 'core', label: 'I — The core brand' },
  { id: 'presence', label: 'II — Visual presence' },
  { id: 'objects', label: 'III — The objects line' },
  { id: 'future', label: 'IV — Future offerings' },
  { id: 'architecture', label: 'V — Brand architecture' },
  { id: 'guardrails', label: 'VI — Guardrails' },
  { id: 'sequencing', label: 'VII — Sequencing' },
  { id: 'open-questions', label: 'Open questions' },
]

const PALETTE = [
  { name: 'Ink', hex: '#0E1014', oklch: 'oklch(0.15 0.012 265)', use: 'The ground. Everything sits on it.' },
  { name: 'Gold', hex: '#DBB668', oklch: 'oklch(0.79 0.105 85)', use: 'Logo, CTAs, hairline rules. Scarce by design.' },
  { name: 'Moss', hex: '#33503F', oklch: 'oklch(0.34 0.045 155)', use: 'The valley. Supporting surfaces.' },
  { name: 'Bone', hex: '#F4F0E6', oklch: 'oklch(0.95 0.008 85)', use: 'Primary text.' },
  { name: 'Sand', hex: '#CBC4B4', oklch: 'oklch(0.8 0.016 85)', use: 'Secondary text.' },
]

const AUDIENCES = [
  {
    tier: 'Primary',
    name: 'The local restorer',
    body: 'Cape Town residents, roughly Hout Bay and the Atlantic seaboard, who come repeatedly for sauna, class or breathwork. The revenue base: high frequency, low acquisition cost, the source of word of mouth.',
  },
  {
    tier: 'Secondary',
    name: 'The visiting practitioner',
    body: 'Teachers, therapists and facilitators who hire the Oasis Studio. Small in number, disproportionately valuable — they bring their own audiences onto the property and fill hours you are not teaching.',
  },
  {
    tier: 'Tertiary',
    name: 'The seeker in transit',
    body: 'Travellers and locals wanting a night or two in the Pine Forest Cabin. Lower frequency, higher ticket, most sensitive to photography, most likely to find you through Instagram and search.',
  },
]

const PILLARS = [
  { pillar: 'The land', shows: 'Trail, ravine, valley light, weather turning', why: 'The moat. Nobody can copy it.' },
  { pillar: 'The space', shows: 'Studio, sauna, cabin, deck — often empty', why: 'Sells stays and studio hire directly.' },
  { pillar: 'The practice', shows: 'Hands, breath, mid-posture detail, unposed', why: 'Human warmth without stock cliché.' },
  { pillar: 'The practical', shows: 'Schedule, a class added, what to bring', why: 'Converts. Atmosphere alone does not.' },
  { pillar: 'The objects', shows: 'Statues, texture, gold on dark', why: 'Seeds the retail line before it launches.' },
]

const GUARDRAILS = [
  { title: 'Gold everywhere', body: 'The signature dies by overuse. Ration it. If a layout feels flat, add space, not gold.' },
  { title: 'Weak photography', body: 'A dark identity is unforgiving; flat or badly lit images make the whole site feel cheap in a way copy cannot rescue.' },
  { title: 'Voice drift into wellness marketing', body: 'The first “unlock your journey” is the beginning of becoming generic.' },
  { title: 'Volume over fit in events', body: 'Accepting the wrong event for the money disturbs neighbours, displaces regulars, contradicts the brand.' },
  { title: 'Breadth over curation in retail', body: 'A sprawling catalogue turns a sanctuary into a gift shop.' },
  { title: 'Cultural carelessness with devotional objects', body: 'Recovery is slow and public. Be the seller who evidently understands.' },
  { title: 'Growing past the quiet', body: 'Capacity is a brand attribute. At some point the correct strategic answer is no.' },
]

const SEQUENCING = [
  {
    phase: 'Now',
    note: 'Costs almost nothing, compounds immediately',
    items: [
      'Claim the Facebook vanity URL',
      'Claim and populate the Google Business Profile — likely the largest single visibility gap',
      'Commission or trade for one proper photography shoot — everything else depends on it',
      'Set the real prices in lib/offerings.ts; placeholders currently block revenue on four of six lines',
    ],
  },
  {
    phase: 'Next',
    note: 'Builds on the above',
    items: [
      'Establish the Instagram pillars and a sustainable cadence',
      'Approve the sub-brand name; begin selling objects on site and by enquiry',
      'Formalise practitioner residencies — lowest risk, fills existing hours',
    ],
  },
  {
    phase: 'Then',
    note: 'Needs real decisions first',
    items: [
      'Online store, once on-site demand shows what to stock',
      'Retreats, once the sleeping-capacity question is answered',
      'Minimal nourishment offer, pulled by retreat and cabin demand',
      'Events, only with a written conduct policy and the willingness to decline',
    ],
  },
]

const OPEN_QUESTIONS = [
  'Does a Google Business Profile exist, and is it claimed?',
  'Approve or replace the name Amara Moon Objects.',
  'Shop pages: stay fully dark, or lighter ground for conversion?',
  'Retreats: total sleeping capacity, or partner accommodation?',
  'Is there a commercial kitchen, or would one need building?',
  'Practitioner terms: revenue share or flat hire?',
  'Real prices for the four placeholder lines.',
  'Any marketing budget at all, or strictly organic?',
  'Who actually walks in today — does the audience model match reality?',
  'Supplier, landed cost and margin for the objects range.',
]

function TableOfContents({ active }: { active: string }) {
  return (
    <nav aria-label="Brand bible sections" className="space-y-1">
      <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-primary">Contents</p>
      {NAV.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            'block border-l-2 py-1.5 pl-3 font-sans text-sm transition-colors',
            active === item.id
              ? 'border-primary text-foreground'
              : 'border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground',
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

export function BrandBible() {
  const [active, setActive] = useState(NAV[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    for (const item of NAV) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:px-8 md:py-28 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <TableOfContents active={active} />
        </div>
      </aside>

      <div>
        <header className="mb-14 max-w-2xl">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-primary">
            Brand &amp; strategy bible
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] text-balance text-foreground sm:text-5xl">
            The brand, written down
          </h1>
          <p className="mt-5 font-sans text-base leading-relaxed text-muted-foreground">
            A working document. Focus: growing visual presence and brand identity — across the
            sanctuary today, the objects line next, and the offerings that may follow. Every
            statement is labelled by how much to trust it.
          </p>
        </header>

        {/* Legend */}
        <div id="read" className="scroll-mt-28">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <Marker kind="real" />
              <p className="mt-3 font-sans text-sm text-muted-foreground">
                Taken from the live site, the codebase, or details you have given. Reliable.
              </p>
            </Card>
            <Card>
              <Marker kind="proposed" />
              <p className="mt-3 font-sans text-sm text-muted-foreground">
                A recommendation, reasoned from the real material — but a decision you still own.
              </p>
            </Card>
            <Card>
              <Marker kind="open" />
              <p className="mt-3 font-sans text-sm text-muted-foreground">
                A question that can&apos;t be answered from here. Gathered at the end so nothing hides.
              </p>
            </Card>
          </div>
          <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            There is no market research, competitor analysis, or traffic data behind this — it is a
            coherent framework built from the actual brand assets, not a research-backed business
            case. A standing caveat on money: every price in the codebase except the two sauna rates
            is a placeholder, so any revenue thinking here is structural, not forecast.
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {/* PART I */}
          <Section id="core" eyebrow="Part I" title="The core brand">
            <SubHeading>What Amara Moon actually is</SubHeading>
            <p>
              <Marker kind="real" /> A yoga and wellness sanctuary at 10a Connemara Drive,
              Orangekloof Valley, Hout Bay, Cape Town. On one property: a timber-and-glass yoga
              studio, an infrared sauna, a self-contained cabin for two, a pool and deck, and private
              access to mountain trails leading to Myburghs waterfall ravine. Off the mountain and on
              the beach in 3km.
            </p>
            <p>
              <Marker kind="real" /> <span className="text-foreground">The name.</span>{' '}
              <em>Amara</em> carries the sense of eternal or undying in Sanskrit; <em>Moon</em> is
              the nightly, cyclical counterpart. The logo commits to this: a gold tree of life inside
              a crescent moon, on near-black.
            </p>
            <Card className="border-primary/30 bg-primary/5">
              <p className="font-sans text-xs uppercase tracking-[0.28em] text-primary">
                The positioning line <span className="ml-1 align-middle"><Marker kind="proposed" /></span>
              </p>
              <blockquote className="mt-4 font-serif text-2xl leading-snug text-foreground">
                Amara Moon is a threshold, not a destination. Mountain on one side, sea on the other,
                and a quiet property in between where people cross from one state into another.
              </blockquote>
              <p className="mt-4 font-sans text-sm text-muted-foreground">
                Not a public tagline — the sentence that settles arguments. If a proposed offering,
                photo or product does not serve <em>crossing over into a different state</em>, it
                does not belong. The public tagline stays as it is: <em>Yoga &amp; Wellness
                Sanctuary</em>.
              </p>
            </Card>
            <p>
              <Marker kind="proposed" />{' '}
              <span className="text-foreground">The single strongest asset is the geography.</span>{' '}
              Anyone can open a studio; nobody else has this valley with private trail access on one
              side and the beach 3km on the other. Competitors can copy classes, pricing and
              interiors — they cannot copy the location. So the land should appear in the brand as
              heavily as the practice. Sell the threshold, not the timetable.
            </p>

            <SubHeading>Who it is for</SubHeading>
            <p>
              <Marker kind="proposed" /> Serve them in this order when they conflict. A decision that
              pleases travellers but irritates regulars is the wrong decision.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {AUDIENCES.map((a) => (
                <Card key={a.name}>
                  <p className="font-sans text-xs uppercase tracking-[0.22em] text-primary">
                    {a.tier}
                  </p>
                  <p className="mt-2 font-serif text-lg text-foreground">{a.name}</p>
                  <p className="mt-2 font-sans text-sm text-muted-foreground">{a.body}</p>
                </Card>
              ))}
            </div>

            <SubHeading>Voice</SubHeading>
            <p>
              <Marker kind="real" /> The existing copy already has a voice, and it is good: short
              declaratives (“Come as you are.” “Towels provided.”), sensory and concrete over
              abstract, plain about logistics, directly addressed and never salesy. No exclamation
              marks, no hype, no wellness jargon.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <p className="font-serif text-lg text-foreground">Do</p>
                <ul className="mt-3 space-y-2 font-sans text-sm text-muted-foreground">
                  <li>Write what a person would notice standing there — fynbos, timber, the stream, the ravine.</li>
                  <li>Answer the practical question in the same breath as the poetic one.</li>
                  <li>Let sentences end early.</li>
                </ul>
              </Card>
              <Card>
                <p className="font-serif text-lg text-foreground">Don&apos;t</p>
                <ul className="mt-3 space-y-2 font-sans text-sm text-muted-foreground">
                  <li>Write “unlock,” “elevate,” “journey,” “immerse,” “holistic,” “curated,” “sacred space.”</li>
                  <li>Stack three adjectives.</li>
                  <li>Promise outcomes — describe conditions and let the reader conclude.</li>
                </ul>
              </Card>
            </div>
            <p className="text-foreground">
              The test: read it aloud. If it sounds like a brochure, cut it until it sounds like a
              person who lives there.
            </p>

            <SubHeading>Visual identity</SubHeading>
            <p>
              <Marker kind="real" /> <span className="text-foreground">Logo.</span> Gold tree of life
              within a crescent moon, on near-black. Built as an inline SVG so it scales without
              assets. <Marker kind="proposed" /> Always on ink or a dark photographic ground, never on
              white, never on a busy mid-tone area of a photo, never recoloured or stretched. Clear
              space of at least the crescent&apos;s width on all sides.
            </p>

            <p className="text-foreground">
              Palette <Marker kind="real" /> — five hues, and that is the whole system.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {PALETTE.map((c) => (
                <div key={c.name} className="overflow-hidden rounded-lg border border-border bg-card">
                  <div className="h-20" style={{ backgroundColor: c.hex }} />
                  <div className="space-y-1 p-3">
                    <p className="font-serif text-base text-foreground">{c.name}</p>
                    <p className="font-mono text-[0.7rem] text-muted-foreground">{c.hex}</p>
                    <p className="font-sans text-xs text-muted-foreground">{c.use}</p>
                  </div>
                </div>
              ))}
            </div>
            <p>
              <Marker kind="proposed" /> Gold works <em>because it is rationed</em> — the logo, the
              action you want taken, the rule that divides sections. The moment it becomes a
              background fill or a decorative flourish, the brand reads cheap.
            </p>

            <p className="text-foreground">
              Typography <Marker kind="real" />
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <p className="font-serif text-3xl text-foreground">Cormorant Garamond</p>
                <p className="mt-2 font-sans text-sm text-muted-foreground">
                  Display. Large, airy, high contrast. Carries the poetry. Never set a price, a time
                  or a form label in it.
                </p>
              </Card>
              <Card>
                <p className="font-sans text-3xl text-foreground">Inter</p>
                <p className="mt-2 font-sans text-sm text-muted-foreground">
                  Body and UI. Schedules, forms, prices, buttons. Legibility belongs here. Two
                  families, and no third.
                </p>
              </Card>
            </div>

            <p>
              <span className="text-foreground">Form language.</span>{' '}
              <Marker kind="real" /> <code className="font-mono text-xs text-primary">--radius</code>{' '}
              is <code className="font-mono text-xs text-primary">0.25rem</code> — nearly square.{' '}
              <Marker kind="proposed" /> Hold that restraint. Hairline gold rules divide sections;
              photography is framed by the dark ground rather than competing with it. Generous
              vertical space is the primary layout tool. Asymmetric two-column sections, not centred
              text walls.
            </p>
            <Card className="border-primary/30 bg-primary/5">
              <p className="font-sans text-xs uppercase tracking-[0.28em] text-primary">
                Photography — the highest-leverage asset <span className="ml-1 align-middle"><Marker kind="proposed" /></span>
              </p>
              <p className="mt-3 font-sans text-sm text-muted-foreground">
                Shoot at golden hour or in overcast shade. Let shadows stay dark — do not lift them.
                Favour warm light against cool green. People appear mid-practice and unposed, rarely
                looking at camera. Empty rooms are permitted and often better. Never hard flash, HDR,
                heavy clarity, teal-orange grading, or stock imagery of strangers. This is where to
                spend first — one strong shoot outperforms any amount of copywriting.
              </p>
            </Card>
          </Section>

          {/* PART II */}
          <Section id="presence" eyebrow="Part II" title="Growing visual presence">
            <p>
              <Marker kind="proposed" /> throughout. Sequenced by leverage, on the assumption that
              time is the real constraint. Do these in order rather than all at once.
            </p>
            <SubHeading>First: fix what is already broken</SubHeading>
            <ol className="list-decimal space-y-2 pl-5 marker:text-primary">
              <li>
                <span className="text-foreground">Claim the Facebook vanity URL.</span> A numeric
                URL is unshareable and reads as unestablished. Set{' '}
                <code className="font-mono text-xs text-primary">@amaramoon.capetown</code>.
              </li>
              <li>
                <span className="text-foreground">Google Business Profile.</span> For a destination
                people must drive to, this outranks both social accounts — it is how locals find a
                Hout Bay sauna. <Marker kind="open" /> Not visible whether it exists.
              </li>
              <li>
                <span className="text-foreground">Consistent handle everywhere:</span>{' '}
                <code className="font-mono text-xs text-primary">amaramoon.capetown</code> on every
                surface.
              </li>
            </ol>

            <SubHeading>Instagram — the primary channel</SubHeading>
            <p>
              The account is a portfolio, not a diary. Because the site is dark and gold, the grid
              should read dark and gold too — a visitor moving from feed to site should feel one
              continuous place. Post the strong image, not the available one. Sustainable beats
              ambitious: 2–3 grid posts a week, stories more freely. Reels are the only real
              discovery mechanism left, and slow, quiet motion suits this brand.
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full border-collapse text-left font-sans text-sm">
                <thead>
                  <tr className="bg-card">
                    <th className="border-b border-border px-4 py-3 font-medium text-foreground">Pillar</th>
                    <th className="border-b border-border px-4 py-3 font-medium text-foreground">What it shows</th>
                    <th className="hidden border-b border-border px-4 py-3 font-medium text-foreground sm:table-cell">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {PILLARS.map((p) => (
                    <tr key={p.pillar} className="align-top">
                      <td className="border-b border-border px-4 py-3 text-foreground">{p.pillar}</td>
                      <td className="border-b border-border px-4 py-3 text-muted-foreground">{p.shows}</td>
                      <td className="hidden border-b border-border px-4 py-3 text-muted-foreground sm:table-cell">{p.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading>The property, search, and partnerships</SubHeading>
            <p>
              The strongest brand surface is the place itself, and it is free — make one photogenic
              threshold near the entrance, put signage in the real identity (gold on dark timber),
              and ask guests to tag once and lightly. Beyond Instagram, people search for what they
              want near where they are: “infrared sauna Hout Bay,” “cabin Hout Bay.” The offering
              detail pages are the real SEO asset. With no budget stated, borrowed audiences beat
              bought ones: visiting practitioners, neighbouring Hout Bay businesses, and photographers
              who trade a stay for a proper shoot.
            </p>
          </Section>

          {/* PART III */}
          <Section id="objects" eyebrow="Part III" title="The objects line">
            <p>
              <Marker kind="real" /> Statues and décor, sold on site and online — a sub-brand under
              Amara Moon, sharing the existing identity. <Marker kind="proposed" /> The sanctuary is
              what makes the objects credible; the same statue is a commodity in a homeware shop and
              meaningful when it comes from a place people associate with practice.
            </p>
            <p>
              <span className="text-foreground">Naming.</span> “Buddha division” describes the org
              chart, not the offer. <Marker kind="proposed" /> Recommendation:{' '}
              <span className="text-foreground">Amara Moon Objects</span> — gallery-like, quiet,
              extends naturally to textiles, vessels and incense. <Marker kind="open" /> Needs approval
              before anything is built.
            </p>
            <Card className="border-primary/30 bg-primary/5">
              <p className="font-serif text-lg text-foreground">
                The thing to get right at your peril
              </p>
              <p className="mt-3 font-sans text-sm text-muted-foreground">
                Selling Buddha figures as “décor” carries real reputational risk in exactly the
                audience most likely to buy. Treat them as devotional images, not ornaments. Never
                the words “ornament,” “décor item,” or “accessory” — prefer <em>figure</em>,{' '}
                <em>image</em>, <em>statue</em>, <em>piece</em>. Never depict one on the floor, in a
                bathroom, or with an object resting on the head. Show placement respectfully — raised,
                upright, clean surroundings. Say where each piece comes from. If a piece cannot be
                sold under these rules, it should not be in the range.
              </p>
            </Card>
            <p>
              <Marker kind="proposed" /> <span className="text-foreground">Keep the range narrow</span>{' '}
              — small impulse pieces, considered mid-size pieces, and a few statement anchors. A
              tight, evidently chosen range reads as curation; a broad catalogue reads as
              drop-shipping. <Marker kind="real" /> Stripe is already connected with a server-priced
              checkout pattern, but physical goods add product data, stock, shipping, tax, and
              returns — sell on site and by enquiry first, before building full e-commerce.
            </p>
          </Section>

          {/* PART IV */}
          <Section id="future" eyebrow="Part IV" title="Future offerings">
            <p>
              <Marker kind="real" /> The four selected lines. <Marker kind="proposed" /> for all
              analysis. For each: why it fits, and the honest risk.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <p className="font-serif text-lg text-foreground">Retreats &amp; programmes</p>
                <p className="mt-2 font-sans text-sm text-muted-foreground">
                  Strongest fit — uses the studio, cabin, sauna and trails together, and literally
                  sells the threshold. Highest value per guest. Bound by sleeping capacity: the cabin
                  sleeps two, so partner, run day retreats, or add capacity.
                </p>
              </Card>
              <Card>
                <p className="font-serif text-lg text-foreground">Café / nourishment</p>
                <p className="mt-2 font-sans text-sm text-muted-foreground">
                  Closes a real gap — the cabin has no breakfast, retreats need food. But it is the
                  biggest operational step-change here. Start at the smallest viable version and let
                  demand pull you further rather than opening a café.
                </p>
              </Card>
              <Card>
                <p className="font-serif text-lg text-foreground">Events &amp; venue hire</p>
                <p className="mt-2 font-sans text-sm text-muted-foreground">
                  Commercially strong, brand-risky — the highest risk in the document. Screen by kind
                  of event, not price. One unsuitable event can undo years of positioning. The right
                  to decline must be exercised routinely.
                </p>
              </Card>
              <Card>
                <p className="font-serif text-lg text-foreground">Practitioner residencies</p>
                <p className="mt-2 font-sans text-sm text-muted-foreground">
                  Excellent and underrated — an extension of studio hire that already exists. Low
                  capital, low risk, compounding. Practitioners are guests of the brand, not tenants;
                  curate for genuine alignment.
                </p>
              </Card>
            </div>
            <p>
              <span className="text-foreground">The two not selected:</span> teacher training
              (highest margin but demands a lineage and certification) and online/digital (breaks the
              capacity ceiling but competes globally, against a brand whose whole advantage is being
              here). Both can be revisited; neither belongs in the near term.
            </p>
          </Section>

          {/* PART V */}
          <Section id="architecture" eyebrow="Part V" title="Brand architecture">
            <p>
              <Marker kind="proposed" /> Sub-brands carry “Amara Moon”; no orphan names compete with
              the master brand. Name the place or the thing plainly — the Oasis Studio and the Pine
              Forest Cabin are the house style: each says what the thing is and where it is.
            </p>
            <Card className="bg-background">
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
{`AMARA MOON  (master brand — the valley, the identity, the voice)
│
├── The Sanctuary                        [live today]
│     ├── Pranic Balancing Yoga
│     ├── Breathwork
│     ├── Sauna — 40 / 20 min (Infrared)
│     ├── Oasis Studio Hire              → also a marketing channel
│     └── Pine Forest Cabin              → the stay
│
├── Amara Moon Objects   [proposed name]  [next]
│     └── Statues, figures, textiles, incense — on site, then online
│
└── Future
      ├── Retreats & programmes          strongest fit; capacity-bound
      ├── Nourishment                    start minimal
      ├── Events & venue hire            highest revenue, highest brand risk
      └── Practitioner residencies       lowest risk, compounding`}
              </pre>
            </Card>
          </Section>

          {/* PART VI */}
          <Section id="guardrails" eyebrow="Part VI" title="Guardrails">
            <p>
              <Marker kind="proposed" /> The things most likely to erode this brand, in rough order of
              how quietly they happen.
            </p>
            <ol className="space-y-3">
              {GUARDRAILS.map((g, i) => (
                <li key={g.title} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                  <span className="font-serif text-2xl leading-none text-primary">{i + 1}</span>
                  <span>
                    <span className="block font-sans text-sm font-medium text-foreground">{g.title}</span>
                    <span className="mt-1 block font-sans text-sm text-muted-foreground">{g.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Card className="border-primary/30 bg-primary/5">
              <p className="font-sans text-xs uppercase tracking-[0.28em] text-primary">The decision test</p>
              <p className="mt-3 font-sans text-sm text-muted-foreground">
                For anything new, in order: Does it serve the threshold? Does it keep the valley
                quiet? Would a regular be glad or annoyed? Can it be photographed in this identity?
                Only then: does it make money?
              </p>
            </Card>
          </Section>

          {/* PART VII */}
          <Section id="sequencing" eyebrow="Part VII" title="Sequencing">
            <p>
              <Marker kind="proposed" /> Ordered by leverage per unit of effort, not by ambition.
            </p>
            <div className="space-y-6">
              {SEQUENCING.map((phase) => (
                <div key={phase.phase}>
                  <div className="mb-3 flex items-baseline gap-3">
                    <h3 className="font-serif text-xl text-foreground">{phase.phase}</h3>
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {phase.note}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 border-l-2 border-primary/40 py-1 pl-4 font-sans text-sm text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* Open questions */}
          <Section id="open-questions" eyebrow="Section 8" title="Open questions">
            <p>
              Everything that could not be resolved from here, gathered so none of it hides in the
              prose.
            </p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {OPEN_QUESTIONS.map((q, i) => (
                <li key={q} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                  <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-sans text-sm text-muted-foreground">{q}</span>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>
    </div>
  )
}
