import { SITE } from '@/lib/site'

/**
 * The three "design aesthetics" she gets prompted to choose from when
 * composing a mailer. Inline styles throughout on purpose — email clients
 * strip <style> blocks and ignore Tailwind entirely, so every rule has to
 * live on the element itself. Colours are the site's own palette
 * (app/globals.css) converted from oklch to hex, since oklch() is not safe
 * in mail clients either.
 *
 * Line breaks in the body text become <br> pairs for paragraphs — she writes
 * in a plain textarea, not a rich editor, so this is the one piece of
 * formatting applied automatically.
 */

export interface CampaignTemplate {
  id: string
  name: string
  description: string
}

export const EMAIL_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'moonlit',
    name: 'Moonlit',
    description: 'Dark and warm, gold on charcoal, matches the site itself.',
  },
  {
    id: 'earthy',
    name: 'Earthy Warm',
    description: 'Cream background, terracotta and moss, soft and easy to read.',
  },
  {
    id: 'minimal',
    name: 'Minimal Line',
    description: 'White, quiet, one thin gold rule, gets out of the way of the words.',
  },
]

function paragraphs(body: string, textColor: string): string {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 20px 0;font-size:16px;line-height:1.7;color:${textColor};">${escapeHtml(
          p,
        ).replace(/\n/g, '<br>')}</p>`,
    )
    .join('\n')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

interface RenderArgs {
  template: string
  subject: string
  body: string
  unsubscribeUrl: string
}

function shell(inner: string, bg: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${bg};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
            ${inner}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function moonlit({ subject, body, unsubscribeUrl }: RenderArgs): string {
  const bg = '#17171c'
  const card = '#212129'
  const gold = '#c9a96b'
  const text = '#f2ede2'
  const muted = '#a49a86'
  return shell(
    `
    <tr><td style="padding-bottom:24px;text-align:center;">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${gold};">${SITE.name}</span>
    </td></tr>
    <tr><td style="background:${card};border:1px solid ${gold}38;border-radius:2px;padding:40px 36px;">
      <h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;color:${text};font-weight:400;">${escapeHtml(subject)}</h1>
      ${paragraphs(body, muted)}
    </td></tr>
    <tr><td style="padding-top:28px;text-align:center;">
      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${muted};">${SITE.address.line1}, ${SITE.address.city}</p>
      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;">
        <a href="${unsubscribeUrl}" style="color:${muted};text-decoration:underline;">Unsubscribe</a>
      </p>
    </td></tr>`,
    bg,
  )
}

function earthy({ subject, body, unsubscribeUrl }: RenderArgs): string {
  const bg = '#f7f1e6'
  const card = '#fffdf8'
  const terracotta = '#a8703f'
  const moss = '#3f5443'
  const text = '#2b2620'
  const muted = '#6b6255'
  return shell(
    `
    <tr><td style="padding-bottom:20px;text-align:center;">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${terracotta};">${SITE.name}</span>
    </td></tr>
    <tr><td style="background:${card};border-top:3px solid ${moss};padding:40px 36px;">
      <h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;color:${text};font-weight:400;">${escapeHtml(subject)}</h1>
      ${paragraphs(body, text)}
    </td></tr>
    <tr><td style="padding-top:24px;text-align:center;">
      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${muted};">${SITE.address.line1}, ${SITE.address.city}</p>
      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;">
        <a href="${unsubscribeUrl}" style="color:${muted};text-decoration:underline;">Unsubscribe</a>
      </p>
    </td></tr>`,
    bg,
  )
}

function minimal({ subject, body, unsubscribeUrl }: RenderArgs): string {
  const bg = '#ffffff'
  const gold = '#c9a96b'
  const text = '#1c1c1c'
  const muted = '#8a8a8a'
  return shell(
    `
    <tr><td style="padding-bottom:28px;text-align:center;">
      <span style="font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${muted};">${SITE.name}</span>
    </td></tr>
    <tr><td style="border-top:1px solid ${gold};padding-top:32px;">
      <h1 style="margin:0 0 24px 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.3;color:${text};font-weight:400;">${escapeHtml(subject)}</h1>
      ${paragraphs(body, text)}
    </td></tr>
    <tr><td style="padding-top:32px;border-top:1px solid #eeeeee;text-align:center;">
      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${muted};">${SITE.address.line1}, ${SITE.address.city}</p>
      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;">
        <a href="${unsubscribeUrl}" style="color:${muted};text-decoration:underline;">Unsubscribe</a>
      </p>
    </td></tr>`,
    bg,
  )
}

export function renderCampaignEmail(args: RenderArgs): string {
  switch (args.template) {
    case 'earthy':
      return earthy(args)
    case 'minimal':
      return minimal(args)
    default:
      return moonlit(args)
  }
}
