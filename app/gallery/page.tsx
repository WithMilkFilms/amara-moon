import type { Metadata } from 'next'
import { CtaLink } from '@/components/cta'
import { GalleryGrid } from '@/components/gallery-grid'
import { PageHeader } from '@/components/page-header'
import { GALLERY } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'The studio, the garden, the pool and the valley at Amara Moon in Hout Bay, Cape Town.',
  alternates: { canonical: '/gallery' },
}

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="A look around"
        intro="Ten minutes from Hout Bay village, at the foot of the Orangekloof valley."
      />

      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <GalleryGrid shots={GALLERY} />

        <div className="mt-14 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl font-serif text-2xl leading-snug text-balance text-foreground md:text-3xl">
            Come and see it for yourself.
          </p>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <CtaLink href="/book-a-room">Stay with us</CtaLink>
            <CtaLink href="/schedule" variant="outline">
              See the timetable
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  )
}
