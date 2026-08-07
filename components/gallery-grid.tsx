'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type Shot = { src: string; alt: string; feature?: boolean }

export function GalleryGrid({ shots }: { shots: Shot[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setOpenIndex(null)
    lastTriggerRef.current?.focus()
  }, [])

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? i : (i + delta + shots.length) % shots.length)),
    [shots.length],
  )

  // Escape closes, arrows move between photos, and the page behind stays put.
  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [openIndex, close, step])

  const active = openIndex === null ? null : shots[openIndex]

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/*
          Every tile keeps the photography's native 3:2, so nothing is cropped.
          A feature tile covers two columns AND two rows, which works out to
          2*357+16 wide by 2*238+16 tall — 3:2 again — so it sits flush beside
          the two stacked tiles in the third column. Widening a tile across two
          columns on a single row instead would need a 3:1 crop to align.
        */}
        {shots.map((shot, index) => (
          <figure
            key={shot.alt}
            className={`relative aspect-3/2 overflow-hidden rounded-sm bg-muted ${
              shot.feature ? 'md:col-span-2 md:row-span-2' : ''
            }`}
          >
            <Image
              src={shot.src || '/placeholder.svg'}
              alt={shot.alt}
              fill
              sizes={
                shot.feature
                  ? '(min-width: 768px) 66vw, 100vw'
                  : '(min-width: 768px) 33vw, 100vw'
              }
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
            <button
              type="button"
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget
                setOpenIndex(index)
              }}
              className="absolute inset-0 cursor-zoom-in focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              <span className="sr-only">{`Enlarge photo: ${shot.alt}`}</span>
            </button>
          </figure>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-50 flex flex-col bg-background p-4 md:p-8"
        >
          <div className="flex shrink-0 items-center justify-between gap-4">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">
              {`${(openIndex ?? 0) + 1} / ${shots.length}`}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="flex items-center gap-2 rounded-sm px-2 py-1 text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              Close
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/*
            The photo gets the full width at every size and the controls sit
            below it. Arrows flanking the image instead would shrink a 3:2 photo
            to a fraction of a phone's width while leaving the height unused.
          */}
          <figure className="flex min-h-0 flex-1 flex-col items-center gap-4 py-4">
            <div className="relative min-h-0 w-full flex-1">
              <Image
                key={active.src}
                src={active.src || '/placeholder.svg'}
                alt={active.alt}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>
            <figcaption className="max-w-2xl shrink-0 text-center text-sm leading-relaxed text-muted-foreground text-pretty">
              {active.alt}
            </figcaption>
          </figure>

          <div className="flex shrink-0 items-center justify-center gap-6">
            <LightboxArrow direction="previous" onClick={() => step(-1)} />
            <LightboxArrow direction="next" onClick={() => step(1)} />
          </div>
        </div>
      ) : null}
    </>
  )
}

function LightboxArrow({
  direction,
  onClick,
}: {
  direction: 'previous' | 'next'
  onClick: () => void
}) {
  const Icon = direction === 'next' ? ChevronRight : ChevronLeft

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none md:size-12"
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="sr-only">{`${direction === 'next' ? 'Next' : 'Previous'} photo`}</span>
    </button>
  )
}
