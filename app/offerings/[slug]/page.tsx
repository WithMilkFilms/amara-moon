import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { CtaLink } from '@/components/cta'
import { OFFERINGS, formatZar, getOffering } from '@/lib/offerings'
import { SCHEDULE, formatTime } from '@/lib/schedule'
import { absoluteUrl, OG_IMAGE, serviceJsonLd } from '@/lib/seo'

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
  if (!offering) return { title: 'Offering not found' }

  const canonical = `/offerings/${offering.slug}`
  // Prefer the offering's own photo for the share card so a link to a class
  // does not preview with the generic homepage image.
  const image = offering.image ? absoluteUrl(offering.image) : OG_IMAGE.url

  return {
    title: offering.name,
    description: offering.summary,
    alternates: { canonical },
    openGraph: {
      title: `${offering.name} | Amara Moon`,
      description: offering.summary,
      url: absoluteUrl(canonical),
      type: 'article',
      images: [{ url: image, alt: offering.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${offering.name} | Amara Moon`,
      description: offering.summary,
      images: [image],
    },
  }
}

export default async function OfferingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const offering = getOffering(slug)
  if (!offering) notFound()

  // Any recurring class times for this offering, so people can see when it runs.
  const times = SCHEDULE.filter((s) => s.offeringSlug === offering.slug)

  return (
    // pt clears the fixed 80px site header, which overlays page content.
    <article className="mx-auto max-w-6xl px-6 pb-14 pt-28 md:pb-20 md:pt-36">
      {/*
        Service structured data, linked back to the LocalBusiness in the root
        layout. Priced offerings carry an Offer; ones awaiting a real price
        deliberately omit it rather than publish a guess to search engines.
      */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other injection point.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(offering)) }}
      />

      <CtaLink href="/offerings" variant="quiet" size="bare" className="mb-10">
        <ArrowLeft aria-hidden className="size-4" />
        All offerings
      </CtaLink>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-muted lg:sticky lg:top-24 lg:self-start">
          <Image
            src={offering.image || '/placeholder.svg'}
            alt={offering.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">
              {offering.kind === 'studio_hire' ? 'Studio hire' : 'Session'}
            </span>
            <h1 className="font-serif text-4xl leading-[1.08] text-balance text-foreground md:text-5xl">
              {offering.name}
            </h1>
            <p className="font-sans text-lg leading-relaxed text-pretty text-muted-foreground">
              {offering.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-border py-5">
            <p className="font-serif text-2xl text-primary">
              {offering.needsPrice
                ? 'Price on enquiry'
                : `${formatZar(offering.priceInCents)}`}
              {!offering.needsPrice ? (
                <span className="ml-2 font-sans text-xs uppercase tracking-widest-xs text-muted-foreground">
                  {offering.unit}
                </span>
              ) : null}
            </p>
            <p className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
              <Clock aria-hidden className="size-4 text-primary" />
              {offering.durationMinutes} minutes
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {offering.description.map((para) => (
              <p
                key={para}
                className="font-sans text-base leading-relaxed text-pretty text-muted-foreground"
              >
                {para}
              </p>
            ))}
          </div>

          {times.length > 0 ? (
            <div className="flex flex-col gap-3">
              <h2 className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                Runs weekly
              </h2>
              <ul className="flex flex-wrap gap-2">
                {times.map((slot) => (
                  <li
                    key={`${slot.day}-${slot.time}`}
                    className="border border-border px-3 py-1.5 font-sans text-xs text-muted-foreground"
                  >
                    {slot.day} {formatTime(slot.time)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/*
            Offerings with placeholder prices route to an enquiry rather than
            checkout, so nobody is ever charged a guessed amount.
          */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            {offering.needsPrice ? (
              <>
                <CtaLink href={`/contact?offering=${offering.slug}`} size="lg">
                  Enquire about this
                </CtaLink>
                <CtaLink href="/schedule" variant="outline" size="lg">
                  See the timetable
                </CtaLink>
              </>
            ) : (
              <>
                <CtaLink href={`/book/${offering.slug}`} size="lg">
                  Book &amp; pay
                </CtaLink>
                <CtaLink href={`/contact?offering=${offering.slug}`} variant="outline" size="lg">
                  Ask a question
                </CtaLink>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
