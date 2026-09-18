'use client'

import { useActionState, useState } from 'react'
import { type ReplyState, replyToEnquiry } from '@/app/actions/admin'
import { CtaButton } from '@/components/cta'

const initialState: ReplyState = { ok: false }

/**
 * Inline reply box for a single row on /admin/enquiries.
 *
 * Collapsed by default so the list stays scannable — most rows never get a
 * reply, so a form under every one of them would just be noise. Opens into a
 * plain textarea and a send button; on success it shows a small confirmation
 * rather than closing, so it's obvious the send actually happened.
 */
export function EnquiryReply({
  email,
  subject,
}: {
  email: string
  subject: string | null
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(replyToEnquiry, initialState)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start font-sans text-xs uppercase tracking-widest-xs text-primary transition-colors hover:text-foreground"
      >
        Reply
      </button>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 border-t border-border pt-4">
      <input type="hidden" name="to" value={email} />
      <input type="hidden" name="subject" value={subject ?? ''} />
      <label htmlFor={`reply-${email}`} className="sr-only">
        Reply to {email}
      </label>
      <textarea
        id={`reply-${email}`}
        name="message"
        rows={4}
        required
        placeholder={`Write a reply to ${email}…`}
        className="rounded-none border border-input bg-card px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex items-center gap-4">
        <CtaButton type="submit" size="lg" disabled={pending}>
          {pending ? 'Sending…' : 'Send reply'}
        </CtaButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-sans text-xs uppercase tracking-widest-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>
        {state.ok ? (
          <span className="font-sans text-xs text-primary">Sent.</span>
        ) : state.error ? (
          <span role="alert" className="font-sans text-xs text-destructive">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  )
}
