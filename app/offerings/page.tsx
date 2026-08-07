import type { Metadata } from 'next'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { CtaLink } from '@/components/cta'
import { OfferingCard } from '@/components/offering-card'
import { PageHeader } from '@/components/page-header'
import { GoldRule, SectionHeading } from '@/components/section-heading'
import { IMAGES } from '@/lib/images'
import { PINE_FOREST_CABIN, OFFERINGS, formatZar } from '@/lib/offerings'

export const metadata: Metadata = {
  title: 'Offerings',
  description:
    'Oasis Studio hire, Pranic Balancing Yoga, breathwork and infrared sauna at Amara Moon in Hout Bay, Cape Town.',
  alternates: { canonical: '/offerings' },
}

export default function OfferingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Offerings"
        title="Ways to spend time here"
        intro="Come for a class, book the sauna, hire the Oasis Studio for your own work, or stay the night in the valley."
        image={IMAGES.studioInterior}
        imageAlt="The Oasis Studio, mats and crystal singing bowls set out on wooden floors"
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERINGS.map((offering) => (
            <OfferingCard key={offering.slug} offering={offering} />
          ))}
        </div>
      </section>

      <GoldRule className="mx-auto max-w-6xl" />

      {/* Overnight stays are a separate flow to sessions, so they get their own block. */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/*
            3:2 to match the photo's native ratio — a 4:3 box crops the top off
            the A-frame gable, which is the whole subject of the exterior shot.
          */}
          <div className="relative aspect-3/2 w-full overflow-hidden rounded-sm bg-muted">
            <Image
              src={PINE_FOREST_CABIN.photos[0].src}
              alt={PINE_FOREST_CABIN.photos[0].alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Stay the night"
              title={PINE_FOREST_CABIN.name}
              intro={PINE_FOREST_CABIN.summary}
            />

            <ul className="flex flex-col gap-2.5">
              {PINE_FOREST_CABIN.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="flex items-center gap-3 font-sans text-sm text-muted-foreground"
                >
                  <Check aria-hidden className="size-4 shrink-0 text-primary" />
                  {amenity}
                </li>
              ))}
            </ul>

            <p className="tracking-widest-xs font-sans text-xs uppercase text-primary">
              {PINE_FOREST_CABIN.needsPrice
                ? 'Rates on enquiry'
                : `From ${formatZar(PINE_FOREST_CABIN.pricePerNightInCents)} per night`}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/book-a-room">Check availability</CtaLink>
              <CtaLink href="/contact" variant="outline">
                Ask a question
              </CtaLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
