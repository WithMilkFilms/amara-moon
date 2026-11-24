/**
 * Staff WhatsApp alerts via the official WhatsApp Business Cloud API (Meta).
 *
 * Env vars:
 *   WHATSAPP_TOKEN            permanent System User access token
 *   WHATSAPP_PHONE_NUMBER_ID  ID of the sending business number (not the number itself)
 *   WHATSAPP_TEMPLATE         approved template name with ONE body variable {{1}}
 *   WHATSAPP_TEMPLATE_LANG    template language code (default "en")
 *   WHATSAPP_ALERT_PHONE      who receives alerts (default +27 71 686 97 32)
 *
 * Meta only delivers free-form text inside a 24h window after the recipient last
 * messaged the business number, so alerts use the approved template when one is set.
 *
 * Soft-fails like the email helper: a booking is already saved in the database,
 * so a WhatsApp outage must never surface as an error to the guest.
 */
const DEFAULT_ALERT_PHONE = '27716869732'
const GRAPH_VERSION = process.env.WHATSAPP_API_VERSION || 'v22.0'

export async function sendWhatsappAlert(text: string): Promise<{ sent: boolean }> {
  const to = (process.env.WHATSAPP_ALERT_PHONE || DEFAULT_ALERT_PHONE).replace(/[^0-9]/g, '')
  const token = process.env.WHATSAPP_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!to || !token || !phoneNumberId) {
    console.warn('[v0] WhatsApp alert skipped: WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set.')
    return { sent: false }
  }

  const template = process.env.WHATSAPP_TEMPLATE
  // Template variables may not contain newlines, tabs or 4+ spaces, and max 1024 chars.
  const flattened = text.replace(/\s*\n\s*/g, ' | ').replace(/\s{2,}/g, ' ').slice(0, 1000)

  const body = template
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
          components: [{ type: 'body', parameters: [{ type: 'text', text: flattened }] }],
        },
      }
    : { messaging_product: 'whatsapp', to, type: 'text', text: { body: text.slice(0, 4000) } }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error('[v0] WhatsApp Cloud API rejected the alert:', res.status, await res.text())
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
