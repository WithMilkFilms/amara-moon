import type React from 'react'
import { InterlockingCircles } from '@/components/logo'
import { cn } from '@/lib/utils'

/**
 * Renders text with every standalone "moon" word drawn the brand way: the
 * "oo" replaced by the two interlocking circles, in step with the surrounding
 * type weight and colour. Any other text is passed through untouched.
 *
 * Case is preserved from the source ("Moon", "MOON", "moon" all keep their
 * leading M/m and trailing n/N). The stylised word stays readable to assistive
 * tech via an sr-only copy of the real word, with the visual pieces hidden.
 *
 * Matches the word "moon" only on word boundaries, so "moonlit" or "afternoon"
 * are left alone — only the standalone brand/word usages get the treatment.
 */
const MOON_WORD = /\b(m)(oo)(n)\b/gi

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

    const [full, lead, , tail] = match
    parts.push(
      <span key={key++} className="whitespace-nowrap">
        <span className="sr-only">{full}</span>
        <span aria-hidden="true" className="inline-flex items-center">
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
