import type { Metadata } from 'next'
import { BrandBible } from '@/components/brand/brand-bible'

export const metadata: Metadata = {
  title: 'Brand bible — Amara Moon',
  description:
    'The Amara Moon brand and strategy bible: positioning, voice, visual identity, growth, and the offerings that may follow.',
  robots: { index: false, follow: false },
}

export default function BrandBiblePage() {
  return (
    <main>
      <BrandBible />
    </main>
  )
}
