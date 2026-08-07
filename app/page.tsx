import type { Metadata } from 'next'
import { Facilities } from "@/components/home/facilities"
import { Hero } from "@/components/home/hero"
import { Invitation } from "@/components/home/invitation"
import { Legend } from "@/components/home/legend"
import { OfferingsPreview } from "@/components/home/offerings-preview"
import { ScheduleTeaser } from "@/components/home/schedule-teaser"
import { StayPreview } from "@/components/home/stay-preview"
import { TeachInvitation } from "@/components/home/teach-invitation"

/*
 * Title and description are inherited from the root layout, whose defaults are
 * written for the homepage. Only the canonical is declared here, because the
 * layout deliberately sets none — see the note there.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      {/*
        Order is deliberate: feeling, then facts, then action, then a closing
        note. Facilities sits straight after the Invitation so a scannable grid
        breaks up the prose before the booking sections begin, and Legend closes
        the page because it is atmosphere rather than a call to action.

        TeachInvitation is the last thing before Legend: it addresses teachers
        rather than guests, so it waits until the guest-facing sections have all
        had their turn.
      */}
      <Hero />
      <Invitation />
      <Facilities />
      <OfferingsPreview />
      <ScheduleTeaser />
      <StayPreview />
      <TeachInvitation />
      <Legend />
    </>
  )
}
