import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { PageHeader } from '@/components/page-header'
import { IMAGES } from '@/lib/images'
import { SITE } from '@/lib/site'
import { CONTACT_PAGE } from '@/lib/pages'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Amara Moon in Hout Bay, Cape Town: classes, studio hire, sauna and overnight stays.',
  alternates: { canonical: canonicalPath('/contact') },
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ offering?: string; date?: string }>
}) {
  const { offering, date } = await searchParams

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
          <ContactForm offeringSlug={offering} reservationDate={date} />

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

              {/*
                Google's embed, wrapped so a fixed 600x450 iframe scales with
                the sidebar column instead of overflowing it. The place name
                baked into the src (Amara Moon Yoga and Private Wellness
                Retreat) is Google's own match, more reliable than the
                hand-entered SITE.geo used to be.
              */}
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.1842542474615!2d18.377419000000003!3d-34.0134811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc6905ace4b383%3A0xbf105a5f46d4e3e2!2sAmara%20Moon%20Yoga%20and%20Private%20Wellness%20Retreat!5e0!3m2!1sen!2suk!4v1788542250535!5m2!1sen!2suk"
                  title="Amara Moon location on Google Maps"
                  /*
                   * The free embed (no API key) only ever renders Google's
                   * light road map, there is no dark mode option for it.
                   * This inverts the whole rendered map then rotates the hue
                   * back, the standard CSS trick to fake a dark map without
                   * the Maps JavaScript API and its billing requirement.
                   */
                  className="absolute inset-0 h-full w-full border-0 [filter:invert(90%)_hue-rotate(180deg)]"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                >
                  Yoga, Wellness, Retreat
                </iframe>
              </div>
              {/*
                Visible text matching the business's exact Google listing name,
                on the page as real content rather than only inside the iframe
                title, so the name, address and phone stay consistent wherever
                Google reads them from.
              */}
              <p className="font-sans text-xs text-muted-foreground">
                Amara Moon Yoga and Private Wellness Retreat, as listed on Google Maps.
              </p>
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
