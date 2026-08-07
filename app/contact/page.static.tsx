import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { CtaLink } from '@/components/cta'
import { PageHeader } from '@/components/page-header'
import { appUrl } from '@/lib/deployment'
import { IMAGES } from '@/lib/images'
import { SITE } from '@/lib/site'

/**
 * Static-export twin of app/contact/page.app.tsx.
 *
 * Identical apart from the middle column: the real page renders ContactForm,
 * which posts to a server action that shared hosting cannot run. A form that
 * silently swallows enquiries is worse than no form, so this offers WhatsApp,
 * email and phone — which reach a phone in a valley faster anyway — plus a link
 * to the full form on the live app.
 *
 * Keep the aside in sync with the .app.tsx version when either changes.
 */
export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Amara Moon in Hout Bay, Cape Town — classes, studio hire, sauna and overnight stays.',
  alternates: { canonical: '/contact' },
}

export default function ContactPageStatic() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Say hello"
        intro="Questions about a class, hiring the studio, or staying the night? Reach us however suits you — we answer messages ourselves."
        image={IMAGES.deckValley}
        imageAlt="The deck looking over the valley at dusk"
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                Get in touch
              </h2>
              <p className="max-w-prose font-sans text-base leading-relaxed text-pretty text-muted-foreground">
                WhatsApp is usually quickest. For anything longer — retreat plans,
                group bookings, studio hire — email gives us room to answer properly.
              </p>
            </div>

            <ul className="flex max-w-md flex-col divide-y divide-border border-y border-border">
              {[
                {
                  label: 'WhatsApp',
                  value: SITE.phone,
                  href: SITE.whatsappHref,
                  note: 'Fastest reply',
                  external: true,
                },
                {
                  label: 'Email',
                  value: SITE.email,
                  href: SITE.emailHref,
                  note: 'Best for detail',
                  external: false,
                },
                {
                  label: 'Phone',
                  value: SITE.phone,
                  href: SITE.phoneHref,
                  note: 'Daytime hours',
                  external: false,
                },
              ].map((row) => (
                <li key={row.label}>
                  <a
                    href={row.href}
                    {...(row.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group flex items-baseline justify-between gap-4 py-5 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="label-xs font-sans text-primary">{row.label}</span>
                      <span className="font-sans text-base text-foreground transition-colors group-hover:text-primary">
                        {row.value}
                      </span>
                    </span>
                    <span className="font-sans text-xs text-muted-foreground">
                      {row.note}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 border-l-2 border-primary pl-5">
              <p className="max-w-prose font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
                Prefer to write it all down in one go? The full enquiry form lives on
                our booking site.
              </p>
              <CtaLink href={appUrl('/contact')} variant="outline" className="self-start">
                Open the enquiry form
              </CtaLink>
            </div>
          </div>

          <aside className="flex flex-col gap-8 lg:border-l lg:border-border lg:pl-12">
            <div className="flex flex-col gap-4">
              <h2 className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                Find us
              </h2>
              <address className="flex flex-col gap-4 font-sans text-sm not-italic leading-relaxed text-muted-foreground">
                <a
                  href={SITE.mapsUrl}
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
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Phone aria-hidden className="size-4 shrink-0 text-primary" />
                  {SITE.phone}
                </a>
                <a
                  href={SITE.emailHref}
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
                Ten minutes from Hout Bay village, at the foot of the Orangekloof valley.
                There is parking on site, and private access to the mountain trails.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                Follow
              </h2>
              <div className="flex flex-col gap-2">
                <a
                  href={SITE.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Instagram &middot; {SITE.socials.instagramHandle}
                </a>
                <a
                  href={SITE.socials.facebook}
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
