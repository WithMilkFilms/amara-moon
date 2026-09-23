import type { Metadata } from 'next'
import { BrandKit } from '@/components/brand/brand-kit'

export const metadata: Metadata = {
  title: 'Brand kit — Amara Moon',
  description:
    'Download the Amara Moon logo, wordmark, colours, and usage guidance as ready-to-use SVG and PNG files.',
  robots: { index: false, follow: false },
}

export default function BrandPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 sm:px-8 md:py-28">
      <header className="mb-16 max-w-2xl">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-primary">Brand kit</p>
        <h1 className="font-serif text-4xl leading-[1.05] text-balance text-foreground sm:text-5xl">
          Amara Moon logo packet
        </h1>
        <p className="mt-5 font-sans text-base leading-relaxed text-muted-foreground">
          Everything you need to place the brand anywhere — the mark, the wordmark, colours, and a
          few rules. Vector files scale to any size; PNGs come baked from the live type for places
          the font isn&apos;t installed.
        </p>
      </header>
      <BrandKit />
    </main>
  )
}
