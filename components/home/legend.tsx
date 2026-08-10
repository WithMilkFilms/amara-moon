import { GoldRule } from '@/components/section-heading'
import { LEGEND } from '@/lib/home'

/*
 * The closing beat of the page, kept deliberately quiet: centred type, a lot of
 * air, no image and no CTA. The hero and the Invitation pull-quote are already
 * the loud moments, so this earns its place by being still.
 *
 * Sits on the plain background rather than bg-card/40. TeachInvitation directly
 * above is also plain, and the pair reads as intended: a tint here would make
 * this closing note look like another band of content to act on.
 */
export function Legend() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center md:py-32">
        <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">
          {LEGEND.eyebrow}
        </span>

        <p className="font-sans text-base leading-relaxed text-pretty text-muted-foreground">
          {LEGEND.paragraph}
        </p>

        <GoldRule className="max-w-24" />

        {/*
          The trees-as-yogis image is the most distinctive line in the whole
          brief, so it is set in serif at display size rather than buried as the
          tail of a paragraph.
        */}
        <p className="font-serif text-2xl leading-[1.35] text-balance text-foreground sm:text-3xl">
          {LEGEND.closingQuote}
        </p>
      </div>
    </section>
  )
}
