import Image from 'next/image'

import { cn } from '@/lib/utils'

/**
 * The Amara Moon mark — a goddess-tree of life cradled in a gold-leaf crescent.
 *
 * This is the real brand artwork. `logo-mark-source.png` is the untouched file
 * as supplied; `logo-mark.png` is the version actually rendered, derived from
 * it in three steps:
 *
 *  1. The source is flat black (#010101) with no alpha channel, which would
 *     render as a black square against the ink background. Since the art is
 *     gold-on-black, pixel luminance IS the coverage, so it is used directly as
 *     alpha — that keys the black out while keeping the fine linework's
 *     antialiased edges soft instead of jagged.
 *  2. Luminance at or below 0.055 is forced fully transparent. Without this
 *     floor the near-black background keys to alpha ~4 and leaves a faint dark
 *     box visible around the mark.
 *  3. The few blown gold-leaf highlights are capped to a medium gold so no
 *     pixel renders near-white, then the art is trimmed and re-centred square.
 *
 * Re-run that derivation from the source if the palette ever changes.
 *
 * The gold is baked into the artwork, so unlike an inline SVG this will not
 * follow `currentColor`. That is fine everywhere it is currently used — the
 * mark only ever appears on the dark ground.
 */
export function Logo({
  className,
  priority = false,
}: {
  className?: string
  /** Set on the hero so the mark is not lazy-loaded above the fold. */
  priority?: boolean
}) {
  return (
    <Image
      src="/images/logo-mark.png"
      alt="Amara Moon"
      width={846}
      height={846}
      priority={priority}
      className={cn('h-10 w-10 object-contain', className)}
    />
  )
}

/** Logo plus the wordmark, stacked or inline. */
export function LogoWordmark({
  className,
  markClassName,
}: {
  className?: string
  markClassName?: string
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <Logo className={markClassName} />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl font-light tracking-[0.18em] text-foreground uppercase">
          Amara Moon
        </span>
        <span className="mt-1 font-sans text-[0.6rem] tracking-widest-xs text-muted-foreground uppercase">
          Hout Bay
        </span>
      </span>
    </span>
  )
}
