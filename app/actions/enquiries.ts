'use server'

import { eq } from 'drizzle-orm'
import { isValidDateString } from '@/lib/booking'
import { COLLABORATION_ROLES } from '@/lib/collaboration'
import { db } from '@/lib/db'
import { enquiries } from '@/lib/db/schema'
import { sendEnquiryNotification } from '@/lib/email'
import { formatGatheringDate, getGatherings } from '@/lib/gatherings'
import { FULL_MOON_DATES, formatFullMoonDate } from '@/lib/full-moon-circle'
import { subscribeToMailingList } from '@/lib/mailing-list'
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
 * Records whether the notification email went out, best-effort. The enquiry is
 * already safely saved by this point, so a failure to write the flag must never
 * turn into an error for the guest — we just log it and leave the flag null.
 */
async function recordEmailStatus(id: number, sent: boolean): Promise<void> {
  try {
    await db.update(enquiries).set({ emailSent: sent }).where(eq(enquiries.id, id))
  } catch (error) {
    console.error('Failed to record enquiry email status:', error)
  }
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
  const joinMailingList = data.get('mailingList') === 'on'

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

  // Only store a slug we actually recognise: a session/studio-hire offering,
  // the room, or a dated gathering (circles/courses live in lib/gatherings.ts,
  // not in OFFERINGS, so they must be checked separately).
  const gathering = offeringSlug
    ? getGatherings().find((g) => g.slug === offeringSlug)
    : undefined
  const isKnown =
    !!offeringSlug &&
    (offeringSlug === PINE_FOREST_CABIN.slug || !!getOffering(offeringSlug) || !!gathering)
  const slug = isKnown ? offeringSlug : null

  // A reservation from the schedule carries a requested date. Trust it only if
  // it is both a real date and tied to a known offering, so a hand-crafted POST
  // cannot inject arbitrary text into the notification subject.
  const rawDate = str(data, 'reservationDate')
  const reservationDate = slug && isValidDateString(rawDate) ? rawDate : null
  const dateLabel = reservationDate ? formatGatheringDate(reservationDate) : null

  // Reservations get their own subject so Kirst can spot a place to hold and
  // reply with payment details, rather than a general enquiry.
  const notificationSubject = dateLabel
    ? `Reservation request from ${name}`
    : `Website enquiry from ${name}`
  const reservingName = getOffering(slug!)?.name ?? gathering?.name ?? slug
  const storedSubject = dateLabel
    ? `Reservation — ${reservingName} — ${dateLabel}`
    : subject || null

  try {
    const [row] = await db
      .insert(enquiries)
      .values({
        name,
        email,
        phone: phone || null,
        subject: storedSubject,
        offeringSlug: slug,
        message,
      })
      .returning({ id: enquiries.id })

    if (joinMailingList) await subscribeToMailingList(name, email, 'contact')

    // Awaited, not fired-and-forgotten: serverless functions can freeze the
    // moment a response is returned, which would kill an unawaited send.
    const { sent } = await sendEnquiryNotification({
      subject: notificationSubject,
      replyTo: email,
      fields: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Phone', value: phone },
        { label: 'About', value: slug ?? 'General enquiry' },
        ...(dateLabel ? [{ label: 'Requested date', value: dateLabel }] : []),
        { label: 'Joining mailing list', value: joinMailingList ? 'Yes' : 'No' },
        { label: 'Message', value: `\n${message}` },
      ],
    })
    await recordEmailStatus(row.id, sent)

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
  const joinMailingList = data.get('mailingList') === 'on'

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
    const [row] = await db
      .insert(enquiries)
      .values({
        name,
        email,
        phone: phone || null,
        subject: `Work with Us: ${role}`,
        offeringSlug: null,
        message: body,
      })
      .returning({ id: enquiries.id })

    if (joinMailingList) await subscribeToMailingList(name, email, 'work-with-us')

    const { sent } = await sendEnquiryNotification({
      subject: `Work with Us: ${role} (${name})`,
      replyTo: email,
      fields: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Phone', value: phone },
        { label: 'Role', value: role },
        { label: 'Links', value: links },
        { label: 'Joining mailing list', value: joinMailingList ? 'Yes' : 'No' },
        { label: 'About their work', value: `\n${message}` },
      ],
    })
    await recordEmailStatus(row.id, sent)

    return { ok: true }
  } catch (error) {
    console.error('submitCollaboration failed:', error)
    return { ok: false, error: 'Something went wrong saving your message. Please try again.' }
  }
}

/**
 * Handles the Women's Full Moon Circle application form.
 *
 * Shares the `enquiries` table, same reasoning as submitCollaboration above:
 * the shape already fits, and the chosen circle date goes into the message
 * body rather than a new column, avoiding a migration for one extra string.
 * offeringSlug is always the circle's slug, not user-supplied.
 *
 * The mailing-list checkbox is different: that genuinely needs its own
 * queryable table (see `subscribers` in lib/db/schema.ts) since a mailer has
 * to pull "every opted-in email," which a free-text message can't answer.
 * That insert is best-effort and wrapped separately — a mailing-list hiccup
 * must never lose the application itself.
 */
export async function submitFullMoonApplication(
  _prev: EnquiryState,
  data: FormData,
): Promise<EnquiryState> {
  const name = str(data, 'name')
  const email = str(data, 'email')
  const phone = str(data, 'phone')
  const date = str(data, 'date')
  const notes = str(data, 'message')
  const joinMailingList = data.get('mailingList') === 'on'

  if (!name || !email || !phone || !date) {
    return {
      ok: false,
      error: 'Please fill in your name, email, phone number, and pick a date.',
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right.' }
  }
  const isKnownDate = FULL_MOON_DATES.some((d) => d.date === date)
  if (!isKnownDate) {
    return { ok: false, error: 'Please choose one of the listed dates.' }
  }
  if (notes.length > 4000) {
    return { ok: false, error: 'Please keep your note under 4000 characters.' }
  }

  const dateLabel = formatFullMoonDate(date)
  const message = notes
    ? `Requested circle: ${dateLabel}\n\n${notes}`
    : `Requested circle: ${dateLabel}`

  try {
    const [row] = await db
      .insert(enquiries)
      .values({
        name,
        email,
        phone,
        subject: 'Full Moon Circle application',
        offeringSlug: 'womens-full-moon-circle',
        message,
      })
      .returning({ id: enquiries.id })

    if (joinMailingList) await subscribeToMailingList(name, email, 'womens-full-moon-circle')

    const { sent } = await sendEnquiryNotification({
      subject: `Full Moon Circle application (${name})`,
      replyTo: email,
      fields: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Phone', value: phone },
        { label: 'Requested circle', value: dateLabel },
        { label: 'Joining mailing list', value: joinMailingList ? 'Yes' : 'No' },
        { label: 'Note', value: notes ? `\n${notes}` : '' },
      ],
    })
    await recordEmailStatus(row.id, sent)

    return { ok: true }
  } catch (error) {
    console.error('submitFullMoonApplication failed:', error)
    return { ok: false, error: 'Something went wrong saving your application. Please try again.' }
  }
}
