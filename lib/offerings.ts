import { IMAGES } from '@/lib/images'

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * PRICING — THE ONLY PLACE PRICES ARE DEFINED
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is the server-side source of truth. The browser never sends an
 * amount; checkout always recomputes the total from these values.
 *
 * The two sauna prices are CONFIRMED from the live site (R250 / R190).
 * Everything marked `needsPrice: true` is a PLACEHOLDER — those offerings show
 * an "Enquire" button instead of a Pay button, so nothing can be charged at a
 * guessed price. To start taking payment for one: set the real `priceInCents`
 * and change `needsPrice` to `false`.
 *
 * priceInCents is in ZAR cents — R250.00 => 25000
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type OfferingKind = 'session' | 'studio_hire'

export interface Offering {
  slug: string
  name: string
  kind: OfferingKind
  /** Shown next to the price, e.g. "per session" */
  unit: string
  priceInCents: number
  /** true => placeholder price, render an enquiry path instead of checkout */
  needsPrice: boolean
  /** How long one unit occupies the space, used for slot booking */
  durationMinutes: number
  /** Max units bookable in one order */
  maxQuantity: number
  summary: string
  description: string[]
  image: string
}

export const OFFERINGS: Offering[] = [
  {
    slug: 'oasis-studio-hire',
    name: 'Oasis Studio Hire',
    kind: 'studio_hire',
    unit: 'per hour',
    priceInCents: 45000, // R450/hour — PLACEHOLDER
    needsPrice: true,
    durationMinutes: 60,
    maxQuantity: 8,
    summary:
      'The Oasis Studio, a timber space among the trees, available to teachers, practitioners and facilitators.',
    description: [
      'A quiet, light-filled space for your own classes, workshops, retreats and gatherings. Warm timber floors and walls, with glass doors that open onto the garden and forest.',
      'The Oasis Studio comfortably holds a small group. Mats, bolsters and blocks are available, and there is parking on site and a kitchenette for tea.',
      'Tell us what you are planning and we will find the hours that work.',
    ],
    image: IMAGES.studioInterior,
  },
  {
    slug: 'pranic-balancing-yoga',
    name: 'Pranic Balancing Yoga',
    kind: 'session',
    unit: 'per class',
    priceInCents: 18000, // R180/class — PLACEHOLDER
    needsPrice: true,
    durationMinutes: 75,
    maxQuantity: 6,
    summary:
      'A slow, breath-led practice that works with the flow of prana through the body.',
    description: [
      'Pranic Balancing Yoga moves at the pace of the breath. Postures are held long enough to be felt, with attention on where energy gathers and where it is stuck.',
      'Suitable for all levels, including complete beginners. Come as you are.',
    ],
    image: IMAGES.yoga,
  },
  {
    slug: 'breathwork',
    name: 'Breathwork',
    kind: 'session',
    unit: 'per session',
    priceInCents: 25000, // R250/session — PLACEHOLDER
    needsPrice: true,
    durationMinutes: 90,
    maxQuantity: 6,
    summary:
      'Guided conscious breathing to release what the body has been holding.',
    description: [
      'A guided session using conscious connected breathing. The breath is the whole technique — no experience is needed, only willingness.',
      'Held in the Oasis Studio with the doors open to the valley. Bring water and wear something warm for the rest at the end.',
    ],
    image: IMAGES.breathwork,
  },
  {
    slug: 'sauna-40',
    name: 'Sauna — 40 min (Infrared)',
    kind: 'session',
    unit: 'per session',
    priceInCents: 25000, // R250 — CONFIRMED from the live site
    needsPrice: false,
    durationMinutes: 40,
    maxQuantity: 4,
    summary: 'A full forty minutes in the infrared sauna, looking into the trees.',
    description: [
      'Infrared heat works at a lower air temperature than a traditional sauna, so you can stay in longer and go deeper. Forty minutes is enough to properly unwind.',
      'Towels provided. Arrive a few minutes early to settle.',
    ],
    image: IMAGES.sauna,
  },
  {
    slug: 'sauna-20',
    name: 'Sauna — 20 min (Infrared)',
    kind: 'session',
    unit: 'per session',
    priceInCents: 19000, // R190 — CONFIRMED from the live site
    needsPrice: false,
    durationMinutes: 20,
    maxQuantity: 4,
    summary: 'A shorter infrared session — ideal after a trail run or a class.',
    description: [
      'Twenty minutes of infrared heat, perfect on its own or straight after a walk on the mountain.',
      'Towels provided.',
    ],
    image: IMAGES.saunaShort,
  },
]

/**
 * Overnight accommodation — a separate flow from sessions and studio hire.
 *
 * Note the naming: the CABIN is the place you sleep, and the OASIS STUDIO is the
 * yoga space you hire (see 'oasis-studio-hire' above). The "Oasis" name used to
 * belong to this cabin, so treat any older reference with suspicion.
 */
export const PINE_FOREST_CABIN = {
  slug: 'pine-forest-cabin',
  name: 'Pine Forest Cabin',
  maxGuests: 2,
  pricePerNightInCents: 145000, // R1,450/night — PLACEHOLDER
  needsPrice: true,
  minNights: 1,
  maxNights: 14,
  summary:
    'A self-contained cabin for two, tucked into the pines with its own entrance.',
  description: [
    'The Pine Forest Cabin sleeps two. A double bed, a small kitchenette, a private bathroom and a door that opens straight onto the garden.',
    'Guests have use of the pool and the deck, and there is private access to the mountain trails.',
    'Breakfast is not included, but there is everything you need to make your own.',
  ],
  amenities: [
    'Sleeps 2 guests',
    'Private entrance & bathroom',
    'Kitchenette',
    'Access to pool & deck',
    'Private access to mountain trails',
    'Free parking on site',
    'Fast wifi',
  ],
  image: IMAGES.cabinRoom,
  /**
   * The cabin's own photo set, widest view first. `image` above stays the single
   * card/header crop; this array backs the booking page gallery. Alt text lives
   * with the photo so every consumer describes it the same way.
   */
  photos: [
    {
      src: IMAGES.cabinExterior,
      alt: 'The A-frame cabin on stilts among the pines at dusk, its glazed gable glowing above the log store',
    },
    {
      src: IMAGES.cabinLiving,
      alt: 'The open-plan living room with a wood-burning stove, deep sofa and the kitchen beneath the mezzanine',
    },
    {
      src: IMAGES.cabinRoom,
      alt: 'The loft bedroom under the A-frame gable, bed made up beside a seating nook looking into the trees',
    },
  ],
} as const

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
