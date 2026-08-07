'use client'

import { CreditCard, Landmark } from 'lucide-react'

import type { PaymentMethod } from '@/lib/payment'

const OPTIONS = [
  {
    value: 'card' as const,
    label: 'Pay by card',
    hint: 'Secure checkout, confirmed instantly',
    Icon: CreditCard,
  },
  {
    value: 'eft' as const,
    label: 'Pay by EFT',
    hint: 'Bank transfer, details on the next step',
    Icon: Landmark,
  },
]

/**
 * Card or bank transfer, as a radio group rather than two submit buttons so the
 * choice is announced as one question with two answers, and so the form keeps a
 * single submit action.
 */
export function PaymentMethodChoice({
  value,
  onChange,
  disabled,
}: {
  value: PaymentMethod
  onChange: (value: PaymentMethod) => void
  disabled?: boolean
}) {
  return (
    <fieldset className="flex flex-col gap-3" disabled={disabled}>
      <legend className="label-xs mb-1 font-sans text-muted-foreground">
        How would you like to pay?
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ value: option, label, hint, Icon }) => {
          const selected = value === option
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors focus-within:ring-2 focus-within:ring-ring ${
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-muted-foreground'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                // Focus ring lives on the label via focus-within, so the native
                // control can be visually hidden without losing keyboard use.
                className="sr-only"
              />
              <Icon
                aria-hidden
                className={`mt-0.5 size-5 shrink-0 ${
                  selected ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span className="flex flex-col gap-1">
                <span className="font-sans text-sm text-foreground">{label}</span>
                <span className="font-sans text-xs leading-relaxed text-muted-foreground">
                  {hint}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
