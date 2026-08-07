import offeringsData from '@/content/offerings.json'
import cabinData from '@/content/cabin.json'

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * PRICING — data lives in content/offerings.json and content/cabin.json,
 * editable through the CMS at /admin. This file provides types and the
 * server-side helpers that read them; checkout always recomputes the total
 * from these values, the browser never sends an amount.
 *
 * priceInCents is in ZAR cents — R250.00 => 25000
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type OfferingKind = 'session' | 'studio_hire'

export interface Offering {
  slug: string
  name: string
  kind: OfferingKind
  unit: string
  priceInCents: number
  needsPrice: boolean
  durationMinutes: number
  maxQuantity: number
  summary: string
  description: string[]
  image: string
}

export const OFFERINGS: Offering[] = (offeringsData as { offerings: Offering[] }).offerings

export const PINE_FOREST_CABIN = cabinData as {
  slug: string
  name: string
  maxGuests: number
  pricePerNightInCents: number
  needsPrice: boolean
  minNights: number
  maxNights: number
  summary: string
  description: string[]
  amenities: string[]
  image: string
  photos: { src: string; alt: string }[]
}

export const CURRENCY = 'zar' as const

/** Formats ZAR cents for display, e.g. 25000 => "R250" */
export function formatZar(cents: number): string {
  const rands = cents / 100
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: rands % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(rands)
    .replace(/\s/g, '')
}

export function getOffering(slug: string): Offering | undefined {
  return OFFERINGS.find((o) => o.slug === slug)
}
