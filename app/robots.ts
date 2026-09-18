import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

/*
 * Required by `output: 'export'`, which has no server to generate this on
 * request. Safe because the output depends only on local constants, there is
 * nothing here that could need revalidating.
 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Private booking confirmations.
          '/bookings/',
          // Transactional booking forms; /offerings/[slug] is canonical.
          '/book/',
          '/api/',
          // Admin panel, the app's own password gated one on Vercel and the
          // static Decap CMS login this same path serves on the Uniweb
          // export. Neither should ever be crawled or indexed.
          '/admin',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    // `host` was only ever a Yandex specific convention, no other crawler
    // reads it, and Yandex itself dropped support years ago. Dead weight.
  }
}
