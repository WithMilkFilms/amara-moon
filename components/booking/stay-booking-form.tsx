'use client'

import { useMemo, useState, useTransition } from 'react'

import { createStayCheckout } from '@/app/actions/bookings'
import { CheckoutPanel } from '@/components/booking/checkout-panel'
import { EftPanel } from '@/components/booking/eft-panel'
import { PaymentMethodChoice } from '@/components/booking/payment-method-choice'
import { CtaButton } from '@/components/cta'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { countNights, formatLongDate, todayInCapeTown } from '@/lib/booking'
import { PINE_FOREST_CABIN, formatZar } from '@/lib/offerings'
import type { PaymentMethod } from '@/lib/payment'

const fieldClass =
  'rounded-none border-input bg-card font-sans text-foreground placeholder:text-muted-foreground/60'

export function StayBookingForm() {
  const today = todayInCapeTown()

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
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

  // Shown live so the guest always knows the total before paying. The server
  // recomputes this independently — this copy is display only.
  const nights = useMemo(
    () => (checkIn && checkOut ? countNights(checkIn, checkOut) : 0),
    [checkIn, checkOut],
  )
  const total = nights * PINE_FOREST_CABIN.pricePerNightInCents

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createStayCheckout({
        checkIn,
        checkOut,
        guests,
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
          <Label htmlFor="checkIn" className="label-xs font-sans text-muted-foreground">
            Check in
          </Label>
          <Input
            id="checkIn"
            type="date"
            required
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="checkOut" className="label-xs font-sans text-muted-foreground">
            Check out
          </Label>
          <Input
            id="checkOut"
            type="date"
            required
            // Check-out must be at least the day after check-in.
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="guests" className="label-xs font-sans text-muted-foreground">
            Guests
          </Label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="h-9 w-full rounded-none border border-input bg-card px-3 font-sans text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {Array.from({ length: PINE_FOREST_CABIN.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stayName" className="label-xs font-sans text-muted-foreground">
            Your name
          </Label>
          <Input
            id="stayName"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stayEmail" className="label-xs font-sans text-muted-foreground">
            Email
          </Label>
          <Input
            id="stayEmail"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stayPhone" className="label-xs font-sans text-muted-foreground">
            Phone <span className="normal-case tracking-normal">(optional)</span>
          </Label>
          <Input
            id="stayPhone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="stayNotes" className="label-xs font-sans text-muted-foreground">
          Anything we should know?{' '}
          <span className="normal-case tracking-normal">(optional)</span>
        </Label>
        <Textarea
          id="stayNotes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={fieldClass}
        />
      </div>

      <dl className="flex flex-col gap-2 border-y border-border py-5 font-sans text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Per night</dt>
          <dd className="text-foreground">
            {formatZar(PINE_FOREST_CABIN.pricePerNightInCents)}
          </dd>
        </div>
        {nights > 0 ? (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">
                {formatLongDate(checkIn)} → {formatLongDate(checkOut)}
              </dt>
              <dd className="text-foreground">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </dd>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-3">
              <dt className="font-serif text-lg text-foreground">Total</dt>
              <dd className="font-serif text-lg text-primary">{formatZar(total)}</dd>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">Choose your dates to see the total.</p>
        )}
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
        disabled={pending || nights === 0}
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
