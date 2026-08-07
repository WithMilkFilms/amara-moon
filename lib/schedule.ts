/*
 * ─────────────────────────────────────────────────────────────────────────────
 * WEEKLY TIMETABLE — AWAITING REAL TIMES
 * ─────────────────────────────────────────────────────────────────────────────
 * SCHEDULE is deliberately EMPTY. It previously held an invented starting
 * timetable, and unconfirmed days and times are worse than none: people plan
 * journeys around them, and `openingHoursSpecification` in lib/seo.ts feeds them
 * straight to Google as opening hours.
 *
 * Everything that reads this array already handles the empty case by showing a
 * "times to be announced" placeholder, so the site can ship without dates.
 *
 * To publish the real timetable, add entries below — nothing else needs to
 * change, the /schedule page and homepage teaser pick them up automatically.
 * `offeringSlug` must match a slug in lib/offerings.ts so the row can link
 * through to booking.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export type Day = (typeof DAYS)[number]

export interface ClassSlot {
  day: Day
  /** 24h start time, "HH:MM" */
  time: string
  durationMinutes: number
  title: string
  teacher: string
  offeringSlug: string
  /** Optional note, e.g. "All levels" */
  note?: string
}

/** No published times yet. See the note at the top of this file. */
export const SCHEDULE: ClassSlot[] = []

/** True while the timetable has no confirmed times, so views can say so. */
export const SCHEDULE_IS_PUBLISHED = SCHEDULE.length > 0

/**
 * WHAT RUNS HERE — the programme, without days or times.
 *
 * This is what the schedule views show while SCHEDULE is empty: the practices
 * on offer, so the page still answers "what happens at Amara Moon?" without
 * committing to a single unconfirmed time.
 *
 * `offeringSlug` is optional. Where it is set the item links through to a
 * bookable offering; where it is absent the practice runs but has no page yet,
 * so the item is plain text rather than a link to nowhere.
 */
export interface ProgrammeItem {
  title: string
  blurb: string
  offeringSlug?: string
}

export const PROGRAMME: ProgrammeItem[] = [
  {
    title: 'Pranic Balancing Yoga',
    blurb: 'A slow, breath-led practice. All levels, including complete beginners.',
    offeringSlug: 'pranic-balancing-yoga',
  },
  {
    title: 'Breathwork',
    blurb: 'Guided conscious connected breathing. No experience needed.',
    offeringSlug: 'breathwork',
  },
  {
    title: 'Movement & Dynamic Meditation',
    blurb: 'Freer, more expressive movement practices that end in stillness.',
  },
  {
    title: 'Beach Yoga',
    blurb: 'Practice on the sand at Hout Bay beach, a few minutes down the valley.',
  },
  {
    title: 'Trail Hikes',
    blurb: 'Guided walks from the gate into Orangekloof and up towards the ravine.',
  },
  {
    title: 'Infrared Sauna',
    blurb: 'Twenty or forty minutes in the sauna, looking into the trees. Bookable online.',
    offeringSlug: 'sauna-40',
  },
  {
    title: 'Therapies & Bodywork',
    blurb: 'Treatments with visiting practitioners, by arrangement.',
  },
]

/** Bookable start times for sauna and ad-hoc sessions. */
export const SESSION_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
] as const

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const suffix = h < 12 ? 'am' : 'pm'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12}${suffix}` : `${hour12}:${String(m).padStart(2, '0')}${suffix}`
}

export function slotsForDay(day: Day): ClassSlot[] {
  return SCHEDULE.filter((s) => s.day === day).sort((a, b) => a.time.localeCompare(b.time))
}
