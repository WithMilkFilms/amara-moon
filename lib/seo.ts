import type { Offering } from '@/lib/offerings'
import { DAYS, SCHEDULE } from '@/lib/schedule'
import { SITE } from '@/lib/site'

/**
 * Canonical origin, with no trailing slash.
 *
 * Order matters. The production domain is preferred so that a preview
 * deployment never emits canonical tags or a sitemap pointing at itself —
 * that would invite Google to index the preview instead of the live site.
 * VERCEL_PROJECT_PRODUCTION_URL is set on every Vercel deployment and always
 * names the production host, so it stays correct on previews too.
 */
export const SITE_URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, '')

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (production) return `https://${production}`

  return 'https://amaramoon.capetown'
})()

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * The share image used for Open Graph and Twitter cards.
 *
 * A real photograph, not a generated card. Cropped to 1200x630 (1.91:1) at
 * build time rather than pointing at the source photo — that original is
 * 893x720, and Facebook, X and LinkedIn would all centre-crop it to a letterbox
 * and cut the moon out of frame.
 */
export const OG_IMAGE = {
  url: absoluteUrl('/images/og-share.jpg'),
  width: 1200,
  height: 630,
  alt: 'The firepit deck at Amara Moon under a rising moon, Hout Bay, Cape Town',
} as const

/**
 * Opening hours derived from the published timetable rather than hardcoded, so
 * the structured data cannot drift from the /schedule page.
 *
 * SCHEDULE is currently empty on purpose, so this returns nothing and the
 * business emits no opening hours at all. That is the correct outcome: Google
 * surfaces these directly in local results, and publishing unverified times
 * sends people to a closed gate. Hours appear here as soon as real class times
 * are added to lib/schedule.ts.
 */
export function openingHoursSpecification() {
  return DAYS.flatMap((day) => {
    const slots = SCHEDULE.filter((s) => s.day === day)
    if (slots.length === 0) return []

    const starts = slots.map((s) => s.time).sort()
    const opens = starts[0]

    // Close at the end of the last class, not at its start time.
    const closeMinutes = Math.max(
      ...slots.map((s) => {
        const [h, m] = s.time.split(':').map(Number)
        return h * 60 + m + s.durationMinutes
      }),
    )
    const closes = `${String(Math.floor(closeMinutes / 60)).padStart(2, '0')}:${String(
      closeMinutes % 60,
    ).padStart(2, '0')}`

    return [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${day}`,
        opens,
        closes,
      },
    ]
  })
}

/**
 * LocalBusiness structured data for the sanctuary.
 *
 * HealthAndBeautyBusiness is the closest schema.org subtype for a yoga and
 * wellness studio; LodgingBusiness is included as a second type because the
 * Pine Forest Cabin is genuinely bookable accommodation. Emitting both lets
 * Google understand the two sides of the business from one entity.
 */
export function localBusinessJsonLd() {
  const openingHours = openingHoursSpecification()

  return {
    '@context': 'https://schema.org',
    '@type': ['HealthAndBeautyBusiness', 'LodgingBusiness'],
    '@id': absoluteUrl('/#business'),
    name: SITE.name,
    description: `Yoga studio and wellness sanctuary in the Orangekloof Valley, Hout Bay, Cape Town. Yoga classes, breathwork, infrared sauna, studio hire and forest cabin stays.`,
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    image: OG_IMAGE.url,
    logo: absoluteUrl('/images/logo-mark.png'),
    priceRange: 'R150–R1200',
    currenciesAccepted: 'ZAR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.line1,
      addressLocality: 'Hout Bay',
      addressRegion: 'Western Cape',
      postalCode: '7806',
      addressCountry: 'ZA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Approximate — the foot of the Orangekloof valley. See SITE.geo.
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: [
      { '@type': 'City', name: 'Cape Town' },
      { '@type': 'Place', name: 'Hout Bay' },
    ],
    // Omitted entirely rather than sent as [] while no times are confirmed.
    ...(openingHours.length > 0 ? { openingHoursSpecification: openingHours } : {}),
    sameAs: [SITE.socials.instagram, SITE.socials.facebook],
    hasMap: SITE.mapsUrl,
  }
}

/**
 * Service structured data for a single offering, linked to the business.
 *
 * Offerings still awaiting a real price (`needsPrice`) deliberately omit the
 * Offer block. Publishing a placeholder amount to search engines risks Google
 * surfacing a price the business does not charge.
 */
export function serviceJsonLd(offering: Offering) {
  const url = absoluteUrl(`/offerings/${offering.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: offering.name,
    description: offering.summary,
    url,
    image: absoluteUrl(offering.image),
    serviceType: offering.kind === 'studio_hire' ? 'Studio hire' : 'Wellness session',
    provider: { '@id': absoluteUrl('/#business') },
    areaServed: [
      { '@type': 'City', name: 'Cape Town' },
      { '@type': 'Place', name: 'Hout Bay' },
    ],
    ...(offering.needsPrice
      ? {}
      : {
          offers: {
            '@type': 'Offer',
            price: (offering.priceInCents / 100).toFixed(2),
            priceCurrency: 'ZAR',
            availability: 'https://schema.org/InStock',
            url,
          },
        }),
  }
}

/** Site-level WebSite entity, which lets Google attribute the name correctly. */
export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: SITE_URL,
    name: SITE.name,
    inLanguage: 'en-ZA',
    publisher: { '@id': absoluteUrl('/#business') },
  }
}
