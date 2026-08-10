import type { Metadata } from 'next'
import { Mail, Phone } from 'lucide-react'
import { CtaLink } from '@/components/cta'
import { PageHeader } from '@/components/page-header'
import { appUrl } from '@/lib/deployment'
import { IMAGES } from '@/lib/images'
import { SITE } from '@/lib/site'
import { WORK_WITH_US_PAGE } from '@/lib/pages'
import { LOOKING_FOR } from '@/lib/work-with-us'

/**
 * Static-export twin of app/work-with-us/page.app.tsx.
 *
 * Same content, minus WorkWithUsForm — it posts to a server action that shared
 * hosting cannot run. Applicants get email and WhatsApp instead, plus a link to
 * the real form. Header and intro copy now share content/pages.json with the
 * app twin, so the two cannot drift.
 */
export const metadata: Metadata = {
  title: 'Work with Us',
  description:
    'Teach, host a retreat or collaborate at Amara Moon — a family run wellness sanctuary in Hout Bay, Cape Town. Introduce yourself and your practice.',
  alternates: { canonical: '/work-with-us' },
}

export default function WorkWithUsPageStatic() {
  return (
    <>
      <PageHeader
        eyebrow={WORK_WITH_US_PAGE.eyebrow}
        title={WORK_WITH_US_PAGE.title}
        intro={WORK_WITH_US_PAGE.intro}
        image={IMAGES.yoga}
        imageAlt="A yoga class in the studio, light coming through the trees"
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                {WORK_WITH_US_PAGE.introduceHeading}
              </h2>
              <p className="max-w-prose font-sans text-base leading-relaxed text-pretty text-muted-foreground">
                {WORK_WITH_US_PAGE.introduceBody}
              </p>
            </div>

            <div className="flex max-w-md flex-col divide-y divide-border border-y border-border">
              <a href={`${SITE.emailHref}?subject=${encodeURIComponent('Teaching at Amara Moon')}`}
                className="group flex items-baseline justify-between gap-4 py-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex flex-col gap-1">
                  <span className="label-xs font-sans text-primary">Email</span>
                  <span className="font-sans text-base text-foreground transition-colors group-hover:text-primary">
                    {SITE.email}
                  </span>
                </span>
                <span className="font-sans text-xs text-muted-foreground">
                  Best for detail
                </span>
              </a>
              <a href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-4 py-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex flex-col gap-1">
                  <span className="label-xs font-sans text-primary">WhatsApp</span>
                  <span className="font-sans text-base text-foreground transition-colors group-hover:text-primary">
                    {SITE.phone}
                  </span>
                </span>
                <span className="font-sans text-xs text-muted-foreground">
                  Fastest reply
                </span>
              </a>
            </div>

            <div className="flex flex-col gap-4 border-l-2 border-primary pl-5">
              <p className="max-w-prose font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
                There is also a short form on our booking site if you would rather fill
                in your details there.
              </p>
              <CtaLink href={appUrl('/work-with-us')} variant="outline" className="self-start">
                Open the form
              </CtaLink>
            </div>
          </div>

          <aside className="flex flex-col gap-8 lg:border-l lg:border-border lg:pl-12">
            <div className="flex flex-col gap-6">
              <h2 className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                Who we look for
              </h2>
              <ul className="flex flex-col gap-6">
                {LOOKING_FOR.map((item) => (
                  <li key={item.title} className="flex flex-col gap-1.5">
                    <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                    <p className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-8">
              <h2 className="tracking-widest-xs font-sans text-xs uppercase text-primary">
                Rather just talk
              </h2>
              <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed text-muted-foreground">
                <a href={SITE.emailHref}
                  className="flex items-center gap-3 break-all transition-colors hover:text-primary"
                >
                  <Mail aria-hidden className="size-4 shrink-0 text-primary" />
                  {SITE.email}
                </a>
                <a href={SITE.phoneHref}
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Phone aria-hidden className="size-4 shrink-0 text-primary" />
                  {SITE.phone}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
