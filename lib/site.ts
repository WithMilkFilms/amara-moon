/**
 * Single source of truth for contact details and navigation.
 * All values below are the real details from amaramoon.capetown.
 */
export const SITE = {
  name: 'Amara Moon',
  tagline: 'Yoga & Wellness Sanctuary',
  location: 'Orangekloof Valley, Hout Bay',
  address: {
    /**
     * TODO: CONFIRM SPELLING. Street directories for Hout Bay 7806 list
     * "Connemara Drive" (two e's); the live Wix site says "Connmara". Local
     * SEO depends on this matching the Google Business Profile exactly, so
     * verify which spelling is registered before launch and fix both places.
     */
    line1: '10a Connmara Drive',
    line2: 'Hout Bay 7806',
    city: 'Cape Town',
    country: 'South Africa',
  },
  /**
   * Approximate coordinates for the foot of the Orangekloof valley, used for
   * LocalBusiness structured data.
   *
   * TODO: CONFIRM. These place the pin in the right valley but not on the
   * exact plot — drop a pin on the property in Google Maps and paste the real
   * values here, otherwise map results will send guests to the wrong gate.
   */
  geo: {
    latitude: -34.0022,
    longitude: 18.3894,
  },
  phone: '+27 71 686 97 32',
  phoneHref: 'tel:+27716869732',
  /**
   * wa.me requires the number in international form with no +, spaces or
   * dashes. Used by the static build, where the enquiry form cannot run and
   * WhatsApp becomes the primary way to reach us.
   */
  whatsappHref: 'https://wa.me/27716869732',
  email: 'info@amaramoon.capetown',
  emailHref: 'mailto:info@amaramoon.capetown',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=10a+Connmara+Drive+Hout+Bay+7806+Cape+Town',
  socials: {
    /**
     * The Instagram handle. Only Instagram uses it — the Facebook page has no
     * vanity URL yet, so it is reached by numeric profile id instead. Do not
     * assume the two share a handle.
     */
    instagramHandle: 'amaramoon.capetown',
    instagram: 'https://www.instagram.com/amaramoon.capetown/',
    facebook: 'https://www.facebook.com/profile.php?id=61579342080219',
  },
  /**
   * Proximity lines quoted on the site. The beach is given as a distance (3km);
   * the trails deliberately are not — what matters there is the private access,
   * so do not reintroduce a figure for it.
   */
  proximity: {
    beach: 'Off the mountain and on the beach in 3km',
    trails: 'Private access to mountain trails and Myburghs waterfall ravine',
  },
} as const

/**
 * "Work with Us" sits in the header rather than the footer alone: recruiting
 * teachers is an active goal while the schedule is still filling out, and a
 * footer-only link was too easy to miss. It is placed last so the guest-facing
 * booking journey still reads first.
 */
export const NAV_LINKS = [
  { href: '/offerings', label: 'Offerings' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/book-a-room', label: 'Stay' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/work-with-us', label: 'Work with Us' },
] as const

/**
 * The footer mirrors the header exactly. Kept as its own export so the two can
 * diverge again without touching the footer component.
 */
export const FOOTER_LINKS = NAV_LINKS
