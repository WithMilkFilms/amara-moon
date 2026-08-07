import 'server-only'

import Stripe from 'stripe'

/**
 * Lazily-constructed Stripe client.
 *
 * The client is NOT built at module scope. Next.js imports every module while
 * collecting page data at build time, and `new Stripe(undefined)` throws
 * immediately ("Neither apiKey nor config.authenticator provided") — which
 * failed the production build even on pages that never charge anything.
 *
 * Deferring construction to the first real call means the key is only required
 * when a payment actually happens, and the error (if the key is missing) points
 * at the cause instead of a build-time stack trace.
 */
let client: Stripe | null = null

export function getStripe(): Stripe {
  if (client) return client

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set — payments cannot be processed. Add it to the project environment variables.',
    )
  }

  client = new Stripe(key)
  return client
}
