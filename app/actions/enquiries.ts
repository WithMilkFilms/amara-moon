'use server'

import { COLLABORATION_ROLES } from '@/lib/collaboration'
import { db } from '@/lib/db'
import { enquiries } from '@/lib/db/schema'
import { sendEnquiryNotification } from '@/lib/email'
import { PINE_FOREST_CABIN, getOffering } from '@/lib/offerings'

export interface EnquiryState {
  ok: boolean
  error?: string
}

function str(data: FormData, key: string): string {
  const value = data.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Saves a contact / price enquiry, then notifies info@ by email.
 *
 * The database write is the source of truth and happens first; the email is a
 * convenience layer on top. See lib/email.ts for why a failed send is not
 * surfaced to the guest.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  data: FormData,
): Promise<EnquiryState> {
  const name = str(data, 'name')
  const email = str(data, 'email')
  const message = str(data, 'message')
  const phone = str(data, 'phone')
  const subject = str(data, 'subject')
  const offeringSlug = str(data, 'offeringSlug')

  if (!name || !email || !message) {
    return { ok: false, error: 'Please fill in your name, email and message.' }
  }
  // Deliberately permissive: a real address that fails a clever regex is worse
  // than a typo getting through.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right.' }
  }
  if (message.length > 4000) {
    return { ok: false, error: 'Please keep your message under 4000 characters.' }
  }

  // Only store a slug we actually recognise (sessions, studio hire, or the room).
  const isKnown =
    !!offeringSlug &&
    (offeringSlug === PINE_FOREST_CABIN.slug || !!getOffering(offeringSlug))
  const slug = isKnown ? offeringSlug : null

  try {
    await db.insert(enquiries).values({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      offeringSlug: slug,
      message,
    })

    // Awaited, not fired-and-forgotten: serverless functions can freeze the
    // moment a response is returned, which would kill an unawaited send.
    await sendEnquiryNotification({
      subject: `Website enquiry from ${name}`,
      replyTo: email,
      fields: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Phone', value: phone },
        { label: 'About', value: slug ?? 'General enquiry' },
        { label: 'Message', value: `\n${message}` },
      ],
    })

    return { ok: true }
  } catch (error) {
    // The guest only sees a friendly message, so log the real cause server-side.
    console.error('submitEnquiry failed:', error)
    return { ok: false, error: 'Something went wrong saving your message. Please try again.' }
  }
}

/**
 * Handles the "Work with Us" form.
 *
 * Shares the `enquiries` table rather than adding a second one: the shape is
 * identical, and the `subject` column (previously unused) marks these apart so
 * they can be filtered later. Links go into the message body for the same
 * reason — it avoids a migration for a single extra string.
 */
export async function submitCollaboration(
  _prev: EnquiryState,
  data: FormData,
): Promise<EnquiryState> {
  const name = str(data, 'name')
  const email = str(data, 'email')
  const message = str(data, 'message')
  const phone = str(data, 'phone')
  const links = str(data, 'links')
  const rawRole = str(data, 'role')

  // `links` is required alongside the rest: seeing someone's work is how we
  // judge a collaboration, so re-checked here and not just via the input's
  // `required` attribute, which a non-JS or crafted POST bypasses.
  if (!name || !email || !message || !links) {
    return {
      ok: false,
      error:
        'Please fill in your name, email, a link to your work, and a note about what you do.',
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right.' }
  }
  if (message.length > 4000) {
    return { ok: false, error: 'Please keep your message under 4000 characters.' }
  }

  const role = (COLLABORATION_ROLES as readonly string[]).includes(rawRole)
    ? rawRole
    : 'Something else'

  const body = `${message}\n\nLinks: ${links}`

  try {
    await db.insert(enquiries).values({
      name,
      email,
      phone: phone || null,
      subject: `Work with Us — ${role}`,
      offeringSlug: null,
      message: body,
    })

    await sendEnquiryNotification({
      subject: `Work with Us — ${role} — ${name}`,
      replyTo: email,
      fields: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Phone', value: phone },
        { label: 'Role', value: role },
        { label: 'Links', value: links },
        { label: 'About their work', value: `\n${message}` },
      ],
    })

    return { ok: true }
  } catch (error) {
    console.error('submitCollaboration failed:', error)
    return { ok: false, error: 'Something went wrong saving your message. Please try again.' }
  }
}
