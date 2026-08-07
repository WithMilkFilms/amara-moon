import { CtaLink } from "@/components/cta"
import { SectionHeading } from "@/components/section-heading"
import { OfferingCard } from "@/components/offering-card"
import { OFFERINGS } from "@/lib/offerings"

export function OfferingsPreview() {
  // Show the three headline offerings; the rest live on /offerings
  const featured = OFFERINGS.filter((o) => o.slug !== "sauna-20").slice(0, 3)

  return (
    <section className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Offerings"
            title="Practice, teach, or simply warm up"
            intro="Classes and sessions held in the Oasis Studio, plus the space itself for teachers and facilitators."
          />
          <CtaLink href="/offerings" variant="quiet" size="bare" className="shrink-0 self-start">
            All offerings
          </CtaLink>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((offering) => (
            <li key={offering.slug}>
              <OfferingCard offering={offering} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
