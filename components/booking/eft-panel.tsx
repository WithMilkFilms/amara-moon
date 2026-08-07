'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { CtaLink } from '@/components/cta'
import { BANK_DETAIL_ROWS, EFT_HOLD_HOURS } from '@/lib/payment'
import { formatZar } from '@/lib/offerings'

/**
 * Shown once a guest has chosen to pay by bank transfer. The booking row
 * already exists at this point, holding the slot, so this screen only has to do
 * two things well: give the account details accurately, and make it obvious
 * that the reference must be used so the payment can be matched.
 */
export function EftPanel({
  reference,
  amountCents,
}: {
  reference: string
  amountCents: number
}) {
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard can be blocked by permissions; the value is on screen anyway.
    }
  }

  // The amount and reference are what people get wrong, so they lead.
  const rows = [
    ...BANK_DETAIL_ROWS,
    { label: 'Amount', value: formatZar(amountCents) },
    { label: 'Reference', value: reference },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-3xl leading-tight text-balance text-foreground">
          Pay by bank transfer
        </h2>
        <p className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
          Your slot is held for {EFT_HOLD_HOURS} hours. Transfer the amount below
          using <span className="text-foreground">{reference}</span> as the payment
          reference, and we&apos;ll confirm by email as soon as it reflects.
        </p>
      </div>

      <dl className="flex flex-col divide-y divide-border border-y border-border">
        {rows.map((row) => {
          const isReference = row.label === 'Reference'
          return (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 py-4"
            >
              <dt className="label-xs font-sans text-muted-foreground">{row.label}</dt>
              <dd className="flex items-center gap-3">
                <span
                  className={
                    isReference || row.label === 'Amount'
                      ? 'font-serif text-lg text-primary'
                      : 'font-sans text-sm tabular-nums text-foreground'
                  }
                >
                  {row.value}
                </span>
                <button
                  type="button"
                  onClick={() => copy(row.label, row.value)}
                  className="text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Copy ${row.label.toLowerCase()}`}
                >
                  {copied === row.label ? (
                    <Check aria-hidden className="size-4 text-primary" />
                  ) : (
                    <Copy aria-hidden className="size-4" />
                  )}
                </button>
              </dd>
            </div>
          )
        })}
      </dl>

      <p aria-live="polite" className="sr-only">
        {copied ? `${copied} copied` : ''}
      </p>

      <div className="flex flex-wrap gap-4">
        <CtaLink href={`/bookings/${reference}`}>View your booking</CtaLink>
        <CtaLink href="/contact" variant="outline">
          Send proof of payment
        </CtaLink>
      </div>
    </div>
  )
}
