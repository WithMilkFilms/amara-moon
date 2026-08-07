/**
 * What is physically on the property, grouped for scanning.
 *
 * Supplied as a single run-on sentence ("a peaceful 30m2 yoga shala with sound
 * system, kitchenette and two connected bathrooms..."). Split into groups here
 * because an eleven-item list reads as a wall in prose but scans instantly as
 * a grid — and because these are the concrete details guests compare between
 * venues.
 *
 * NOTE: the source copy ends with "2 accommodation options", but only the Pine
 * Forest Cabin exists in lib/offerings.ts. Accommodation is deliberately left
 * out of this list rather than guessed at — it has its own section on the home
 * page, and advertising a second option we cannot name or price would be a
 * promise the booking flow can't keep. Add the second one to OFFERINGS first.
 */
export interface FacilityGroup {
  /** Lucide icon name, resolved by the Facilities component. */
  icon: 'trees' | 'waves' | 'flame'
  title: string
  items: readonly string[]
}

export const FACILITY_GROUPS: readonly FacilityGroup[] = [
  {
    icon: 'trees',
    title: 'The Oasis Studio',
    items: [
      'Peaceful 30m² yoga shala',
      'Sound system',
      'Kitchenette',
      'Two connected bathrooms with showers',
    ],
  },
  {
    icon: 'waves',
    title: 'Water and heat',
    items: ['Swimming pool', 'Infrared sauna', 'Hot tub'],
  },
  {
    icon: 'flame',
    title: 'Outdoors',
    items: [
      'Outdoor sun deck',
      "Nature's dining area and lounge",
      'Fire pit',
      'Braai area',
    ],
  },
] as const
