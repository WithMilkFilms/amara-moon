import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { CtaLink } from '@/components/cta'
import { appUrl } from '@/lib/deployment'
import { OFFERINGS, formatZar, getOffering } from '@/lib/offerings'
import { SCHEDULE, formatTime } from '@/lib/schedule'
import { absoluteUrl, OG_IMAGE, serviceJsonLd } from '@/lib/seo'

/**
 * Static-export twin of page.app.tsx.
 *
 * Identical apart from the Full Moon Circle branch: the real page renders
 * FullMoonCircleForm, which posts to a server action that shared hosting
 * cannot run (see lib/deployment.ts — a plain page.tsx that imports a server
 * action breaks `pnpm export` outright, which is what happened here). Every
 * other offering already used plain CtaLinks with no server action, so this
 * twin is only needed because that one offering grew a form of its own.
 */

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

export default async function OfferingPageStatic({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const offering = getOffering(slug)
  if (!offering) notFound()

  const times = SCHEDULE.filter((s) => s.offeringSlug === offering.slug)

  return (
    <article className="mx-auto max-w-6xl px-6 pb-14 pt-28 md:pb-20 md:pt-36">
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
            {offering.slug === 'womens-full-moon-circle' ? (
              // No on-page form in the static build — this links straight to
              // the real form on the live app instead of just a price.
              <a
                href={appUrl(`/offerings/${offering.slug}`)}
                className="font-serif text-2xl text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-foreground"
              >
                Donation based, apply below
              </a>
            ) : (
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
            )}
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

          {offering.slug === 'womens-full-moon-circle' ? null : (
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
          )}
        </div>
      </div>

      {offering.slug === 'womens-full-moon-circle' ? (
        <div className="mx-auto mt-14 flex max-w-2xl flex-col gap-4 border-l-2 border-primary py-2 pl-5 lg:mt-20">
          <p className="max-w-prose font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
            Apply to join on our booking site: name, email, phone and your
            preferred date, and we will confirm your place ahead of that circle.
          </p>
          <CtaLink
            href={appUrl(`/offerings/${offering.slug}`)}
            variant="outline"
            className="self-start"
          >
            Apply to join
          </CtaLink>
        </div>
      ) : null}
    </article>
  )
}
