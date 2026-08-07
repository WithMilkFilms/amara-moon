import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { ctaVariants } from '@/components/cta'
import { activeBookingPlatforms } from '@/lib/booking-platforms'
import { cn } from '@/lib/utils'

/**
 * Sends guests to the platform that holds the cabin's live calendar.
 *
 * Availability is never duplicated here — see lib/booking-platforms.ts for why
 * mirroring Airbnb's calendar would risk double bookings.
 */
export function BookOnPlatforms() {
  const platforms = activeBookingPlatforms()

  /*
   * No listing URLs supplied yet. Rather than render dead buttons, fall back to
   * the enquiry path so the page is still useful and never broken.
   */
  if (platforms.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 border border-primary/30 bg-card p-8">
        <h2 className="font-serif text-2xl text-foreground">Enquire about your dates</h2>
        <p className="max-w-prose font-sans text-sm leading-relaxed text-muted-foreground">
          Send us the nights you have in mind and we&apos;ll come straight back to
          you with availability and a rate.
        </p>
        <Link
          href="/contact?offering=pine-forest-cabin"
          className={cn(ctaVariants({ size: 'lg' }))}
        >
          Enquire about a stay
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-6 border border-primary/30 bg-card p-8">
      <div className="flex flex-col gap-3">
        <h2 className="font-serif text-2xl text-foreground text-pretty">
          Check availability
        </h2>
        {/*
          Names the platform when there is only one listed, rather than saying
          "the platforms we list on" over a single button.
        */}
        <p className="max-w-prose font-sans text-sm leading-relaxed text-muted-foreground">
          The cabin&apos;s calendar lives{' '}
          {platforms.length === 1
            ? `on ${platforms[0].name}`
            : 'with the platforms we list on'}
          , so you&apos;ll always see true availability and can book the night
          straight away.
        </p>
      </div>

      <ul className="flex w-full flex-col gap-4">
        {platforms.map((platform, index) => (
          // items-start stops the anchor stretching to the column's full width,
          // which would override its own sm:w-auto.
          <li key={platform.id} className="flex flex-col items-start gap-2">
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                // One solid CTA only. Additional platforms are equally valid
                // routes, but two competing solid buttons read as no hierarchy
                // at all.
                ctaVariants({ variant: index === 0 ? 'solid' : 'outline', size: 'lg' }),
                'w-full sm:w-auto',
              )}
            >
              Book on {platform.name}
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="font-sans text-xs leading-relaxed text-muted-foreground">
              {platform.note}
            </p>
          </li>
        ))}
      </ul>

      <p className="w-full border-t border-border pt-5 font-sans text-sm leading-relaxed text-muted-foreground">
        Staying a week or more, or booking for a group?{' '}
        <Link
          href="/contact?offering=pine-forest-cabin"
          className="text-primary underline-offset-4 hover:underline"
        >
          Send us your dates directly
        </Link>{' '}
        and we&apos;ll quote you without the platform fee.
      </p>
    </div>
  )
}
