import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { PageHeader } from '@/components/page-header'
import { IMAGES } from '@/lib/images'
import { SITE } from '@/lib/site'
import { CONTACT_PAGE } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Amara Moon in Hout Bay, Cape Town — classes, studio hire, sauna and overnight stays.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ offering?: string }>
}) {
  const { offering } = await searchParams

  return (
    <>
      <PageHeader
        eyebrow={CONTACT_PAGE.eyebrow}
        title={CONTACT_PAGE.title}
        intro={CONTACT_PAGE.intro}
        image={IMAGES.deckValley}
        imageAlt="The deck looking over the valley at dusk"
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <ContactForm offeringSlug={offering} />

          <aside className="flex flex-col gap-8 lg:border-l lg:border-border lg:pl-12">
            <div className="flex flex-col gap-4">
              <h2 className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                Find us
              </h2>
              <address className="flex flex-col gap-4 font-sans text-sm not-italic leading-relaxed text-muted-foreground">
                <a href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-primary"
                >
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="flex flex-col">
                    <span>{SITE.address.line1}</span>
                    <span>{SITE.address.line2}</span>
                    <span>
                      {SITE.address.city}, {SITE.address.country}
                    </span>
                  </span>
                </a>
                <a href={SITE.phoneHref}
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Phone aria-hidden className="size-4 shrink-0 text-primary" />
                  {SITE.phone}
                </a>
                <a href={SITE.emailHref}
                  className="flex items-center gap-3 break-all transition-colors hover:text-primary"
                >
                  <Mail aria-hidden className="size-4 shrink-0 text-primary" />
                  {SITE.email}
                </a>
              </address>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                Getting here
              </h2>
              <p className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
                {CONTACT_PAGE.gettingHere}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                Follow
              </h2>
              <div className="flex flex-col gap-2">
                <a href={SITE.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Instagram &middot; {SITE.socials.instagramHandle}
                </a>
                <a href={SITE.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Facebook
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
