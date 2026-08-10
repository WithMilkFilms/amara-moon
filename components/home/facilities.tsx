import { Flame, Trees, Waves } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { FACILITIES_HEADING, FACILITY_GROUPS } from '@/lib/facilities'

/*
 * Only three icons, one per group rather than one per item. Eleven icons in a
 * row would read as decoration; three read as structure.
 */
const ICONS = {
  trees: Trees,
  waves: Waves,
  flame: Flame,
} as const

export function Facilities() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow={FACILITIES_HEADING.eyebrow}
          title={FACILITIES_HEADING.title}
          intro={FACILITIES_HEADING.intro}
        />

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {FACILITY_GROUPS.map((group) => {
            const Icon = ICONS[group.icon]

            return (
              <div key={group.title} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Icon aria-hidden className="size-5 shrink-0 text-primary" />
                  <h3 className="font-serif text-xl text-foreground">{group.title}</h3>
                </div>

                <ul className="flex flex-col gap-3 border-t border-border pt-5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-sans text-sm leading-relaxed text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
