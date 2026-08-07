import { Resend } from 'resend'
import { SITE } from '@/lib/site'

/**
 * Notification email for form submissions.
 *
 * Deliberately soft-fails. The database write in the calling action is the
 * source of truth, so a mail outage must never turn a saved enquiry into an
 * error message for the guest — we log and move on. Everything remains
 * readable in the `enquiries` table.
 */

/**
 * Resend will only send from a domain you have verified. Until amaramoon
 * .capetown is verified, `onboarding@resend.dev` works out of the box but can
 * only deliver to the Resend account owner's own address — so set RESEND_FROM
 * once the domain is verified to reach info@ properly.
 */
const FROM = process.env.RESEND_FROM ?? 'Amara Moon <onboarding@resend.dev>'

interface NotifyArgs {
  subject: string
  /** Ordered label/value pairs rendered as the body. */
  fields: Array<{ label: string; value: string }>
  /** The enquirer's address, so hitting reply in your inbox answers them. */
  replyTo?: string
}

export async function sendEnquiryNotification({
  subject,
  fields,
  replyTo,
}: NotifyArgs): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    // Not an error: the site is expected to run before email is configured.
    console.warn('[v0] RESEND_API_KEY not set — enquiry saved but no email sent.')
    return { sent: false }
  }

  // Plain text rather than HTML: these are short internal notifications, and
  // text sidesteps both spam heuristics and escaping bugs.
  const text = fields
    .filter((f) => f.value)
    .map((f) => `${f.label}: ${f.value}`)
    .join('\n')

  try {
    const resend = new Resend(key)
    const { error } = await resend.emails.send({
      from: FROM,
      to: SITE.email,
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    })

    if (error) {
      console.error('[v0] Resend rejected the notification:', error)
      return { sent: false }
    }
    return { sent: true }
  } catch (error) {
    console.error('[v0] sendEnquiryNotification threw:', error)
    return { sent: false }
  }
}
