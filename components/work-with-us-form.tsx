'use client'

import { useActionState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { submitCollaboration, type EnquiryState } from '@/app/actions/enquiries'
import { CtaButton } from '@/components/cta'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { COLLABORATION_ROLES } from '@/lib/collaboration'
import { SITE } from '@/lib/site'

const initial: EnquiryState = { ok: false }

// Matches components/contact-form.tsx so the two forms feel like one system.
const fieldClass =
  'rounded-none border-input bg-card font-sans text-foreground placeholder:text-muted-foreground/60'

export function WorkWithUsForm() {
  const [state, action, pending] = useActionState(submitCollaboration, initial)

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-4 border border-primary/30 bg-card p-8">
        <Check aria-hidden className="size-6 text-primary" />
        <h2 className="font-serif text-2xl text-foreground">
          Thank you — we have your details.
        </h2>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          We read every one of these properly, so it may take us a few days to reply. If
          you&apos;d rather talk it through, call us on{' '}
          <span className="text-foreground">{SITE.phone}</span>.
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
          <Label htmlFor="role" className="label-xs font-sans text-muted-foreground">
            What you do
          </Label>
          {/*
            A native select rather than the Radix one in components/ui: it posts
            its value with the form even before hydration, which keeps this page
            working without JS. The trade-off is the OS-default arrow, so
            appearance-none plus our own chevron restores visual parity with the
            neighbouring inputs.

            Options share lib/collaboration.ts with the server action, so the
            rendered list and the validated list cannot drift apart.
          */}
          <div className="relative">
            <select
              id="role"
              name="role"
              defaultValue={COLLABORATION_ROLES[0]}
              className="h-9 w-full appearance-none rounded-none border border-input bg-card pl-3 pr-9 font-sans text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {COLLABORATION_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
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
        <Label htmlFor="links" className="label-xs font-sans text-muted-foreground">
          Website or Instagram
        </Label>
        <Input
          id="links"
          name="links"
          required
          className={fieldClass}
          placeholder="instagram.com/yourhandle"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message" className="label-xs font-sans text-muted-foreground">
          Tell us about your work
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          className={fieldClass}
          placeholder="What you teach or offer, how long you have been doing it, and what you imagine doing here."
        />
      </div>

      {state.error ? (
        <p role="alert" className="font-sans text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <CtaButton type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? 'Sending…' : 'Send introduction'}
      </CtaButton>
    </form>
  )
}
