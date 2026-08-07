import Image from 'next/image'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  intro?: string
  image?: string
  imageAlt?: string
}

/**
 * Interior page masthead. When an image is supplied it sits behind the title
 * at low opacity so pages feel connected to the place without competing with
 * the copy the way a full hero would.
 */
export function PageHeader({ eyebrow, title, intro, image, imageAlt }: PageHeaderProps) {
  return (
    // `bg-background` is required: the backdrop image sits at -z-10, so without
    // an opaque background on the header itself it renders behind the page and
    // later sections bleed through it.
    <header className="relative isolate overflow-hidden border-b border-border bg-background">
      {image ? (
        <>
          <Image
            src={image || '/placeholder.svg'}
            alt={imageAlt ?? ''}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover opacity-25"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/85 to-background"
          />
        </>
      ) : null}

      {/* Top padding must clear the fixed 80px (h-20) site header, which
          overlays page content so the home hero can sit under it. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 pb-14 pt-28 md:pb-20 md:pt-36">
        {eyebrow ? (
          <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">{eyebrow}</span>
        ) : null}
        <h1 className="max-w-3xl font-serif text-4xl leading-[1.05] text-balance text-foreground sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="max-w-2xl font-sans text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {intro}
          </p>
        ) : null}
      </div>
    </header>
  )
}
