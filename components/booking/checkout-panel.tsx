'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { confirmBooking } from '@/app/actions/bookings'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
)

export function CheckoutPanel({
  clientSecret,
  reference,
}: {
  clientSecret: string
  reference: string
}) {
  const router = useRouter()

  // Stripe telling us it is done is not proof of payment — `confirmBooking`
  // re-checks the session server-side before the booking is confirmed.
  const onComplete = useCallback(async () => {
    await confirmBooking(reference)
    router.push(`/bookings/${reference}`)
  }, [reference, router])

  return (
    // Embedded Checkout renders its own light UI, so it sits on a light card
    // rather than fighting the dark page.
    <div className="rounded-sm bg-card p-4 sm:p-6">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret, onComplete }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
