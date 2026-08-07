import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  intro?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({ eyebrow, title, intro, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      {eyebrow ? (
        <span className="tracking-widest-xs font-sans text-xs uppercase text-primary">{eyebrow}</span>
      ) : null}
      <h2 className="font-serif text-3xl leading-tight text-balance text-foreground sm:text-4xl md:text-5xl">{title}</h2>
      {intro ? (
        <p className={cn("max-w-2xl font-sans text-base leading-relaxed text-pretty text-muted-foreground")}>{intro}</p>
      ) : null}
    </div>
  )
}

/** Thin gold hairline used to separate major sections. */
export function GoldRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-gradient-to-r from-primary/40 to-transparent", className)} />
}
