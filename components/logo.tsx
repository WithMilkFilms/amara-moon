import { cn } from '@/lib/utils'

/**
 * The Amara Moon mark — two interlocking circles (the "OO" of MOON), the
 * brand's new logo. Drawn inline as an SVG so it scales crisply at any size
 * and follows `currentColor`, letting each use pick the ink (gold on the
 * standalone mark, the wordmark's own colour inside the word).
 *
 * The two rings sit on the same centre line, offset by one radius so they
 * overlap into a vesica — the "interlocked" reading. Keep both circles equal
 * and the horizontal offset at roughly the radius; widening it breaks the
 * interlock, narrowing it collapses them into one.
 */
function InterlockingCircles({
  className,
  title,
}: {
  className?: string
  /** When set, the SVG is announced with this label; otherwise it is decorative. */
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 92 56"
      fill="none"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="34" cy="28" r="24" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      <circle cx="58" cy="28" r="24" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
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
        className="flex items-center font-serif text-xl font-light uppercase tracking-[0.18em] text-foreground"
      >
        <span>Amara&nbsp;M</span>
        <InterlockingCircles className="mx-[0.08em] h-[0.64em] w-auto" />
        <span>N</span>
      </span>
      <span className="mt-1 font-sans text-[0.6rem] uppercase tracking-widest-xs text-muted-foreground">
        Hout Bay
      </span>
    </span>
  )
}
