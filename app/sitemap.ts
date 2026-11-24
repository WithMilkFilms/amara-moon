import type { MetadataRoute } from 'next'
import { OFFERINGS } from '@/lib/offerings'
import { absoluteUrl, canonicalPath } from '@/lib/seo'

/**
 * Sitemap for every indexable route.
 *
 * Deliberately excluded:
 *  - /book/[slug]        transactional forms; the matching /offerings/[slug]
 *                        page is the canonical description of each offering,
 *                        so listing both would compete for the same terms.
 *  - /bookings/[reference] private confirmations, already noindex, and the
 *                        reference is unguessable so there is nothing to crawl.
 */
/*
 * Required by `output: 'export'`, which cannot generate this per request.
 * No `lastModified`: it could only ever be the build time, which tells Google
 * nothing about when a page's content actually changed.
 */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    path: string
    priority: number
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  }[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/offerings', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/schedule', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/book-a-room', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/shop', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    // Lower priority than guest-facing pages: it targets teachers and
    // facilitators, a much smaller audience than people looking to book.
    { path: '/work-with-us', priority: 0.5, changeFrequency: 'yearly' },
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(canonicalPath(route.path)),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    // One entry per offering, generated from the same source the pages use so
    // a new offering cannot be added without appearing here.
    ...OFFERINGS.map((offering) => ({
      url: absoluteUrl(canonicalPath(`/offerings/${offering.slug}`)),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
