/**
 * Deployment mode.
 *
 * The site ships two ways from one codebase:
 *
 *  1. `pnpm build`  — the full Next.js app. Booking, payment, enquiry forms and
 *     the database all work. This is what runs on Vercel.
 *
 *  2. `pnpm export` — a plain HTML5 bundle in `out/` for upload to shared
 *     hosting over FTP/cPanel. Apache can only serve files, so nothing that
 *     needs a server survives: no server actions, no Stripe, no Neon.
 *
 * Rather than shipping a static site with dead buttons, the static build keeps
 * every brochure page and sends anything transactional to the real app, which
 * stays online at APP_ORIGIN. A guest browsing the uploaded site can still book
 * and pay — they just cross to the app to do it.
 */

/** True only inside `pnpm export`. Set by the export script, not by hand. */
export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1'

/**
 * Origin of the full app, e.g. https://amaramoon.vercel.app — no trailing
 * slash. Only read in static builds; next.config.mjs refuses to export without
 * it, so it cannot silently produce links to nowhere.
 */
export const APP_ORIGIN = (process.env.NEXT_PUBLIC_APP_ORIGIN ?? '').replace(/\/+$/, '')

/**
 * Routes that cannot exist in a static bundle because they need a server.
 *
 * Deliberately NOT here:
 *  - /book-a-room      already fully static; it sends guests to the booking
 *                      platforms (Airbnb etc.), not to a server action.
 *  - /contact, /work-with-us
 *                      have page.static.tsx twins that keep the content and
 *                      hand only the form off to the app.
 *
 * /book/[slug] and /bookings/[reference] are the genuine ones: session checkout
 * needs Stripe, and a confirmation page has to read the booking out of Neon.
 */
export const SERVER_ONLY_ROUTES = ['/book', '/bookings'] as const

function isServerOnly(path: string) {
  return SERVER_ONLY_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`),
  )
}

/** Absolute URL to a page on the full app. */
export function appUrl(path: string) {
  return `${APP_ORIGIN}${path}`
}

/**
 * Rewrites in-app hrefs for whichever build is running.
 *
 * Returns the path untouched in the normal build, so the app keeps client-side
 * navigation. In a static build, links into server-only routes become absolute
 * URLs on the app instead of 404s on the shared host.
 *
 * Applied centrally in CtaLink, the header and the footer so a new booking link
 * added anywhere is handled without remembering this exists.
 */
export function resolveHref(href: string) {
  if (!IS_STATIC_EXPORT) return href
  return isServerOnly(href) ? appUrl(href) : href
}
