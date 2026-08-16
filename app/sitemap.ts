import type { MetadataRoute } from 'next'
import { OFFERINGS } from '@/lib/offerings'
import { absoluteUrl } from '@/lib/seo'

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
 * Required by `output: 'export'`, which cannot generate this per request. The
 * side effect is that `lastModified` freezes at build time — which is the
 * honest value for a static bundle, since the files really did last change
 * when they were exported.
 */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

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
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    // One entry per offering, generated from the same source the pages use so
    // a new offering cannot be added without appearing here.
    ...OFFERINGS.map((offering) => ({
      url: absoluteUrl(`/offerings/${offering.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
