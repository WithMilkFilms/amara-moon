'use client'

import { useActionState } from 'react'
import { Check } from 'lucide-react'
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiries'
import { CtaButton } from '@/components/cta'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { OFFERINGS, PINE_FOREST_CABIN } from '@/lib/offerings'

const initial: EnquiryState = { ok: false }

const fieldClass =
  'rounded-none border-input bg-card font-sans text-foreground placeholder:text-muted-foreground/60'

export function ContactForm({ offeringSlug }: { offeringSlug?: string }) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-4 border border-primary/30 bg-card p-8">
        <Check aria-hidden className="size-6 text-primary" />
        <h2 className="font-serif text-2xl text-foreground">Thank you — that&apos;s with us.</h2>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          We&apos;ll come back to you as soon as we can. If it&apos;s urgent, call us on{' '}
          <span className="text-foreground">+27 71 686 97 32</span>.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="label-xs font-sans text-muted-foreground">
            Your name
          </Label>
          <Input id="name" name="name" required autoComplete="name" className={fieldClass} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="label-xs font-sans text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone" className="label-xs font-sans text-muted-foreground">
            Phone <span className="normal-case tracking-normal">(optional)</span>
          </Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="offeringSlug" className="label-xs font-sans text-muted-foreground">
            About
          </Label>
          {/*
            A native select keeps this a plain uncontrolled form — no client
            state needed, and it pre-fills from ?offering= on the detail pages.
          */}
          <select
            id="offeringSlug"
            name="offeringSlug"
            defaultValue={offeringSlug ?? ''}
            className="h-9 w-full rounded-none border border-input bg-card px-3 font-sans text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">General enquiry</option>
            {OFFERINGS.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
            {/* Derived from the constant so the slug cannot drift out of sync. */}
            <option value={PINE_FOREST_CABIN.slug}>
              Staying in the {PINE_FOREST_CABIN.name}
            </option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message" className="label-xs font-sans text-muted-foreground">
          Message
        </Label>
        <Textarea id="message" name="message" required rows={6} className={fieldClass} />
      </div>

      {state.error ? (
        <p role="alert" className="font-sans text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <CtaButton type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? 'Sending…' : 'Send message'}
      </CtaButton>
    </form>
  )
}
