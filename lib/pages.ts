import pagesData from '@/content/pages.json'

/**
 * Shared page-header copy (eyebrow/title/intro) and extra body copy for
 * Offerings, Schedule, Gallery, Work with Us, and Contact — used by both the
 * app page and its static-export twin where one exists, so the two cannot
 * drift. Editable through the CMS at /admin — see content/pages.json.
 */
interface PageHeaderCopy {
  eyebrow: string
  title: string
  intro: string
}

interface LookingForItem {
  title: string
  body: string
}

interface PagesFile {
  offerings: PageHeaderCopy
  schedule: PageHeaderCopy & { note: string; bookingHeading: string; bookingBody: string }
  gallery: PageHeaderCopy & { closingLine: string }
  workWithUs: PageHeaderCopy & {
    introduceHeading: string
    introduceBody: string
    lookingFor: LookingForItem[]
  }
  contact: PageHeaderCopy & { gettingHere: string }
}

const data = pagesData as PagesFile

export const OFFERINGS_PAGE = data.offerings
export const SCHEDULE_PAGE = data.schedule
export const GALLERY_PAGE = data.gallery
export const WORK_WITH_US_PAGE = data.workWithUs
export const CONTACT_PAGE = data.contact
