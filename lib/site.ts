import siteData from '@/content/site.json'

/**
 * Single source of truth for contact details and navigation.
 * Editable fields live in content/site.json (via the CMS at /admin);
 * derived values (hrefs, maps URL) are computed here so they can't drift.
 */
export const SITE = {
  ...siteData,
  phoneHref: `tel:${siteData.phone.replace(/\s/g, '')}`,
  whatsappHref: `https://wa.me/${siteData.phone.replace(/[^0-9]/g, '')}`,
  emailHref: `mailto:${siteData.email}`,
  mapsUrl: siteData.googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${siteData.googlePlaceId}`
    : `https://www.google.com/maps/search/?api=1&query=${[
        siteData.address.line1,
        siteData.address.line2,
        siteData.address.city,
      ]
        .join(' ')
        .replace(/\s+/g, '+')}`,
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
