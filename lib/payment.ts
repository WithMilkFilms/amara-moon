/**
 * Payment settings for Amara Moon.
 *
 * Card payments run through Stripe. EFT is offered alongside it because local
 * guests overwhelmingly prefer a bank transfer, and it costs nothing per
 * transaction.
 *
 * These are real banking details, so they live in one place only and are shown
 * to a guest who has chosen EFT for a specific booking — never listed on a
 * public page, where they would be scraped and reused in payment-redirection
 * scams. If these details ever change, this constant is the only edit.
 */
export const BANK_DETAILS = {
  bank: 'First National Bank (FNB)',
  accountName: 'Kirsty Wagner',
  accountNumber: '62755747957',
  branchCode: '250655',
} as const

/** Ordered for display, so the panel and any future email agree. */
export const BANK_DETAIL_ROWS = [
  { label: 'Bank', value: BANK_DETAILS.bank },
  { label: 'Account name', value: BANK_DETAILS.accountName },
  { label: 'Account number', value: BANK_DETAILS.accountNumber },
  { label: 'Branch code', value: BANK_DETAILS.branchCode },
] as const

/**
 * How long an EFT booking is held while payment clears.
 *
 * Card payments settle in seconds, so an unpaid card booking only holds its
 * slot for `HOLD_MINUTES`. A bank transfer cannot be that strict: an EFT sent
 * on Friday evening may not reflect until Monday. 72 hours covers a weekend
 * without holding a slot indefinitely for a transfer that never arrives.
 */
export const EFT_HOLD_HOURS = 72

export type PaymentMethod = 'card' | 'eft'

/** Booking status used while an EFT is expected but has not been matched yet. */
export const AWAITING_EFT = 'awaiting_eft'
