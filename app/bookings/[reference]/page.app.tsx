import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { Check, Clock } from 'lucide-react'

import { confirmBooking } from '@/app/actions/bookings'
import { CtaLink } from '@/components/cta'
import { formatLongDate } from '@/lib/booking'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { PINE_FOREST_CABIN, formatZar, getOffering } from '@/lib/offerings'
import { AWAITING_EFT, BANK_DETAIL_ROWS, EFT_HOLD_HOURS } from '@/lib/payment'
import { formatTime } from '@/lib/schedule'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Your booking',
  robots: { index: false, follow: false },
}

// A booking's status changes as payment settles, so this must never be cached.
export const dynamic = 'force-dynamic'

export default async function BookingPage({
  params,
}: {
  params: Promise<{ reference: string }>
}) {
  const { reference } = await params

  let [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.reference, reference))
    .limit(1)

  if (!booking) notFound()

  // If the guest lands here before the completion callback ran (a refresh, or
  // a closed tab), settle the status against Stripe now.
  if (booking.status === 'pending') {
    await confirmBooking(reference)
    ;[booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.reference, reference))
      .limit(1)
  }

  const isConfirmed = booking.status === 'confirmed'
  // An EFT booking is legitimately unpaid — it is waiting on a bank transfer,
  // not a failed card. It gets its own copy so nobody is told their booking
  // failed when they are about to pay, or already have.
  const isAwaitingEft = booking.status === AWAITING_EFT
  const name =
    booking.kind === 'stay'
      ? PINE_FOREST_CABIN.name
      : (getOffering(booking.offeringSlug)?.name ?? booking.offeringSlug)

  return (
    // pt clears the fixed 80px site header, which overlays page content.
    <section className="mx-auto flex max-w-2xl flex-col gap-8 px-6 pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="flex flex-col gap-5">
        <span
          className={`inline-flex size-11 items-center justify-center rounded-full ${
            isConfirmed ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {isConfirmed ? (
            <Check aria-hidden className="size-5" />
          ) : (
            <Clock aria-hidden className="size-5" />
          )}
        </span>

        <h1 className="font-serif text-4xl leading-tight text-balance text-foreground md:text-5xl">
          {/* A real apostrophe — HTML entities are not decoded inside a JS string. */}
          {isConfirmed
            ? 'You\u2019re booked.'
            : isAwaitingEft
              ? 'Held for your transfer'
              : 'Payment not completed'}
        </h1>

        <p className="font-sans text-base leading-relaxed text-pretty text-muted-foreground">
          {isConfirmed ? (
            <>
              We&apos;ve sent a confirmation to{' '}
              <span className="text-foreground">{booking.guestEmail}</span>. Keep
              your reference handy — quote it if you need to change anything.
            </>
          ) : isAwaitingEft ? (
            <>
              This booking is held for {EFT_HOLD_HOURS} hours while we wait for your
              bank transfer. Use{' '}
              <span className="text-foreground">{booking.reference}</span> as the
              payment reference and we&apos;ll confirm by email as soon as it
              reflects.
            </>
          ) : (
            <>
              We&apos;re holding this booking but haven&apos;t received payment yet.
              If you closed the payment window early, start again or get in touch
              and we&apos;ll sort it out.
            </>
          )}
        </p>
      </div>

      <dl className="flex flex-col divide-y divide-border border-y border-border font-sans text-sm">
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-muted-foreground">Reference</dt>
          <dd className="tracking-widest-xs text-foreground">{booking.reference}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-muted-foreground">
            {booking.kind === 'stay' ? 'Stay' : 'Session'}
          </dt>
          <dd className="text-right text-foreground">{name}</dd>
        </div>

        {booking.kind === 'stay' ? (
          <>
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Check in</dt>
              <dd className="text-right text-foreground">
                {formatLongDate(booking.startDate)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Check out</dt>
              <dd className="text-right text-foreground">
                {booking.endDate ? formatLongDate(booking.endDate) : '—'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Guests</dt>
              <dd className="text-foreground">{booking.guests}</dd>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">When</dt>
              <dd className="text-right text-foreground">
                {formatLongDate(booking.startDate)}
                {booking.startTime ? ` at ${formatTime(booking.startTime)}` : ''}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Places</dt>
              <dd className="text-foreground">{booking.quantity}</dd>
            </div>
          </>
        )}

        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="font-serif text-lg text-foreground">
            {isConfirmed ? 'Paid' : isAwaitingEft ? 'To transfer' : 'Total'}
          </dt>
          <dd className="font-serif text-lg text-primary">
            {formatZar(booking.amountCents)}
          </dd>
        </div>
      </dl>

      {isAwaitingEft ? (
        <div className="flex flex-col gap-4 border border-primary/40 bg-primary/5 p-6">
          <h2 className="font-serif text-xl text-foreground">Bank details</h2>
          <dl className="flex flex-col divide-y divide-border">
            {BANK_DETAIL_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <dt className="label-xs font-sans text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="font-sans text-sm tabular-nums text-foreground">
                  {row.value}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="label-xs font-sans text-muted-foreground">Reference</dt>
              <dd className="tracking-widest-xs font-sans text-sm text-primary">
                {booking.reference}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 border border-border bg-card p-6">
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          Finding us: {SITE.address.line1}, {SITE.address.line2},{' '}
          {SITE.address.city}. Any questions, call{' '}
          <a href={SITE.phoneHref} className="text-foreground hover:text-primary">
            {SITE.phone}
          </a>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <CtaLink href="/" variant="outline">
          Back to the site
        </CtaLink>
        {isConfirmed ? null : (
          <CtaLink href="/contact">Get in touch</CtaLink>
        )}
      </div>
    </section>
  )
}
