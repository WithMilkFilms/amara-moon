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
 *
 * "Full Moon" (the Women's Full Moon Circle offering) was added so David has
 * a link he can share directly to ask women to apply. This file already had
 * seven links, and site-header.tsx notes six "only just" fit the 1152px
 * header at gap-6 — an eighth measurably overflowed in testing (the Book a
 * Stay button got pushed off past 1152px wide). Kept the label short
 * ("Full Moon", not "Full Moon Circle") and dropped the header's nav gap to
 * gap-3.5 to compensate — see site-header.tsx. Verified with a proxy render
 * of the real header markup/classes at 1024/1152/1280px: fits cleanly at
 * 1152px and up (the header's actual max width), still tight below ~1100px,
 * same as the header already was before this change.
 */
export const NAV_LINKS = [
  { href: '/offerings', label: 'Offerings' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/offerings/womens-full-moon-circle', label: 'Full Moon' },
  { href: '/book-a-room', label: 'Stay' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
  { href: '/work-with-us', label: 'Work with Us' },
] as const

/**
 * The footer mirrors the header exactly. Kept as its own export so the two can
 * diverge again without touching the footer component.
 */
export const FOOTER_LINKS = NAV_LINKS
