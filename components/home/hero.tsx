import Image from "next/image"
import { CtaLink } from "@/components/cta"
import { Logo } from "@/components/logo"
import { IMAGES } from "@/lib/images"
import { HERO } from "@/lib/home"
import { SITE } from "@/lib/site"

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden">
      <Image
        src={IMAGES.heroCabin || "/placeholder.svg"}
        alt="The Amara Moon deck at dusk, a fire pit burning beneath festoon lights with the studio glowing beyond in the pines"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/*
        Deliberately light scrim. The photo is a dusk shot that already averages
        only ~30/255 where the type sits, so a heavy ink wash would bury the
        fire, the festoon lights and the sunset. This just grounds the copy at
        the bottom and leaves the highlights readable.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent"
      />
      {/* Short fade so the hero meets the next section cleanly, kept shallow
          enough that it does not reach the fire pit. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
      />

      {/*
        Bottom-anchored so the whole block sits in the lower half of the frame.
        The photo has its own moon at 51% across / 22% down — dead centre
        horizontally — so centring this content collided the gold crescent with
        it. Sitting low keeps the two moons apart and leaves the sunset clear.
      */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 pb-12 pt-28 text-center md:pb-20">
        <Logo priority className="h-32 w-32 md:h-40 md:w-40" />

        <div className="flex flex-col gap-5">
          <h1 className="font-serif text-5xl leading-[0.95] text-balance text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Amara Moon
          </h1>
          <p className="tracking-widest-xs font-sans text-xs uppercase text-primary sm:text-sm">
            {SITE.tagline} &middot; {SITE.location}
          </p>
        </div>

        <p className="max-w-xl font-sans text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
          {HERO.subtitle}
        </p>

        <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
          <CtaLink href="/schedule" size="lg">
            Book a session
          </CtaLink>
          <CtaLink href="/book-a-room" variant="outline" size="lg">
            Stay with us
          </CtaLink>
        </div>
      </div>
    </section>
  )
}
