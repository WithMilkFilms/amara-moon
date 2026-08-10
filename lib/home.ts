import homeData from '@/content/home.json'

/**
 * Homepage section copy — hero subtitle, the Invitation, Legend, and Teach
 * Invitation sections. Editable through the CMS at /admin — see
 * content/home.json.
 */
interface HomeFile {
  hero: { subtitle: string }
  invitation: { eyebrow: string; quote: string; paragraphs: string[] }
  legend: { eyebrow: string; paragraph: string; closingQuote: string }
  teachInvitation: { eyebrow: string; heading: string; paragraph: string }
}

const data = homeData as HomeFile

export const HERO = data.hero
export const INVITATION = data.invitation
export const LEGEND = data.legend
export const TEACH_INVITATION = data.teachInvitation
