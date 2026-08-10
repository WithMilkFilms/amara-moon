import facilitiesData from '@/content/facilities.json'

/**
 * What is physically on the property, grouped for scanning. Editable through
 * the CMS at /admin — see content/facilities.json.
 */
export interface FacilityGroup {
  /** Lucide icon name, resolved by the Facilities component. */
  icon: 'trees' | 'waves' | 'flame'
  title: string
  items: readonly string[]
}

interface FacilitiesFile {
  heading: { eyebrow: string; title: string; intro: string }
  groups: FacilityGroup[]
}

const data = facilitiesData as FacilitiesFile

export const FACILITIES_HEADING = data.heading
export const FACILITY_GROUPS: readonly FacilityGroup[] = data.groups
