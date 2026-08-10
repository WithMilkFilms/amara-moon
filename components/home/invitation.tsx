import Image from "next/image"
import { IMAGES } from "@/lib/images"
import { INVITATION } from "@/lib/home"
import { SITE } from "@/lib/site"

export function Invitation() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex flex-col gap-8 lg:w-[55%]">
          <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">{INVITATION.eyebrow}</span>

          {/* The pull-quote is the one loud element in this section. The mission
              statement moved up to the hero, so this holds the invitation itself
              — what the visitor is being asked to come and do. */}
          <p className="font-serif text-3xl leading-[1.25] text-balance text-foreground sm:text-4xl md:text-[2.75rem]">
            {INVITATION.quote}
          </p>

          <div className="flex flex-col gap-5 font-sans text-base leading-relaxed text-pretty text-muted-foreground">
            {INVITATION.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-2 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:gap-10">
            <div className="flex flex-col gap-1">
              <dt className="tracking-widest-xs font-sans text-[0.7rem] uppercase text-primary">The sea</dt>
              <dd className="font-sans text-sm leading-relaxed text-muted-foreground">{SITE.proximity.beach}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="tracking-widest-xs font-sans text-[0.7rem] uppercase text-primary">The mountain</dt>
              <dd className="font-sans text-sm leading-relaxed text-muted-foreground">{SITE.proximity.trails}</dd>
            </div>
          </dl>
        </div>

        <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm lg:w-[45%]">
          <Image
            src={IMAGES.valleyTrail || "/placeholder.svg"}
            alt="Sunset light on the forest trail beside the stream, climbing towards Myburghs waterfall ravine"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
