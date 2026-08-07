const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1'

/*
 * A static bundle whose booking links point nowhere is worse than no bundle, so
 * fail here rather than after a successful-looking build.
 */
if (isStaticExport && !process.env.NEXT_PUBLIC_APP_ORIGIN) {
  throw new Error(
    'NEXT_PUBLIC_APP_ORIGIN is required for a static export.\n' +
      'It is the origin of the live app that still handles booking and payment,\n' +
      'e.g. NEXT_PUBLIC_APP_ORIGIN=https://amaramoon.vercel.app pnpm export',
  )
}

/**
 * Which `page.*` files count as routes.
 *
 * This is how one codebase produces two different site shapes. A page that
 * needs a server is named `page.app.tsx`, and a static stand-in for the same
 * route is `page.static.tsx`. Each build registers only the extension it can
 * serve, so the other file is invisible — not built, not even compiled.
 *
 * Consequence worth knowing: renaming a page to plain `page.tsx` puts it in
 * BOTH builds, and if it touches a server action the export will fail.
 */
const pageExtensions = isStaticExport
  ? ['static.tsx', 'tsx', 'ts']
  : ['app.tsx', 'tsx', 'ts']

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions,

  /*
   * Image optimisation is ON for the app build. The scaffold shipped with
   * `unoptimized: true`, which serves every photo at full weight — the hero
   * alone is over 1MB, and that lands directly on Largest Contentful Paint,
   * which Google uses as a ranking signal.
   *
   * A static export has no optimiser, so it must be off there. Photos ship at
   * full size to shared hosting; that is the cost of a fileserver-only host.
   */
  images: {
    formats: ['image/avif', 'image/webp'],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },

  ...(isStaticExport
    ? {
        output: 'export',
        /*
         * Emits /contact/index.html instead of /contact.html. Apache serves the
         * directory form without extra configuration, so a link to /contact
         * works on cPanel as-is.
         */
        trailingSlash: true,
      }
    : {
        /*
         * Response headers are a server feature and are silently dropped by
         * `output: 'export'`. The export writes an .htaccess carrying the same
         * headers so an Apache host is not left unprotected — see
         * scripts/static-export.mjs.
         */
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(), microphone=(), geolocation=()',
                },
              ],
            },
          ]
        },
      }),
}

export default nextConfig
