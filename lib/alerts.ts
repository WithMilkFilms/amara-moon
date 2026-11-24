/**
 * Staff alerts for bookings and enquiries, sent to a Telegram chat via a bot.
 *
 * Env vars:
 *   TELEGRAM_BOT_TOKEN  token from @BotFather
 *   TELEGRAM_CHAT_ID    chat that receives alerts (a person or a group; groups start with "-")
 *
 * Soft-fails like the email helper: the booking or enquiry is already saved in the
 * database, so an alert outage must never surface as an error to the guest.
 */
export async function sendStaffAlert(text: string): Promise<{ sent: boolean }> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.warn('[v0] Staff alert skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set.')
    return { sent: false }
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4000),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error('[v0] Telegram rejected the alert:', res.status, await res.text())
      return { sent: false }
    }
    return { sent: true }
  } catch (error) {
    console.error('[v0] sendStaffAlert threw:', error)
    return { sent: false }
  }
}

interface BookingAlert {
  headline: string
  reference: string
  offering: string
  when: string
  guestName: string
  guestEmail: string
  guestPhone?: string | null
  amountCents: number
  notes?: string | null
}

export function sendBookingAlert(alert: BookingAlert) {
  const lines = [
    alert.headline,
    `Ref: ${alert.reference}`,
    alert.offering,
    `When: ${alert.when}`,
    `Guest: ${alert.guestName}`,
    `Email: ${alert.guestEmail}`,
    alert.guestPhone ? `Phone: ${alert.guestPhone}` : '',
    `Amount: R${(alert.amountCents / 100).toFixed(2)}`,
    alert.notes ? `Notes: ${alert.notes}` : '',
  ].filter(Boolean)
  return sendStaffAlert(lines.join('\n'))
}

export function sendEnquiryAlert(
  headline: string,
  fields: { label: string; value: string | null | undefined }[],
) {
  const lines = [
    headline,
    ...fields
      .filter((f) => f.value && f.value.trim())
      .map((f) => `${f.label}: ${f.value!.trim().slice(0, 1200)}`),
  ]
  return sendStaffAlert(lines.join('\n'))
}
