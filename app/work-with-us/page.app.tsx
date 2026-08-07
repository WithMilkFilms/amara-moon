import type { Metadata } from 'next'
import { Mail, Phone } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { WorkWithUsForm } from '@/components/work-with-us-form'
import { IMAGES } from '@/lib/images'
import { SITE } from '@/lib/site'
import { LOOKING_FOR } from '@/lib/work-with-us'

export const metadata: Metadata = {
  title: 'Work with Us',
  description:
    'Teach, host a retreat or collaborate at Amara Moon — a family run wellness sanctuary in Hout Bay, Cape Town. Introduce yourself and your practice.',
  alternates: { canonical: '/work-with-us' },
}

export default function WorkWithUsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work with Us"
        title="Share your practice in the valley"
        intro="We are inviting experienced teachers to join our growing community. Amara Moon is small and family run, and the people who teach here shape what it becomes."
        image={IMAGES.yoga}
        imageAlt="A yoga class in the studio, light coming through the trees"
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                Introduce yourself
              </h2>
              <p className="max-w-prose font-sans text-base leading-relaxed text-pretty text-muted-foreground">
                Tell us what you do and what you have in mind. There is no application
                window and no form letter at the end of it — we read these ourselves and
                reply properly.
              </p>
            </div>

            <WorkWithUsForm />
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
                <a
                  href={SITE.emailHref}
                  className="flex items-center gap-3 break-all transition-colors hover:text-primary"
                >
                  <Mail aria-hidden className="size-4 shrink-0 text-primary" />
                  {SITE.email}
                </a>
                <a
                  href={SITE.phoneHref}
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
