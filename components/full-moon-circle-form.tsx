'use client'

import { useActionState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { submitFullMoonApplication, type EnquiryState } from '@/app/actions/enquiries'
import { CtaButton } from '@/components/cta'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FULL_MOON_DATES, formatFullMoonOption } from '@/lib/full-moon-circle'

const initial: EnquiryState = { ok: false }

// Matches components/contact-form.tsx and work-with-us-form.tsx so every form
// on the site feels like one system.
const fieldClass =
  'rounded-none border-input bg-card font-sans text-foreground placeholder:text-muted-foreground/60'

export function FullMoonCircleForm() {
  const [state, action, pending] = useActionState(submitFullMoonApplication, initial)

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-4 border border-primary/30 bg-card p-8">
        <Check aria-hidden className="size-6 text-primary" />
        <h2 className="font-serif text-2xl text-foreground">Thank you, that&apos;s with us.</h2>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          We&apos;ll come back to you to confirm your place ahead of that circle. If it&apos;s
          urgent, call us on <span className="text-foreground">+27 71 686 97 32</span>.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5 border border-border bg-card/40 p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-2xl text-foreground">Apply to join</h2>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          Numbers are kept small, so this is an application rather than instant booking.
          We&apos;ll confirm your place by email or phone. The exact time moves with whoever
          is hosting that month, so it may still say &quot;to be confirmed&quot; when you apply,
          we&apos;ll follow up once it&apos;s set. Everyone is encouraged to bring something
          for the harvest table.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fmc-name" className="label-xs font-sans text-muted-foreground">
            Your name
          </Label>
          <Input id="fmc-name" name="name" required autoComplete="name" className={fieldClass} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fmc-email" className="label-xs font-sans text-muted-foreground">
            Email
          </Label>
          <Input
            id="fmc-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fmc-phone" className="label-xs font-sans text-muted-foreground">
            Phone
          </Label>
          <Input
            id="fmc-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fmc-date" className="label-xs font-sans text-muted-foreground">
            Which circle
          </Label>
          {/*
            Native select, same reasoning as work-with-us-form.tsx: it posts
            with the form before hydration, and the option list is shared with
            the server action from lib/full-moon-circle.ts so the two cannot
            drift apart.
          */}
          <div className="relative">
            <select
              id="fmc-date"
              name="date"
              required
              defaultValue=""
              className="h-9 w-full appearance-none rounded-none border border-input bg-card pl-3 pr-9 font-sans text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>
                Choose a date
              </option>
              {FULL_MOON_DATES.map((d) => (
                <option key={d.date} value={d.date}>
                  {formatFullMoonOption(d)}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="fmc-message" className="label-xs font-sans text-muted-foreground">
          Anything else <span className="normal-case tracking-normal">(optional)</span>
        </Label>
        <Textarea id="fmc-message" name="message" rows={4} className={fieldClass} />
      </div>

      {/*
        Native checkbox, same reasoning as the native select above: posts with
        the form pre-hydration, no extra dependency. The server action reads
        it as data.get('mailingList') === 'on', the value a checked native
        checkbox sends by default.
      */}
      <label htmlFor="fmc-mailing-list" className="flex items-start gap-3 font-sans text-sm text-muted-foreground">
        <input
          id="fmc-mailing-list"
          name="mailingList"
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 rounded-none border-input accent-primary"
        />
        Add me to the mailing list for future events
      </label>

      {state.error ? (
        <p role="alert" className="font-sans text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <CtaButton type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? 'Sending…' : 'Apply to join'}
      </CtaButton>
    </form>
  )
}
