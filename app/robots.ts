import type { MetadataRoute } from 'next'
import { absoluteUrl, SITE_URL } from '@/lib/seo'

/*
 * Required by `output: 'export'`, which has no server to generate this on
 * request. Safe because the output depends only on local constants — there is
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
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
