import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { localBusinessJsonLd, OG_IMAGE, SITE_URL, webSiteJsonLd } from '@/lib/seo'
import { SITE } from '@/lib/site'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/* Title is 53 characters and leads with the primary keyword ("Yoga Studio ...
 * Hout Bay") so it survives Google's ~60 character truncation. "Cape Town"
 * lives in the description instead — adding it here would push the title to 64
 * and get the location clipped off the end. */
const TITLE = 'Amara Moon | Yoga Studio & Wellness Retreat, Hout Bay'

/* 150 characters, and carries all three target terms: yoga, Hout Bay, Cape Town. */
const DESCRIPTION =
  'Yoga studio and wellness sanctuary in Hout Bay, Cape Town. Yoga classes, breathwork, infrared sauna and forest cabin stays in the Orangekloof Valley.'

export const metadata: Metadata = {
  // Makes every relative canonical, OG and Twitter URL resolve absolutely.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Amara Moon',
  },
  description: DESCRIPTION,
  /*
   * No `alternates.canonical` here on purpose. Child pages inherit metadata
   * from this layout, so a canonical set at the root would make every page
   * declare itself a duplicate of the homepage and drop it from the index.
   * Each page sets its own canonical instead.
   */
  generator: 'v0.app',
  keywords: [
    'yoga studio Hout Bay',
    'wellness retreat Cape Town',
    'yoga retreat Hout Bay',
    'Orangekloof wellness hub',
    'yoga classes Cape Town',
    'breathwork Cape Town',
    'infrared sauna Hout Bay',
    'studio hire Cape Town',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_ZA',
    url: SITE_URL,
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0d0f14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark bg-background ${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {/*
         * LocalBusiness and WebSite structured data. Emitted site-wide with
         * stable @id values so every page reinforces the same entity rather
         * than declaring a new one.
         */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other injection point.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([localBusinessJsonLd(), webSiteJsonLd()]),
          }}
        />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
