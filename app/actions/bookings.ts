'use server'

import { and, eq, gt, lt, or } from 'drizzle-orm'
import type Stripe from 'stripe'

import {
  countNights,
  isValidDateString,
  isValidEmail,
  makeReference,
  normaliseGuests,
  normaliseQuantity,
  todayInCapeTown,
} from '@/lib/booking'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { CURRENCY, PINE_FOREST_CABIN, getOffering } from '@/lib/offerings'
import { AWAITING_EFT, EFT_HOLD_HOURS, type PaymentMethod } from '@/lib/payment'
import { getStripe } from '@/lib/stripe'

/**
 * Booking actions for both flows. Two rules hold everywhere in this file:
 *
 *  1. The amount is ALWAYS recomputed here from `lib/offerings.ts`. The client
 *     never sends a price, so a tampered form cannot change what is charged.
 *  2. An offering with `needsPrice: true` has a placeholder price and is
 *     refused, so nothing can be charged at a guessed amount.
 */

/**
 * How long an unpaid booking holds its slot.
 *
 * A `pending` row is created before Stripe checkout opens, so if we treated
 * every pending row as permanently blocking, one abandoned checkout would take
 * a slot off sale forever. Instead a pending row only holds the slot while the
 * guest is plausibly still paying; after that the slot frees itself up.
 */
const HOLD_MINUTES = 30

function holdCutoff() {
  return new Date(Date.now() - HOLD_MINUTES * 60 * 1000)
}

/** The equivalent cutoff for EFT bookings, which get days rather than minutes. */
function eftHoldCutoff() {
  return new Date(Date.now() - EFT_HOLD_HOURS * 60 * 60 * 1000)
}

/**
 * When the Stripe session should stop accepting payment, as a unix timestamp.
 * Kept in step with the slot hold so a tab left open cannot pay for a slot
 * that has since been released. (Stripe's own minimum here is 30 minutes.)
 */
function sessionExpiresAt() {
  return Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60
}

/**
 * Matches bookings that should block a slot: anything confirmed, plus unpaid
 * rows still inside their hold window. EFT rows are included so a guest who
 * chose bank transfer genuinely has the slot reserved while they pay — the
 * whole point of taking their details up front.
 */
function blocksSlot() {
  return or(
    eq(bookings.status, 'confirmed'),
    and(eq(bookings.status, 'pending'), gt(bookings.createdAt, holdCutoff())),
    and(eq(bookings.status, AWAITING_EFT), gt(bookings.createdAt, eftHoldCutoff())),
  )
}

export type CheckoutResult =
  /** Card: hand the client a Stripe client secret to mount embedded checkout. */
  | { ok: true; method: 'card'; clientSecret: string; reference: string }
  /** EFT: nothing to mount — the client shows bank details and the reference. */
  | { ok: true; method: 'eft'; reference: string }
  | { ok: false; error: string }

/**
 * Opens Stripe checkout for a booking row that has already been written.
 *
 * Stripe failing here is the awkward case: the `pending` row already exists, so
 * doing nothing would hold the slot for the full hold window on a booking that
 * never got the chance to be paid. So on failure we release the row and hand
 * the guest a message instead of letting the action reject silently.
 */
async function openCheckout(
  reference: string,
  params: Stripe.Checkout.SessionCreateParams,
  idempotencyKey: string,
): Promise<CheckoutResult> {
  try {
    const session = await getStripe().checkout.sessions.create(params, { idempotencyKey })
    if (!session.client_secret) throw new Error('Stripe returned no client secret')

    await db
      .update(bookings)
      .set({ stripeSessionId: session.id })
      .where(eq(bookings.reference, reference))

    return { ok: true, method: 'card', clientSecret: session.client_secret, reference }
  } catch (error) {
    console.error('Stripe checkout creation failed:', error)
    await db
      .update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.reference, reference))
    return { ok: false, error: 'Could not start checkout. Please try again.' }
  }
}

interface GuestInput {
  name: string
  email: string
  phone?: string
  notes?: string
}

