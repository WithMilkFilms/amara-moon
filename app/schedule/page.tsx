import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaLink } from '@/components/cta'
import { GatheringReserve } from '@/components/booking/gathering-reserve'
import { PageHeader } from '@/components/page-header'
import { getGatherings } from '@/lib/gatherings'
import { IMAGES } from '@/lib/images'
import { SCHEDULE_PAGE } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Schedule',
  description:
    "Women's full moon circles, breathwork, yoga and infrared sauna at Amara Moon in Hout Bay, Cape Town. Reserve your place for the coming season.",
  alternates: { canonical: '/schedule' },
}

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        eyebrow={SCHEDULE_PAGE.eyebrow}
        title={SCHEDULE_PAGE.title}
        intro={SCHEDULE_PAGE.intro}
        image={IMAGES.yoga}
        imageAlt="A rolled yoga mat and candle on the Oasis Studio floor"
      />

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/*
          No day-by-day grid while SCHEDULE is empty. Seven weekdays each reading
          "no scheduled classes" would say the sanctuary is shut. The programme
          below says what runs instead, and times follow once confirmed.
        */}
        <p className="max-w-2xl border-l-2 border-primary pl-5 font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
          {SCHEDULE_PAGE.note}
        </p>

        <div className="mt-14 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">
              Reserve a place
            </span>
            <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
              Circles &amp; courses
            </h2>
            <p className="max-w-2xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
              These run on set dates and keep to a small group. Choose a date and send it
              through — Kirst will reply with everything you need, including how to pay to
              hold your place.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {getGatherings().map((gathering) => (
              <article
                key={gathering.slug}
                className="flex flex-col gap-5 border border-border bg-card/40 p-8"
              >
                <div className="flex flex-col gap-2">
                  <span className="tracking-widest-xs font-sans text-[0.7rem] uppercase text-primary">
                    {gathering.cadence}
                  </span>
                  <h3 className="font-serif text-2xl text-foreground">
                    <Link
                      href={`/offerings/${gathering.slug}`}
                      className="outline-none transition-colors hover:text-primary focus-visible:text-primary"
                    >
                      {gathering.name}
                    </Link>
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
                    {gathering.blurb}
                  </p>
                </div>

                <dl className="flex flex-wrap gap-x-10 gap-y-3 border-y border-border py-4">
                  <div className="flex flex-col gap-1">
                    <dt className="tracking-widest-xs font-sans text-[0.7rem] uppercase text-muted-foreground">
                      Cost
                    </dt>
                    <dd className="font-sans text-sm text-foreground">{gathering.priceLabel}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="tracking-widest-xs font-sans text-[0.7rem] uppercase text-muted-foreground">
                      Places
                    </dt>
                    <dd className="font-sans text-sm text-foreground">{gathering.spacesLabel}</dd>
                  </div>
                </dl>

                <GatheringReserve slug={gathering.slug} dates={gathering.dates} />
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border border-border p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-2xl text-foreground">{SCHEDULE_PAGE.bookingHeading}</h2>
            <p className="max-w-xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
              {SCHEDULE_PAGE.bookingBody}
            </p>
            <p className="tracking-widest-xs mt-1 font-sans text-[0.7rem] uppercase text-primary">
              Infrared sauna — R250 (40 min) · R190 (20 min)
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <CtaLink href="/book/sauna-40">Book a sauna</CtaLink>
            <CtaLink href="/contact" variant="outline">
              Enquire
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  )
}
