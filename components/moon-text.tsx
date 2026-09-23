import type React from 'react'
import { InterlockingCircles } from '@/components/logo'
import { cn } from '@/lib/utils'

/**
 * Renders text the brand way: the "oo" of "moon" is replaced by the two
 * interlocking circles, in step with the surrounding type weight and colour.
 * Any other text is passed through untouched.
 *
 * The brand word (and the full "Amara Moon" phrase when present) is always
 * uppercased — "AMARA MOON" / "MOON" — since the circles sit at cap height and
 * uppercase letters frame them cleanly. Surrounding copy is left exactly as
 * authored (this must never uppercase the whole string). The stylised word
 * stays readable to assistive tech via an sr-only copy of the real word.
 *
 * Matches "moon" only on word boundaries, so "moonlit" or "afternoon" are left
 * alone. An optional "Amara " prefix is captured so the brand lockup always
 * renders in full caps together.
 */
const MOON_WORD = /\b(amara\s+)?(m)(oo)(n)\b/gi

export function MoonText({
  children,
  className,
  circleClassName,
}: {
  children: string
  className?: string
  /** Extra classes for the circle mark, e.g. to nudge size or spacing. */
  circleClassName?: string
}) {
  const parts: React.ReactNode[] = []
  const re = new RegExp(MOON_WORD)
  let last = 0
  let key = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(children)) !== null) {
    if (match.index > last) parts.push(children.slice(last, match.index))

    const [full, amara, lead, , tail] = match
    parts.push(
      // The brand word (and the "Amara " prefix when present) is uppercased —
      // the interlocking circles sit at cap height, so uppercase letters frame
      // them cleanly. The surrounding copy is left exactly as authored (this
      // must never uppercase the whole string).
      <span key={key++} className="whitespace-nowrap uppercase">
        <span className="sr-only">{full}</span>
        <span aria-hidden="true" className="inline-flex items-center">
          {amara}
          {lead}
          <InterlockingCircles
            strokeWidth={1}
            className={cn('mx-[0.01em] inline-block h-[0.72em] w-auto', circleClassName)}
          />
          {tail}
        </span>
      </span>,
    )
    last = match.index + full.length
  }

  if (last < children.length) parts.push(children.slice(last))

  return <span className={className}>{parts}</span>
}
