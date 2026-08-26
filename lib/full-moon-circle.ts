import fullMoonData from '@/content/full-moon-circle.json'

/**
 * Upcoming dates for the Women's Full Moon Circle offering.
 *
 * Data lives in content/full-moon-circle.json, editable directly like the
 * other content files (offerings, schedule) — same reasoning as
 * lib/offerings.ts. `time` and `host` start out null: the exact time moves
 * each month around whichever host has confirmed for that circle, so a date
 * is bookable ahead of that confirmation, and this file gets filled in once
 * it's known. formatFullMoonDate() below reads that state and says "to be
 * confirmed" for whichever part is still missing.
 *
 * The dates themselves are real full moon dates (source: public full moon
 * calendars), not computed — there is no moon-phase library in this project.
 * THIS LIST IS MANUALLY MAINTAINED and will run out. Runs through May 2027 by
 * request — refresh it before then by looking up the next batch of full moon
 * dates.
 */
export interface FullMoonDate {
  date: string
  time: string | null
  host: string | null
}

export const FULL_MOON_DATES: FullMoonDate[] = (
  fullMoonData as { dates: FullMoonDate[] }
).dates

function formatDayMonthYear(dateStr: string): string {
  // Midday UTC sidesteps local-timezone date-rollback near midnight.
  const d = new Date(`${dateStr}T12:00:00Z`)
  return d.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Short label for the application form's dropdown, e.g. what she picks from. */
export function formatFullMoonOption(entry: FullMoonDate): string {
  const day = formatDayMonthYear(entry.date)
  const time = entry.time ?? 'time to be confirmed'
  return `${day}, ${time}`
}

/** Fuller label used once a date is looked up by value, e.g. in the confirmation email. */
export function formatFullMoonDate(value: string): string {
  const entry = FULL_MOON_DATES.find((d) => d.date === value)
  if (!entry) return value
  const day = formatDayMonthYear(entry.date)
  const time = entry.time ?? 'time to be confirmed'
  const host = entry.host ? `, hosted by ${entry.host}` : ' (host to be confirmed)'
  return `${day}, ${time}${host}`
}
