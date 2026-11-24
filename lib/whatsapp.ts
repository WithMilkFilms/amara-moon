/**
 * Staff WhatsApp alerts via CallMeBot (free, no Meta business verification).
 *
 * Setup: from the phone that should receive alerts, send
 * "I allow callmebot to send me messages" to +34 644 71 81 99 on WhatsApp.
 * The bot replies with an API key. Set WHATSAPP_ALERT_PHONE (that number, with
 * country code) and CALLMEBOT_API_KEY in the project's environment variables.
 *
 * Soft-fails like the email helper: a booking is already saved in the database,
 * so a WhatsApp outage must never surface as an error to the guest.
 */
const DEFAULT_ALERT_PHONE = '27716869732'

export async function sendWhatsappAlert(text: string): Promise<{ sent: boolean }> {
  const phone = (process.env.WHATSAPP_ALERT_PHONE || DEFAULT_ALERT_PHONE).replace(/[^0-9]/g, '')
  const apiKey = process.env.CALLMEBOT_API_KEY
  if (!phone || !apiKey) {
    console.warn('[v0] WhatsApp alert skipped: WHATSAPP_ALERT_PHONE or CALLMEBOT_API_KEY not set.')
    return { sent: false }
  }

  const url = new URL('https://api.callmebot.com/whatsapp.php')
  url.searchParams.set('phone', phone)
  url.searchParams.set('text', text)
  url.searchParams.set('apikey', apiKey)

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), cache: 'no-store' })
    if (!res.ok) {
      console.error('[v0] CallMeBot rejected the alert:', res.status, await res.text())
      return { sent: false }
    }
    return { sent: true }
  } catch (error) {
    console.error('[v0] sendWhatsappAlert threw:', error)
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
    `${alert.offering}`,
    `When: ${alert.when}`,
    `Guest: ${alert.guestName}`,
    `Email: ${alert.guestEmail}`,
    alert.guestPhone ? `Phone: ${alert.guestPhone}` : '',
    `Amount: R${(alert.amountCents / 100).toFixed(2)}`,
    alert.notes ? `Notes: ${alert.notes}` : '',
  ].filter(Boolean)
  return sendWhatsappAlert(lines.join('\n'))
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
  return sendWhatsappAlert(lines.join('\n'))
}