function validateGuest(guest: GuestInput): string | null {
  if (!guest.name.trim()) return 'Please give us your name.'
  if (!isValidEmail(guest.email.trim())) return 'Please enter a valid email address.'
  return null
}

/** Overnight stays in the Pine Forest Cabin. */
export async function createStayCheckout(input: {
  checkIn: string
  checkOut: string
  guests: number
  name: string
  email: string
  phone?: string
  notes?: string
  payment?: PaymentMethod
}): Promise<CheckoutResult> {
  const guestError = validateGuest(input)
  if (guestError) return { ok: false, error: guestError }

  if (!isValidDateString(input.checkIn) || !isValidDateString(input.checkOut)) {
    return { ok: false, error: 'Please choose both dates.' }
  }
  if (input.checkIn < todayInCapeTown()) {
    return { ok: false, error: 'Check-in cannot be in the past.' }
  }

  const nights = countNights(input.checkIn, input.checkOut)
  if (nights < PINE_FOREST_CABIN.minNights) {
    return { ok: false, error: 'Check-out must be after check-in.' }
  }
  if (nights > PINE_FOREST_CABIN.maxNights) {
    return {
      ok: false,
      error: `We can take up to ${PINE_FOREST_CABIN.maxNights} nights online — please get in touch for longer stays.`,
    }
  }

  const guests = normaliseGuests(input.guests)
  if (guests === 0) {
    return {
      ok: false,
      error: `The ${PINE_FOREST_CABIN.name} sleeps up to ${PINE_FOREST_CABIN.maxGuests} guests.`,
    }
  }

  if (PINE_FOREST_CABIN.needsPrice) {
    return {
      ok: false,
      error: 'Online payment for stays is not switched on yet — please send an enquiry.',
    }
  }

  // Two stays clash when each starts before the other ends.
  const clashes = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(
      and(
        eq(bookings.offeringSlug, PINE_FOREST_CABIN.slug),
        blocksSlot(),
        lt(bookings.startDate, input.checkOut),
        gt(bookings.endDate, input.checkIn),
      ),
    )
    .limit(1)

  if (clashes.length > 0) {
    return { ok: false, error: 'Those dates are already taken. Please try others.' }
  }

  // Recomputed server-side from the catalogue — never from the client.
  const amountCents = PINE_FOREST_CABIN.pricePerNightInCents * nights
  const reference = makeReference()
  const payByEft = input.payment === 'eft'

  await db.insert(bookings).values({
    reference,
    kind: 'stay',
    offeringSlug: PINE_FOREST_CABIN.slug,
    guestName: input.name.trim(),
    guestEmail: input.email.trim(),
    guestPhone: input.phone?.trim() || null,
    startDate: input.checkIn,
    endDate: input.checkOut,
    quantity: nights,
    guests,
    amountCents,
    currency: CURRENCY,
    status: payByEft ? AWAITING_EFT : 'pending',
    notes: input.notes?.trim() || null,
  })

  // EFT stops here: the row holds the dates and the guest gets the reference to
  // use as their payment reference. Nothing is charged automatically.
  if (payByEft) return { ok: true, method: 'eft', reference }

  return openCheckout(
    reference,
    {
      ui_mode: 'embedded_page',
      redirect_on_completion: 'never',
      mode: 'payment',
      customer_email: input.email.trim(),
      client_reference_id: reference,
      metadata: { reference },
      expires_at: sessionExpiresAt(),
      line_items: [
        {
          quantity: nights,
          price_data: {
            currency: CURRENCY,
            unit_amount: PINE_FOREST_CABIN.pricePerNightInCents,
            product_data: {
              name: `${PINE_FOREST_CABIN.name} — ${nights} night${nights > 1 ? 's' : ''}`,
              description: `${input.checkIn} to ${input.checkOut} · ${guests} guest${guests > 1 ? 's' : ''}`,
            },
          },
        },
      ],
    },
    // Ties the Stripe session to this booking row, so a retried submit cannot
    // create a second charge.
    `stay-${reference}`,
  )
}

