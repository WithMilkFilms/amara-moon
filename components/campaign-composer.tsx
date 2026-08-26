'use client'

import { useMemo, useState } from 'react'
import { useActionState } from 'react'
import { Check } from 'lucide-react'
import { sendCampaign, type SendCampaignState } from '@/app/actions/admin'
import { CtaButton } from '@/components/cta'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { EMAIL_TEMPLATES, renderCampaignEmail } from '@/lib/email-templates'

const initial: SendCampaignState = { ok: false }

const fieldClass =
  'rounded-none border-input bg-card font-sans text-foreground placeholder:text-muted-foreground/60'

interface Props {
  subscriberCount: number
}

/**
 * The compose screen — this is the "prompted for design aesthetic" part.
 * Subject and body drive both the form submission and a live preview on the
 * right, rendered through the same renderCampaignEmail() the server action
 * uses, so what she sees here is exactly what goes out, not an approximation.
 */
export function CampaignComposer({ subscriberCount }: Props) {
  const [state, action, pending] = useActionState(sendCampaign, initial)
  const [template, setTemplate] = useState(EMAIL_TEMPLATES[0].id)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const previewHtml = useMemo(
    () =>
      renderCampaignEmail({
        template,
        subject: subject || 'Your subject line',
        body: body || 'Write your message on the left — it will appear here as you type.',
        unsubscribeUrl: '#',
      }),
    [template, subject, body],
  )

  if (state.ok) {
    return (
      <div className="flex flex-col items-start gap-4 border border-primary/30 bg-card p-8">
        <Check aria-hidden className="size-6 text-primary" />
        <h2 className="font-serif text-2xl text-foreground">Sent.</h2>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          Delivered to {state.sentCount} {state.sentCount === 1 ? 'address' : 'addresses'}
          {state.failedCount ? `, ${state.failedCount} failed — check the server log.` : '.'}
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="label-xs font-sans text-muted-foreground">Design</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {EMAIL_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                aria-pressed={template === t.id}
                className={cn(
                  'flex flex-col gap-1 border p-3 text-left transition-colors',
                  template === t.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/40',
                )}
              >
                <span className="font-sans text-sm text-foreground">{t.name}</span>
                <span className="font-sans text-xs text-muted-foreground">{t.description}</span>
              </button>
            ))}
          </div>
          <input type="hidden" name="template" value={template} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="campaign-subject" className="label-xs font-sans text-muted-foreground">
            Subject
          </Label>
          <Input
            id="campaign-subject"
            name="subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="campaign-body" className="label-xs font-sans text-muted-foreground">
            Message
          </Label>
          <Textarea
            id="campaign-body"
            name="body"
            required
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write it as you would say it. Leave a blank line between paragraphs."
            className={fieldClass}
          />
        </div>

        {state.error ? (
          <p role="alert" className="font-sans text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        <CtaButton type="submit" size="lg" disabled={pending} className="self-start">
          {pending ? 'Sending…' : `Send to ${subscriberCount} ${subscriberCount === 1 ? 'address' : 'addresses'}`}
        </CtaButton>
      </div>

      <div className="flex flex-col gap-2">
        <span className="label-xs font-sans text-muted-foreground">Preview</span>
        <div className="h-[640px] overflow-hidden border border-border bg-muted">
          <iframe
            title="Email preview"
            srcDoc={previewHtml}
            sandbox=""
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </form>
  )
}
