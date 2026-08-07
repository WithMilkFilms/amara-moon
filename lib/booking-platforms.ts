/**
 * Where the Pine Forest Cabin can actually be booked.
 *
 * The cabin is listed on Airbnb and Booking.com, and each platform holds its
 * own live calendar. The site deliberately does NOT mirror that availability:
 *
 *  - Airbnb has no public API for individual hosts (the Partner API is limited
 *    to approved enterprise software vendors), so there is nothing to query.
 *  - The one available route, Airbnb's iCal feed, is pulled on Airbnb's own
 *    schedule roughly every few hours. For a single-cabin property that lag is
 *    long enough to genuinely double-book a guest.
 *
 * So each platform stays the single source of truth for its own calendar, and
 * this site sends guests there. No sync, no stale calendar, no double bookings.
 *
 * TODO: PASTE THE REAL LISTING URLS BELOW.
 * Until a `url` is filled in, that platform is automatically hidden from the
 * page, so an empty value can never ship as a dead button.
 */
export type BookingPlatform = {
  id: string
  name: string
  /** Full public listing URL. An empty string means "not listed / not supplied yet". */
  url: string
  /** One short line setting expectations, shown beneath the link. */
  note: string
}

export const BOOKING_PLATFORMS: BookingPlatform[] = [
  {
    id: 'airbnb',
    name: 'Airbnb',
    /*
     * Canonical listing URL, deliberately stripped of the query string the
     * share sheet appends (`s`, `unique_share_id`, `guests`, `adults`).
     *
     * `unique_share_id` identifies one specific share event, so keeping it
     * would attribute every visitor from this site to that single share and
     * muddy the listing's own referral stats. The `guests=1&adults=1` pair
     * would also pre-fill the search as a solo booking — wrong default for a
     * cabin that sleeps two.
     *
     * Left on .com rather than .co.za on purpose: Airbnb redirects to the
     * visitor's local domain anyway, and .com is the safer default for
     * overseas guests.
     */
    url: 'https://www.airbnb.com/rooms/1434852380292936322',
    note: 'Live calendar, instant booking and guest reviews.',
  },
  {
    id: 'booking-com',
    name: 'Booking.com',
    // e.g. 'https://www.booking.com/hotel/za/your-listing.html'
    url: '',
    note: 'Live calendar with free-cancellation options.',
  },
]

/**
 * Only the platforms that have a real URL.
 *
 * Every consumer reads through this rather than BOOKING_PLATFORMS directly, so
 * a placeholder entry is invisible until a genuine link is pasted in.
 */
export function activeBookingPlatforms(): BookingPlatform[] {
  return BOOKING_PLATFORMS.filter((platform) => platform.url.trim().length > 0)
}