/** Classes, breathwork, sauna and studio hire. */
export async function createSessionCheckout(input: {
  slug: string
  date: string
  time: string
  quantity: number
  name: string
  email: string
  phone?: string
  notes?: string
  payment?: PaymentMethod
}): Promise<CheckoutResult> {
  const guestError = validateGuest(input)
  if (guestError) return { ok: false, error: guestError }

  const offering = getOffering(input.slug)
  if (!offering) return { ok: false, error: 'Unknown offering.' }

  if (!isValidDateString(input.date)) {
    return { ok: false, error: 'Please choose a date.' }
  }
  if (input.date < todayInCapeTown()) {
    return { ok: false, error: 'That date has already passed.' }
  }
  if (!/^\d{2}:\d{2}$/.test(input.time)) {
    return { ok: false, error: 'Please choose a time.' }
  }

  const quantity = normaliseQuantity(input.quantity, offering)
  if (quantity === 0) {
    return {
      ok: false,
      error: `Please choose between 1 and ${offering.maxQuantity}.`,
    }
  }

  if (offering.needsPrice) {
    return {
      ok: false,
      error: 'This offering is priced on enquiry — please send us a message.',
    }
  }

  // The space holds one booking per slot.
  const taken = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(
      and(
        eq(bookings.offeringSlug, offering.slug),
        eq(bookings.startDate, input.date),
        eq(bookings.startTime, input.time),
        blocksSlot(),
      ),
    )
    .limit(1)

  if (taken.length > 0) {
    return { ok: false, error: 'That slot has just been taken. Please pick another.' }
  }

  const amountCents = offering.priceInCents * quantity
  const reference = makeReference()
  const payByEft = input.payment === 'eft'

  await db.insert(bookings).values({
    reference,
    kind: 'session',
    offeringSlug: offering.slug,
    guestName: input.name.trim(),
    guestEmail: input.email.trim(),
    guestPhone: input.phone?.trim() || null,
    startDate: input.date,
    startTime: input.time,
    durationMinutes: offering.durationMinutes,
    quantity,
    guests: quantity,
    amountCents,
    currency: CURRENCY,
    status: payByEft ? AWAITING_EFT : 'pending',
    notes: input.notes?.trim() || null,
  })

  if (payByEft) return { ok: true, method: 'eft', reference }

  return openCheckout(
    reference,
    {
      ui_mode: 'embedded_page',
      redirect_on_completion: 'never',
      mode: 'payment',
      customer_email: input.email.trim(),
      client_reference_id: reference,
      metadata: { reference },
      expires_at: sessionExpiresAt(),
      line_items: [
        {
          quantity,
          price_data: {
            currency: CURRENCY,
            unit_amount: offering.priceInCents,
            product_data: {
              name: offering.name,
              description: `${input.date} at ${input.time} · ${offering.durationMinutes} min`,
            },
          },
        },
      ],
    },
    `session-${reference}`,
  )
}

/**
 * Called once embedded checkout reports completion. The booking is only marked
 * confirmed after Stripe itself says the session is paid — the client saying
 * "done" is never enough.
 */
export async function confirmBooking(
  reference: string,
): Promise<{ ok: boolean; status: string }> {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.reference, reference))
    .limit(1)

  if (!booking?.stripeSessionId) return { ok: false, status: 'not_found' }
  if (booking.status === 'confirmed') return { ok: true, status: 'confirmed' }

  try {
    const session = await getStripe().checkout.sessions.retrieve(booking.stripeSessionId)
    if (session.payment_status !== 'paid') {
      return { ok: false, status: session.payment_status ?? 'unpaid' }
    }
  } catch (error) {
    // The guest may well have paid, so never imply the booking failed — the
    // reference is on screen and the payment is visible in Stripe.
    console.error('Could not verify payment with Stripe:', error)
    return { ok: false, status: 'unverified' }
  }

  await db
    .update(bookings)
    .set({ status: 'confirmed' })
    .where(eq(bookings.reference, reference))

  return { ok: true, status: 'confirmed' }
}
