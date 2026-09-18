import { todayInCapeTown } from '@/lib/booking'

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * DATED GATHERINGS — the Full Moon Circle and 9D Breathwork.
 *
 * These are different from the weekly timetable in lib/schedule.ts and from the
 * Stripe-booked sessions. They run on set dates, hold a small group, and are
 * paid for offline: a guest picks a date, sends it through the enquiry form, and
 * Kirst replies with the details and how to pay to hold the place. So there is
 * no price/checkout wiring here — only the dates and the copy the schedule page
 * needs to present them.
 *
 * Each series points at an offering slug in lib/offerings.ts so its card can
 * link through to the full offering page, and so the enquiry that comes back
 * carries a recognised slug.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Full-moon dates in South African time (SAST), listed explicitly because they
 * are astronomical and cannot be generated from a simple rule. Source:
 * timeanddate.com full-moon calendar for Cape Town. Extend this list once a
 * year so the circle never runs out of published dates.
 */
const FULL_MOON_DATES = [
  '2026-09-26',
  '2026-10-26',
  '2026-11-24',
  '2026-12-24',
  '2027-01-22',
  '2027-02-21',
  '2027-03-22',
  '2027-04-21',
  '2027-05-20',
  '2027-06-19',
  '2027-07-18',
  '2027-08-17',
  '2027-09-16',
  '2027-10-15',
  '2027-11-14',
  '2027-12-13',
] as const

/**
 * 9D Breathwork runs every second Wednesday. The series is anchored to
 * Wednesday 16 September 2026 — the first evening — and every date is 14 days
 * on from there, so the run stays fixed no matter when the page is built.
 */
const BREATHWORK_ANCHOR = '2026-09-16'
const BREATHWORK_INTERVAL_DAYS = 14

/**
 * Both series run through the current season only — the last published date is
 * the end of May 2027. Extend this (and FULL_MOON_DATES) when the next season
 * is confirmed.
 */
const SEASON_END = '2027-05-31'

/** Adds whole days to a `YYYY-MM-DD` date in UTC, avoiding timezone drift. */
function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** Upcoming full-moon dates (today onwards, Cape Town time). */
export function upcomingFullMoonDates(limit = 8): string[] {
  const today = todayInCapeTown()
  // ISO `YYYY-MM-DD` strings sort correctly with a plain string compare.
  return FULL_MOON_DATES.filter((d) => d >= today && d <= SEASON_END).slice(0, limit)
}

/** Upcoming 9D Breathwork dates, generated forward from the anchor Wednesday. */
export function upcomingBreathworkDates(limit = 8): string[] {
  const today = todayInCapeTown()
  const dates: string[] = []
  let date = BREATHWORK_ANCHOR
  // Bounded so a stale anchor can never loop forever; ~4.6 years of fortnights.
  for (let i = 0; i < 120 && dates.length < limit && date <= SEASON_END; i++) {
    if (date >= today) dates.push(date)
    date = addDays(date, BREATHWORK_INTERVAL_DAYS)
  }
  return dates
}

/** "Saturday 26 September 2026" — the format used in the picker and the email. */
export function formatGatheringDate(iso: string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`))
}

export interface Gathering {
  slug: string
  name: string
  /** How often it runs, e.g. "Every full moon". */
  cadence: string
  /** What it costs, in plain words — no checkout is involved. */
  priceLabel: string
  /** Capacity note, e.g. "Limited to 8 places". */
  spacesLabel: string
  blurb: string
  /** Upcoming dates, soonest first. May be empty once a list runs out. */
  dates: string[]
}

/**
 * Both dated series with their next dates resolved. Read at render time so the
 * dates reflect whenever the page was last built or exported.
 */
export function getGatherings(): Gathering[] {
  return [
    {
      slug: 'full-moon-circle',
      name: "Woman's Full Moon Circle",
      cadence: 'Every full moon',
      priceLabel: 'R200 per person',
      spacesLabel: 'Limited to 16 guests',
      blurb:
        'A women-only circle by candlelight — sharing, sound and breath to mark the turn of the month together.',
      dates: upcomingFullMoonDates(),
    },
    {
      slug: 'breathwork',
      name: 'Breathwork Group Class',
      cadence: 'Every second Wednesday · 18:30',
      priceLabel: 'R400 per person',
      spacesLabel: 'Limited to 8 places',
      blurb:
        'A guided conscious-connected breathing journey in a small group, held in the Oasis Studio.',
      dates: upcomingBreathworkDates(),
    },
  ]
}
