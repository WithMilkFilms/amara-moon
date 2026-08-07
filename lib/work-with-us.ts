/**
 * What we are looking for. Short and concrete beats an open-ended invitation.
 *
 * Lives here rather than in the page because both the app page and its
 * static-export twin render it, and two copies of the same list would
 * eventually disagree.
 */
export const LOOKING_FOR = [
  {
    title: 'Teachers',
    body: 'Experienced yoga, movement, breathwork and meditation teachers who want a regular slot in the shala or a one-off workshop.',
  },
  {
    title: 'Retreat hosts',
    body: 'Facilitators looking for a venue with accommodation, a pool and sauna, and private access to the mountain.',
  },
  {
    title: 'Practitioners',
    body: 'Massage therapists, bodyworkers and sound practitioners who would like to see clients here.',
  },
  {
    title: 'Creatives',
    body: 'Photographers, writers and makers whose work sits alongside what we do in the valley.',
  },
] as const
