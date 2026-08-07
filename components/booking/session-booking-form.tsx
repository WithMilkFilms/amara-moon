'use client'

import { useMemo, useState, useTransition } from 'react'

import { createSessionCheckout } from '@/app/actions/bookings'
import { CheckoutPanel } from '@/components/booking/checkout-panel'
import { EftPanel } from '@/components/booking/eft-panel'
import { PaymentMethodChoice } from '@/components/booking/payment-method-choice'
import { CtaButton } from '@/components/cta'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { todayInCapeTown } from '@/lib/booking'
import { type Offering, formatZar } from '@/lib/offerings'
import type { PaymentMethod } from '@/lib/payment'
import { DAYS, SCHEDULE, SESSION_SLOTS, formatTime } from '@/lib/schedule'

const fieldClass =
  'rounded-none border-input bg-card font-sans text-foreground placeholder:text-muted-foreground/60'

/** Weekday name for a `YYYY-MM-DD` date, matching the `DAYS` labels. */
function weekdayOf(date: string) {
  // getUTCDay() is 0=Sunday, but DAYS starts on Monday.
  const index = new Date(`${date}T00:00:00Z`).getUTCDay()
  return DAYS[(index + 6) % 7]
}

export function SessionBookingForm({ offering }: { offering: Offering }) {
  const today = todayInCapeTown()

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('card')

  const [error, setError] = useState<string | null>(null)
  const [checkout, setCheckout] = useState<
    | { method: 'card'; clientSecret: string; reference: string }
    | { method: 'eft'; reference: string }
    | null
  >(null)
  const [pending, startTransition] = useTransition()

  // Classes only run at their timetabled times, so the time list depends on
  // which weekday was picked. Sauna and studio hire use the open slot list.
  const isTimetabled = useMemo(
    () => SCHEDULE.some((s) => s.offeringSlug === offering.slug),
    [offering.slug],
  )

  const times = useMemo(() => {
    if (!isTimetabled) return [...SESSION_SLOTS]
    if (!date) return []
    const day = weekdayOf(date)
    return SCHEDULE.filter((s) => s.offeringSlug === offering.slug && s.day === day)
      .map((s) => s.time)
      .sort((a, b) => a.localeCompare(b))
  }, [date, isTimetabled, offering.slug])

  const total = offering.priceInCents * quantity

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createSessionCheckout({
        slug: offering.slug,
        date,
        time,
        quantity,
        name,
        email,
        phone,
        notes,
        payment,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setCheckout(
        result.method === 'card'
          ? {
              method: 'card',
              clientSecret: result.clientSecret,
              reference: result.reference,
            }
          : { method: 'eft', reference: result.reference },
      )
    })
  }

  if (checkout) {
    return checkout.method === 'card' ? (
      <CheckoutPanel
        clientSecret={checkout.clientSecret}
        reference={checkout.reference}
      />
    ) : (
      <EftPanel reference={checkout.reference} amountCents={total} />
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date" className="label-xs font-sans text-muted-foreground">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            required
            min={today}
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              // The old time may not exist on the new weekday.
              setTime('')
            }}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="time" className="label-xs font-sans text-muted-foreground">
            Time
          </Label>
          <select
            id="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={times.length === 0}
            className="h-9 w-full rounded-none border border-input bg-card px-3 font-sans text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <option value="">
              {!date && isTimetabled
                ? 'Choose a date first'
                : times.length === 0
                  ? 'Nothing runs on that day'
                  : 'Select a time'}
            </option>
            {times.map((t) => (
              <option key={t} value={t}>
                {formatTime(t)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quantity" className="label-xs font-sans text-muted-foreground">
            {offering.kind === 'studio_hire' ? 'Hours' : 'Places'}
          </Label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="h-9 w-full rounded-none border border-input bg-card px-3 font-sans text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {Array.from({ length: offering.maxQuantity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sessionName" className="label-xs font-sans text-muted-foreground">
            Your name
          </Label>
          <Input
            id="sessionName"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sessionEmail" className="label-xs font-sans text-muted-foreground">
            Email
          </Label>
          <Input
            id="sessionEmail"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sessionPhone" className="label-xs font-sans text-muted-foreground">
            Phone <span className="normal-case tracking-normal">(optional)</span>
          </Label>
          <Input
            id="sessionPhone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sessionNotes" className="label-xs font-sans text-muted-foreground">
          Anything we should know?{' '}
          <span className="normal-case tracking-normal">(optional)</span>
        </Label>
        <Textarea
          id="sessionNotes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={fieldClass}
        />
      </div>

      <dl className="flex flex-col gap-2 border-y border-border py-5 font-sans text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">
            {formatZar(offering.priceInCents)} {offering.unit}
            {quantity > 1 ? ` × ${quantity}` : ''}
          </dt>
          <dd className="text-foreground">{offering.durationMinutes} min</dd>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-3">
          <dt className="font-serif text-lg text-foreground">Total</dt>
          <dd className="font-serif text-lg text-primary">{formatZar(total)}</dd>
        </div>
      </dl>

      <PaymentMethodChoice value={payment} onChange={setPayment} disabled={pending} />

      {error ? (
        <p role="alert" className="font-sans text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <CtaButton
        type="submit"
        size="lg"
        disabled={pending || !date || !time}
        className="self-start"
      >
        {pending
          ? 'Just a moment…'
          : payment === 'eft'
            ? 'Reserve and show bank details'
            : 'Continue to payment'}
      </CtaButton>
    </form>
  )
}
