import Image from "next/image"
import { Check } from "lucide-react"
import { CtaLink } from "@/components/cta"
import { PINE_FOREST_CABIN, formatZar } from "@/lib/offerings"

export function StayPreview() {
  return (
    <section className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-14 lg:flex-row-reverse lg:items-center lg:gap-20">
          <div className="flex flex-col gap-7 lg:w-1/2">
            <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">Stay the night</span>
            <h2 className="font-serif text-3xl leading-tight text-balance text-foreground sm:text-4xl md:text-5xl">
              {PINE_FOREST_CABIN.name}
            </h2>
            <p className="font-sans text-base leading-relaxed text-pretty text-muted-foreground">
              {PINE_FOREST_CABIN.summary} Wake up to the valley, walk to the waterfall before breakfast, and be at the beach
              in ten minutes.
            </p>

            <ul className="flex flex-col gap-3">
              {PINE_FOREST_CABIN.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-3">
                  <Check aria-hidden className="size-4 shrink-0 text-primary" />
                  <span className="font-sans text-sm text-muted-foreground">{amenity}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-sans text-sm text-muted-foreground">
                {PINE_FOREST_CABIN.needsPrice ? (
                  "Rates on enquiry"
                ) : (
                  <>
                    <span className="font-serif text-2xl text-foreground">
                      {formatZar(PINE_FOREST_CABIN.pricePerNightInCents)}
                    </span>{" "}
                    per night
                  </>
                )}
              </p>
              <CtaLink href="/book-a-room" size="lg">
                Check availability
              </CtaLink>
            </div>
          </div>

          <div className="relative aspect-3/2 w-full overflow-hidden rounded-sm lg:w-1/2">
            <Image
              src={PINE_FOREST_CABIN.photos[1].src}
              alt={PINE_FOREST_CABIN.photos[1].alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
