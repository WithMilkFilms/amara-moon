import { PINE_FOREST_CABIN, type Offering } from '@/lib/offerings'

/**
 * Booking helpers shared by the server actions and the forms.
 *
 * Everything price-related lives on the server (see `lib/offerings.ts`). The
 * browser only ever sends *what* is being booked — never an amount.
 */

/** A readable reference the guest can quote, e.g. "AM-7K3F9Q". */
export function makeReference(): string {
  // Ambiguous characters (0/O, 1/I) are left out so references are easy to
  // read out over the phone.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `AM-${code}`
}

/** `YYYY-MM-DD` for today in South Africa, used as the earliest bookable date. */
export function todayInCapeTown(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)
}

/** Whole nights between two `YYYY-MM-DD` dates. Returns 0 if not positive. */
export function countNights(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00Z`).getTime()
  const end = new Date(`${checkOut}T00:00:00Z`).getTime()
  const nights = Math.round((end - start) / 86_400_000)
  return nights > 0 ? nights : 0
}

export function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

/** Quantity must be a positive whole number within the offering's cap. */
export function normaliseQuantity(raw: unknown, offering: Offering): number {
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1) return 0
  return n <= offering.maxQuantity ? n : 0
}

export function normaliseGuests(raw: unknown): number {
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1) return 0
  return n <= PINE_FOREST_CABIN.maxGuests ? n : 0
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
