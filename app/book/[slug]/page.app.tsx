import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { SessionBookingForm } from '@/components/booking/session-booking-form'
import { CtaLink } from '@/components/cta'
import { PageHeader } from '@/components/page-header'
import { OFFERINGS, formatZar, getOffering } from '@/lib/offerings'

export function generateStaticParams() {
  return OFFERINGS.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const offering = getOffering(slug)
  if (!offering) return { title: 'Not found' }
  return {
    title: `Book ${offering.name}`,
    description: offering.summary,
  }
}

export default async function BookSessionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const offering = getOffering(slug)
  if (!offering) notFound()

  return (
    <>
      <PageHeader
        eyebrow="Book"
        title={offering.name}
        intro={offering.summary}
        image={offering.image}
        imageAlt={offering.name}
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="flex flex-col gap-8">
          {offering.needsPrice ? (
            /*
             * This offering's price in lib/offerings.ts is still a placeholder.
             * Rather than charge a guessed amount, we route to an enquiry.
             * Set the real `priceInCents` and flip `needsPrice` to false to
             * turn this into a live checkout.
             */
            <div className="flex flex-col items-start gap-4 border border-primary/30 bg-card p-8">
              <h2 className="font-serif text-2xl text-foreground">
                Priced on enquiry
              </h2>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Tell us which day suits you and we&apos;ll confirm the time and the
                price by email.
              </p>
              <CtaLink href={`/contact?offering=${offering.slug}`} size="lg">
                Enquire about {offering.name}
              </CtaLink>
            </div>
          ) : (
            <SessionBookingForm offering={offering} />
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-muted">
            <Image
              src={offering.image}
              alt={offering.name}
              fill
              sizes="(min-width: 1024px) 22rem, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex items-baseline justify-between gap-4 border-t border-border pt-6">
            <span className="font-serif text-2xl text-foreground">
              {offering.needsPrice ? 'On enquiry' : formatZar(offering.priceInCents)}
            </span>
            <span className="font-sans text-sm text-muted-foreground">
              {offering.needsPrice ? '' : offering.unit}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {offering.description.map((para) => (
              <p
                key={para}
                className="font-sans text-sm leading-relaxed text-muted-foreground"
              >
                {para}
              </p>
            ))}
          </div>

          <CtaLink href="/schedule" variant="quiet" size="bare" className="self-start">
            See the weekly timetable
          </CtaLink>
        </aside>
      </section>
    </>
  )
}
