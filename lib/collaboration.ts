/**
 * Roles offered on /work-with-us.
 *
 * Lives here rather than in app/actions/enquiries.ts because a 'use server'
 * module may only export async functions — Next.js turns every export into a
 * server action reference, so an exported array arrives on the client as a
 * function and `.map()` throws at render time.
 *
 * Keeping it in a plain module lets the form render the options and the action
 * validate against the same list.
 */
export const COLLABORATION_ROLES = [
  'Yoga',
  'Movement or dynamic meditation',
  'Retreat or workshop facilitator',
  'Therapist or bodyworker',
  'Sound or breathwork practitioner',
  'Photographer or creative',
  'Something else',
] as const
