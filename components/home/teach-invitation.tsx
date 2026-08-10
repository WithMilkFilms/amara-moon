import { CtaLink } from '@/components/cta'
import { GoldRule } from '@/components/section-heading'
import { TEACH_INVITATION } from '@/lib/home'

/*
 * The one place on the homepage that speaks to teachers rather than guests.
 *
 * Deliberately smaller than the guest-facing sections around it: the heading is
 * set at text-2xl/3xl rather than SectionHeading's 3xl/5xl, so it reads as an
 * aside to the booking journey instead of competing with it. That is also why it
 * uses SectionHeading's parts by hand rather than the component itself.
 *
 * Laid out as a single row on desktop — copy left, CTA right — which keeps it to
 * one band of vertical space near the foot of the page.
 */
export function TeachInvitation() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between md:gap-16">
        <div className="flex flex-col gap-4">
          <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">
            {TEACH_INVITATION.eyebrow}
          </span>

          <h2 className="max-w-2xl font-serif text-2xl leading-[1.3] text-balance text-foreground sm:text-3xl">
            {TEACH_INVITATION.heading}
          </h2>

          <GoldRule className="max-w-24" />

          <p className="max-w-xl font-sans text-base leading-relaxed text-pretty text-muted-foreground">
            {TEACH_INVITATION.paragraph}
          </p>
        </div>

        <CtaLink href="/work-with-us" variant="outline" className="self-start md:self-auto">
          Work with us
        </CtaLink>
      </div>
    </section>
  )
}
