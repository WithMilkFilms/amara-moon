import Image from "next/image"
import { IMAGES } from "@/lib/images"
import { SITE } from "@/lib/site"

export function Invitation() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex flex-col gap-8 lg:w-[55%]">
          <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">The invitation</span>

          {/* The pull-quote is the one loud element in this section. The mission
              statement moved up to the hero, so this holds the invitation itself
              — what the visitor is being asked to come and do. */}
          <p className="font-serif text-3xl leading-[1.25] text-balance text-foreground sm:text-4xl md:text-[2.75rem]">
            To relax, feel and explore your body from a place of joy and wonderment.
          </p>

          <div className="flex flex-col gap-5 font-sans text-base leading-relaxed text-pretty text-muted-foreground">
            <p>
              Amara Moon is a family run retreat sanctuary nestled in the heart of Hout Bay,
              one of Cape Town&apos;s most breathtaking coastal valleys. Cradled between
              beautiful ancient mountains, indigenous fynbos and the Atlantic Ocean, it is a
              place where nature invites you to slow down, breathe deeply and reconnect with
              yourself.
            </p>
            <p>
              We are here to support you along the journey of self-discovery and self-mastery.
              Our sanctuary is dedicated to offering a range of yoga classes, movement
              modalities, sauna sessions, therapies and meditative experiences.
            </p>
            <p>
              Come to practise, to teach, to rest, or simply to sit on the deck and watch the light move across the
              valley.
            </p>
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
