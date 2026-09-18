'use client'

import { useState } from 'react'
import { CtaLink } from '@/components/cta'
import { appUrl } from '@/lib/deployment'
import { formatGatheringDate } from '@/lib/gatherings'

/**
 * Date picker for a dated gathering (Full Moon Circle, 9D Breathwork).
 *
 * There is no checkout: choosing a date and pressing the button opens the
 * enquiry form pre-filled with the offering and date, and Kirst replies with
 * how to pay. The link goes through `appUrl` so it stays a local, client-side
 * link in the app build, but points at the live app in the static export —
 * where the enquiry form cannot run on shared hosting.
 */
export function GatheringReserve({ slug, dates }: { slug: string; dates: string[] }) {
  const [date, setDate] = useState(dates[0] ?? '')

  if (dates.length === 0) {
    return (
      <p className="font-sans text-sm leading-relaxed text-muted-foreground">
        Dates for the coming season are being confirmed.{' '}
        <CtaLink href="/contact" variant="quiet" size="bare" className="underline">
          Get in touch
        </CtaLink>{' '}
        and we&apos;ll let you know.
      </p>
    )
  }

  const href = appUrl(`/contact?offering=${slug}&date=${date}`)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-2">
        <label
          htmlFor={`date-${slug}`}
          className="label-xs font-sans text-muted-foreground"
        >
          Choose a date
        </label>
        <select
          id={`date-${slug}`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 w-full rounded-none border border-input bg-card px-3 font-sans text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {dates.map((d) => (
            <option key={d} value={d}>
              {formatGatheringDate(d)}
            </option>
          ))}
        </select>
      </div>
      <CtaLink href={href} className="shrink-0">
        Reserve this date
      </CtaLink>
    </div>
  )
}
