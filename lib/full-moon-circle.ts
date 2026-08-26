/**
 * Upcoming dates for the Women's Full Moon Circle offering.
 *
 * Same reasoning as lib/collaboration.ts: kept in a plain module rather than
 * app/actions/enquiries.ts, since a 'use server' file may only export async
 * functions and this needs to be `.map()`-able on the client.
 *
 * These are real full moon dates (source: public full moon calendars), not
 * computed — there is no moon-phase library in this project, and adding one
 * for a single date list was not worth it. THIS LIST IS MANUALLY MAINTAINED
 * and will run out. Refresh it before February 2027 by looking up the next
 * batch of full moon dates and extending the array below.
 *
 * `value` is what gets submitted and stored; `label` is what she sees.
 */
export const FULL_MOON_DATES = [
  { value: '2026-09-26', label: 'Saturday, 26 September 2026' },
  { value: '2026-10-25', label: 'Sunday, 25 October 2026' },
  { value: '2026-11-24', label: 'Tuesday, 24 November 2026' },
  { value: '2026-12-23', label: 'Wednesday, 23 December 2026' },
  { value: '2027-01-22', label: 'Friday, 22 January 2027' },
  { value: '2027-02-20', label: 'Saturday, 20 February 2027' },
] as const

export function formatFullMoonDate(value: string): string {
  return FULL_MOON_DATES.find((d) => d.value === value)?.label ?? value
}
