'use server'

import { Resend } from 'resend'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import {
  clearAdminSession,
  createAdminSession,
  isAdminConfigured,
  requireAdminSession,
  signUnsubscribeToken,
  verifyAdminPassword,
} from '@/lib/admin-auth'
import { EMAIL_TEMPLATES, renderCampaignEmail } from '@/lib/email-templates'
import { SITE } from '@/lib/site'

export interface AdminActionState {
  ok: boolean
  error?: string
}

export async function adminLogin(
  _prev: AdminActionState,
  data: FormData,
): Promise<AdminActionState> {
  if (!isAdminConfigured()) {
    return {
      ok: false,
      error:
        'Admin login is not set up yet — ADMIN_PASSWORD and ADMIN_SESSION_SECRET need to be added in Vercel first.',
    }
  }
  const password = typeof data.get('password') === 'string' ? String(data.get('password')) : ''
  if (!password || !verifyAdminPassword(password)) {
    return { ok: false, error: 'Wrong password.' }
  }
  await createAdminSession()
  redirect('/admin')
}

export async function adminLogout(): Promise<void> {
  await clearAdminSession()
  redirect('/admin/login')
}

export interface SendCampaignState {
  ok: boolean
  error?: string
  sentCount?: number
  failedCount?: number
}

/**
 * Sends one campaign email to every stored subscriber.
 *
 * Sent one at a time in small batches rather than all at once — Resend (like
 * most mail APIs) rate limits per second, and a burst of a few hundred
 * concurrent sends is more likely to trip that than to save real time on a
 * list this size.
 */
export async function sendCampaign(
  _prev: SendCampaignState,
  data: FormData,
): Promise<SendCampaignState> {
  await requireAdminSession()

  const subject = String(data.get('subject') ?? '').trim()
  const body = String(data.get('body') ?? '').trim()
  const template = String(data.get('template') ?? 'moonlit')

  if (!subject || !body) {
    return { ok: false, error: 'Please write a subject and a message.' }
  }
  if (!EMAIL_TEMPLATES.some((t) => t.id === template)) {
    return { ok: false, error: 'Please choose one of the design options.' }
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    return { ok: false, error: 'RESEND_API_KEY is not set, so nothing can be sent yet.' }
  }

  let rows: { email: string; name: string | null }[]
  try {
    rows = await db.select({ email: subscribers.email, name: subscribers.name }).from(subscribers)
  } catch (error) {
    console.error('sendCampaign: failed to load subscribers:', error)
    return { ok: false, error: 'Could not load the subscriber list. Please try again.' }
  }

  if (rows.length === 0) {
    return { ok: false, error: 'There are no subscribers to send to yet.' }
  }

  const resend = new Resend(key)
  const from = process.env.RESEND_FROM ?? 'Amara Moon <onboarding@resend.dev>'

  let sentCount = 0
  let failedCount = 0
  const BATCH_SIZE = 10

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const results = await Promise.all(
      batch.map(async (row) => {
        const unsubscribeUrl = `${appBaseUrl()}/unsubscribe?email=${encodeURIComponent(
          row.email,
        )}&token=${signUnsubscribeToken(row.email)}`
        const html = renderCampaignEmail({ template, subject, body, unsubscribeUrl })
        try {
          const { error } = await resend.emails.send({
            from,
            to: row.email,
            subject,
            html,
          })
          return !error
        } catch (error) {
          console.error('sendCampaign: send failed for', row.email, error)
          return false
        }
      }),
    )
    sentCount += results.filter(Boolean).length
    failedCount += results.filter((r) => !r).length
  }

  return { ok: failedCount === 0, sentCount, failedCount }
}

export interface ReplyState {
  ok: boolean
  error?: string
  sentAt?: number
}

/**
 * Sends a one off reply to a single enquiry, straight from the admin panel.
 *
 * Separate from sendCampaign on purpose: this is a single plain text email to
 * one person, not a templated blast to the whole subscriber list, so it skips
 * EMAIL_TEMPLATES entirely. replyTo is set to info@ (SITE.email) rather than
 * left unset, so if the guest hits reply in their own inbox it comes back to
 * the shared inbox, not to whatever RESEND_FROM happens to be.
 */
export async function replyToEnquiry(
  _prev: ReplyState,
  data: FormData,
): Promise<ReplyState> {
  await requireAdminSession()

  const to = String(data.get('to') ?? '').trim()
  const originalSubject = String(data.get('subject') ?? '').trim()
  const message = String(data.get('message') ?? '').trim()

  if (!to) {
    return { ok: false, error: 'Missing recipient address.' }
  }
  if (!message) {
    return { ok: false, error: 'Write a message before sending.' }
  }
  if (message.length > 4000) {
    return { ok: false, error: 'Please keep the reply under 4000 characters.' }
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    return { ok: false, error: 'RESEND_API_KEY is not set, so nothing can be sent yet.' }
  }

  const resend = new Resend(key)
  const from = process.env.RESEND_FROM ?? 'Amara Moon <onboarding@resend.dev>'
  const subject = originalSubject ? `Re: ${originalSubject}` : 'Re: your message to Amara Moon'

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: SITE.email,
      subject,
      text: message,
    })
    if (error) {
      console.error('replyToEnquiry: Resend rejected the reply:', error)
      return { ok: false, error: 'Resend rejected the reply. Nothing was sent.' }
    }
    return { ok: true, sentAt: Date.now() }
  } catch (error) {
    console.error('replyToEnquiry threw:', error)
    return { ok: false, error: 'Something went wrong sending the reply. Please try again.' }
  }
}

/**
 * Base URL used to build absolute links inside outgoing email (unsubscribe
 * links). Not lib/deployment.ts's APP_ORIGIN — that one is only populated
 * during the static export build, and this code only ever runs in the full
 * app on Vercel. Falls back to the known production URL so a mailer sent
 * before this env var is configured still links somewhere real, not to
 * "undefined".
 */
function appBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  return (configured || SITE_FALLBACK_URL).replace(/\/+$/, '')
}

const SITE_FALLBACK_URL = 'https://amara-moon.vercel.app'
