import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CtaLink } from '@/components/cta'
import { PageHeader } from '@/components/page-header'
import { IMAGES } from '@/lib/images'
import { SCHEDULE_PAGE } from '@/lib/pages'
import { PROGRAMME } from '@/lib/schedule'

export const metadata: Metadata = {
  title: 'Schedule',
  description:
    'Yoga, breathwork, movement, beach yoga, trail hikes and sauna at Amara Moon in Hout Bay, Cape Town. Times for the coming season are being confirmed.',
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

        <ul className="mt-12 flex flex-col">
          {PROGRAMME.map((item) => {
            // Plain text, not a link, when the practice has no offering page yet.
            const body = (
              <>
                <span className="font-serif text-xl text-foreground transition-colors group-hover:text-primary md:col-span-4 md:text-2xl">
                  {item.title}
                  {item.offeringSlug ? (
                    <ArrowUpRight
                      aria-hidden
                      className="ml-2 inline size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  ) : null}
                </span>
                <span className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground md:col-span-6">
                  {item.blurb}
                </span>
                <span className="tracking-widest-xs font-sans text-[0.7rem] uppercase text-primary md:col-span-2 md:text-right">
                  Times TBA
                </span>
              </>
            )

            return (
              <li key={item.title} className="border-b border-border first:border-t">
                {item.offeringSlug ? (
                  <Link
                    href={`/offerings/${item.offeringSlug}`}
                    className="group grid gap-2 py-7 outline-none transition-colors hover:bg-card/60 focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-12 md:items-baseline md:gap-6"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-6">
                    {body}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <div className="mt-14 flex flex-col gap-5 border border-border p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-2xl text-foreground">{SCHEDULE_PAGE.bookingHeading}</h2>
            <p className="max-w-xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
              {SCHEDULE_PAGE.bookingBody}
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
