import type { Metadata } from 'next'
import Image from 'next/image'
import { Check } from 'lucide-react'

import { BookOnPlatforms } from '@/components/booking/book-on-platforms'
import { PageHeader } from '@/components/page-header'
import { activeBookingPlatforms } from '@/lib/booking-platforms'
import { PINE_FOREST_CABIN, formatZar } from '@/lib/offerings'

export const metadata: Metadata = {
  title: 'Book the Pine Forest Cabin',
  description:
    'Book a night in the Pine Forest Cabin — a self-contained cabin for two in the Orangekloof Valley, with access to the pool, deck and mountain trails.',
  alternates: { canonical: '/book-a-room' },
}

export default function BookARoomPage() {
  const hasPlatformListings = activeBookingPlatforms().length > 0

  return (
    <>
      <PageHeader
        eyebrow="Stay"
        title="Book the Pine Forest Cabin"
        intro={PINE_FOREST_CABIN.summary}
        image={PINE_FOREST_CABIN.photos[0].src}
        imageAlt={PINE_FOREST_CABIN.photos[0].alt}
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="flex flex-col gap-8">
          <BookOnPlatforms />
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          {/*
            The exterior already leads the page header, so the sidebar carries
            the two interiors — living room first, then the loft bedroom.
          */}
          <div className="flex flex-col gap-3">
            {PINE_FOREST_CABIN.photos.slice(1).map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-3/2 overflow-hidden rounded-sm bg-muted"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 22rem, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-6">
            {/*
              With bookings handled by the platforms, the nightly rate lives on
              the listing too. Quoting a number here would only go stale the
              first time a seasonal rate changed.
            */}
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-serif text-2xl text-foreground">
                {PINE_FOREST_CABIN.needsPrice
                  ? hasPlatformListings
                    ? 'Live rates'
                    : 'On enquiry'
                  : formatZar(PINE_FOREST_CABIN.pricePerNightInCents)}
              </span>
              <span className="font-sans text-sm text-muted-foreground">
                {PINE_FOREST_CABIN.needsPrice
                  ? hasPlatformListings
                    ? 'on the listing'
                    : null
                  : 'per night'}
              </span>
            </div>

            <ul className="flex flex-col gap-3">
              {PINE_FOREST_CABIN.amenities.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-sans text-sm leading-relaxed text-muted-foreground"
                >
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            {PINE_FOREST_CABIN.description.map((para) => (
              <p
                key={para}
                className="font-sans text-sm leading-relaxed text-muted-foreground"
              >
                {para}
              </p>
            ))}
          </div>
        </aside>
      </section>
    </>
  )
}
