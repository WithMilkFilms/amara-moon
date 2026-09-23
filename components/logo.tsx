import { cn } from '@/lib/utils'

/**
 * The Amara Moon mark — the "OO" of MOON drawn as two equal rings, each
 * cradling a crescent moon. Drawn inline as an SVG so it scales crisply at
 * any size and follows `currentColor`, letting each use pick the ink (gold on
 * the standalone mark, the wordmark's own colour inside the word).
 *
 * The two rings sit on one centre line as separate circles with a small gap;
 * a filled lune crescent is tucked inside each ring. Keep both circles
 * equal and the gap tight so the pair still reads as the double "O".
 *
 * (Export name kept as `InterlockingCircles` for API compatibility with the
 * many callers that import it.)
 */
export function InterlockingCircles({
  className,
  title,
  strokeWidth = 3,
}: {
  className?: string
  /** When set, the SVG is announced with this label; otherwise it is decorative. */
  title?: string
  /** Constant on-screen stroke width in px (non-scaling). Keep it in step with
   * the ink around it — thin (~1) inside the wordmark so it matches the serif
   * letters, a touch heavier on the large standalone mark. */
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 104 52"
      fill="none"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* First "O" of MOON, cradling a crescent moon. */}
      <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      <path d="M21 8.71A18 18 0 1 1 21 43.29A18 18 0 0 0 21 8.71Z" fill="currentColor" />
      {/* Second "O" of MOON, cradling a matching crescent moon. */}
      <circle cx="78" cy="26" r="24" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      <path d="M73 8.71A18 18 0 1 1 73 43.29A18 18 0 0 0 73 8.71Z" fill="currentColor" />
    </svg>
  )
}

/**
 * The standalone logo mark. Gold by default; pass a text-colour class to
 * override. The wide mark is centred within whatever (often square) box the
 * caller sizes it to.
 */
export function Logo({
  className,
  // Retained for API compatibility with callers that mark the mark as
  // above-the-fold; an inline SVG needs no priority hint.
  priority: _priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <InterlockingCircles
      title="Amara Moon"
      strokeWidth={2}
      className={cn('h-10 w-10 text-primary', className)}
    />
  )
}

/**
 * The full wordmark: "AMARA MOON" with the interlocking circles standing in
 * for the "OO" of MOON, over a small "Hout Bay" line. The stylised name is
 * decorative for assistive tech — the surrounding link/heading carries the
 * readable label.
 */
export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex flex-col leading-none', className)}>
      <span
        aria-hidden="true"
        className="flex items-center font-wordmark text-xl font-light uppercase tracking-[0.18em] text-primary"
      >
        <span>Amara&nbsp;M</span>
        <InterlockingCircles strokeWidth={1} className="mx-[0.08em] h-[0.64em] w-auto" />
        <span>N</span>
      </span>
      <span className="mt-1 font-sans text-[0.6rem] uppercase tracking-widest-xs text-muted-foreground">
        Hout Bay
      </span>
    </span>
  )
}
