import Link from "next/link"
import { CtaLink } from "@/components/cta"
import { SectionHeading } from "@/components/section-heading"
import { PROGRAMME } from "@/lib/schedule"

/**
 * What runs here, as a taste of the programme.
 *
 * Shows practices rather than timetable rows: there are no confirmed days or
 * times yet (see lib/schedule.ts), and inventing five of them to fill this
 * section is how a placeholder ends up being treated as a promise.
 */
export function ScheduleTeaser() {
  const preview = PROGRAMME.slice(0, 5)

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="What runs here"
          title="Practices through the week"
          intro="Yoga, breathwork, movement, beach yoga and trail hikes. Days and times for the coming season are being confirmed."
        />
        <CtaLink href="/schedule" variant="quiet" size="bare" className="shrink-0 self-start">
          See the programme
        </CtaLink>
      </div>

      <ul className="mt-12 flex flex-col">
        {preview.map((item) => (
          <li key={item.title} className="border-t border-border last:border-b">
            {/* Only items with an offering page are links; the rest are plain rows. */}
            {item.offeringSlug ? (
              <Link
                href={`/offerings/${item.offeringSlug}`}
                className="group flex flex-col gap-2 py-6 transition-colors hover:bg-card/60 sm:grid sm:grid-cols-12 sm:items-baseline sm:gap-4"
              >
                <span className="font-serif text-lg text-foreground transition-colors group-hover:text-primary sm:col-span-4 md:text-xl">
                  {item.title}
                </span>
                <span className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground sm:col-span-8">
                  {item.blurb}
                </span>
              </Link>
            ) : (
              <div className="flex flex-col gap-2 py-6 sm:grid sm:grid-cols-12 sm:items-baseline sm:gap-4">
                <span className="font-serif text-lg text-foreground sm:col-span-4 md:text-xl">
                  {item.title}
                </span>
                <span className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground sm:col-span-8">
                  {item.blurb}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
