import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { formatZar, type Offering } from "@/lib/offerings"

export function OfferingCard({ offering }: { offering: Offering }) {
  return (
    <Link
      href={`/offerings/${offering.slug}`}
      className="group flex flex-col gap-5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-muted">
        <Image
          src={offering.image || "/placeholder.svg"}
          alt={offering.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl leading-snug text-balance text-foreground md:text-2xl">{offering.name}</h3>
          <ArrowUpRight
            aria-hidden
            className="mt-1 size-5 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>

        <p className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground">{offering.summary}</p>

        <p className="tracking-widest-xs font-sans text-[0.7rem] uppercase text-primary">
          {offering.needsPrice ? "Price on enquiry" : `${formatZar(offering.priceInCents)} ${offering.unit}`}
        </p>
      </div>
    </Link>
  )
}
