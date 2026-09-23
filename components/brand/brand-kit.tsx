'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { Download, Loader2 } from 'lucide-react'
import { InterlockingCircles } from '@/components/logo'
import { cn } from '@/lib/utils'

/** Brand ink values, mirrored from globals.css as portable hex so the exported
 * files carry the colour with them (no CSS variables in a standalone asset). */
const GOLD = '#DBB668'
const BONE = '#F4F0E6'
const INK = '#0E1014'

type Ink = 'gold' | 'bone' | 'ink'
const INK_HEX: Record<Ink, string> = { gold: GOLD, bone: BONE, ink: INK }

/** A single downloadable asset, registered by its card so the "Download all"
 * button can re-export every PNG and pull in every SVG in one pass. */
type AssetReg = {
  node: HTMLElement
  pngName: string
  pngBackground?: string
  svgHref?: string
  svgName?: string
}

async function nodeToPng(node: HTMLElement, backgroundColor?: string) {
  return toPng(node, { pixelRatio: 4, backgroundColor, cacheBust: true })
}

function triggerDownload(href: string, fileName: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = fileName
  a.click()
}

async function downloadPng(node: HTMLElement, fileName: string, backgroundColor?: string) {
  triggerDownload(await nodeToPng(node, backgroundColor), fileName)
}

/** The interlocking-circle mark, colour driven by `currentColor`. */
function Mark({ ink, className }: { ink: Ink; className?: string }) {
  return (
    <span style={{ color: INK_HEX[ink] }} className={cn('inline-flex', className)}>
      <InterlockingCircles strokeWidth={2} className="h-full w-auto" />
    </span>
  )
}

/** The signature horizontal wordmark: AMARA M⊙⊙N over the Hout Bay line. */
function Wordmark({
  ink,
  tagline = true,
  style,
}: {
  ink: Ink
  tagline?: boolean
  style?: CSSProperties
}) {
  return (
    <span
      style={{ color: INK_HEX[ink], ...style }}
      className="flex flex-col items-center leading-none"
    >
      <span className="flex items-center font-serif font-light uppercase tracking-[0.18em]">
        <span>Amara&nbsp;M</span>
        <InterlockingCircles strokeWidth={1} className="mx-[0.05em] h-[0.64em] w-auto" />
        <span>N</span>
      </span>
      {tagline ? (
        <span className="mt-[0.5em] font-sans text-[0.26em] uppercase tracking-[0.4em] opacity-75">
          Hout Bay
        </span>
      ) : null}
    </span>
  )
}

/** The stacked lockup: mark centred above the AMARA MOON wordmark. */
function StackedLockup({ ink }: { ink: Ink }) {
  return (
    <span
      style={{ color: INK_HEX[ink] }}
      className="flex flex-col items-center gap-5 leading-none"
    >
      <InterlockingCircles strokeWidth={2} className="h-14 w-auto" />
      <span className="flex flex-col items-center leading-none">
        <span className="font-serif text-4xl font-light uppercase tracking-[0.2em]">
          Amara&nbsp;Moon
        </span>
        <span className="mt-3 font-sans text-[0.62rem] uppercase tracking-[0.42em] opacity-75">
          Hout Bay
        </span>
      </span>
    </span>
  )
}

const CHECKER =
  'repeating-conic-gradient(#2a2d34 0% 25%, #232529 0% 50%) 50% / 22px 22px'

/** One downloadable asset: an artwork stage (light/checker/ink) plus buttons. */
function AssetCard({
  title,
  note,
  stage,
  children,
  pngName,
  pngBackground,
  svgHref,
  svgName,
  register,
}: {
  title: string
  note?: string
  stage: 'checker' | 'ink' | 'bone'
  children: ReactNode
  pngName: string
  pngBackground?: string
  svgHref?: string
  svgName?: string
  register?: (asset: AssetReg) => void
}) {
  const artRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (artRef.current) {
      register?.({ node: artRef.current, pngName, pngBackground, svgHref, svgName })
    }
  }, [register, pngName, pngBackground, svgHref, svgName])

  const stageStyle: CSSProperties =
    stage === 'ink'
      ? { backgroundColor: INK }
      : stage === 'bone'
        ? { backgroundColor: BONE }
        : { background: CHECKER }

  return (
    <figure className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div
        className="flex min-h-44 flex-1 items-center justify-center p-10"
        style={stageStyle}
      >
        <div ref={artRef} className="flex items-center justify-center p-2">
          {children}
        </div>
      </div>
      <figcaption className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <span className="min-w-0">
          <span className="block truncate font-sans text-sm text-foreground">{title}</span>
          {note ? (
            <span className="block truncate font-sans text-xs text-muted-foreground">{note}</span>
          ) : null}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {svgHref ? (
            <a
              href={svgHref}
              download={svgName}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-sans text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              SVG
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => artRef.current && downloadPng(artRef.current, pngName, pngBackground)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-sans text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            PNG
          </button>
        </span>
      </figcaption>
    </figure>
  )
}

function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-2xl text-foreground sm:text-3xl">{children}</h2>
      {sub ? <p className="mt-2 max-w-2xl font-sans text-sm text-muted-foreground">{sub}</p> : null}
    </div>
  )
}

const COLORS = [
  { name: 'Ink', hex: INK, oklch: 'oklch(0.15 0.012 265)', use: 'Background' },
  { name: 'Gold', hex: GOLD, oklch: 'oklch(0.79 0.105 85)', use: 'Logo, CTAs, rules' },
  { name: 'Bone', hex: BONE, oklch: 'oklch(0.95 0.008 85)', use: 'Text on ink' },
  { name: 'Moss', hex: '#33503F', oklch: 'oklch(0.34 0.045 155)', use: 'Secondary' },
]

export function BrandKit() {
  const [copied, setCopied] = useState<string | null>(null)
  const [zipping, setZipping] = useState(false)

  // Keyed by PNG filename so re-registration (e.g. font reflow) stays deduped.
  const registry = useRef<Map<string, AssetReg>>(new Map())
  const register = useCallback((asset: AssetReg) => {
    registry.current.set(asset.pngName, asset)
  }, [])

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value)
    setCopied(value)
    window.setTimeout(() => setCopied((c) => (c === value ? null : c)), 1200)
  }

  const downloadAll = useCallback(async () => {
    setZipping(true)
    try {
      const zip = new JSZip()
      const svg = zip.folder('svg')
      const png = zip.folder('png')
      const seenSvg = new Set<string>()

      for (const asset of registry.current.values()) {
        if (asset.svgHref && asset.svgName && !seenSvg.has(asset.svgName)) {
          seenSvg.add(asset.svgName)
          try {
            const res = await fetch(asset.svgHref)
            if (res.ok) svg?.file(asset.svgName, await res.text())
          } catch {
            // A missing SVG shouldn't abort the whole export.
          }
        }
        const dataUrl = await nodeToPng(asset.node, asset.pngBackground)
        png?.file(asset.pngName, dataUrl.split(',')[1], { base64: true })
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      triggerDownload(url, 'amara-moon-brand-kit.zip')
      URL.revokeObjectURL(url)
    } finally {
      setZipping(false)
    }
  }, [])

  return (
    <div className="space-y-16">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl font-sans text-sm text-muted-foreground">
          Grab a single asset from any card below, or take the whole set in one archive. The vector
          packet downloads instantly; the full kit also renders a high-resolution PNG of each lockup.
        </p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <a
            href="/brand/amara-moon-logo-packet.zip"
            download
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download vector packet
          </a>
          <button
            type="button"
            onClick={downloadAll}
            disabled={zipping}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 font-sans text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {zipping ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            {zipping ? 'Preparing ZIP…' : 'SVG + PNG kit'}
          </button>
        </div>
      </div>

      {/* The mark */}
      <section>
        <SectionTitle sub="Two interlocking rings — the “OO” of MOON. Use it on its own where the full name already appears nearby, as an app icon, or as a favicon. Keep the rings equal and never redraw the overlap.">
          The mark
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AssetCard
            title="Mark — Gold"
            note="On dark / photography"
            stage="checker"
            svgHref="/brand/amara-moon-mark-gold.svg"
            svgName="amara-moon-mark-gold.svg"
            pngName="amara-moon-mark-gold.png"
            register={register}
          >
            <Mark ink="gold" className="h-16" />
          </AssetCard>
          <AssetCard
            title="Mark — Bone"
            note="On dark / photography"
            stage="ink"
            svgHref="/brand/amara-moon-mark-bone.svg"
            svgName="amara-moon-mark-bone.svg"
            pngName="amara-moon-mark-bone.png"
            register={register}
          >
            <Mark ink="bone" className="h-16" />
          </AssetCard>
          <AssetCard
            title="Mark — Ink"
            note="On light backgrounds"
            stage="bone"
            svgHref="/brand/amara-moon-mark-ink.svg"
            svgName="amara-moon-mark-ink.svg"
            pngName="amara-moon-mark-ink.png"
            register={register}
          >
            <Mark ink="ink" className="h-16" />
          </AssetCard>
          <AssetCard
            title="Avatar — Gold on ink"
            note="Social / app icon"
            stage="checker"
            svgHref="/brand/amara-moon-avatar-gold-on-ink.svg"
            svgName="amara-moon-avatar-gold-on-ink.svg"
            pngName="amara-moon-avatar.png"
            register={register}
          >
            <span
              className="flex h-24 w-24 items-center justify-center rounded-[22%]"
              style={{ backgroundColor: INK }}
            >
              <Mark ink="gold" className="h-11" />
            </span>
          </AssetCard>
        </div>
      </section>

      {/* The wordmark */}
      <section>
        <SectionTitle sub="The primary lockup. The circles stand in for the “OO”, so the name always reads AMARA MOON in caps. PNG is baked from the live Cormorant Garamond type, so use PNG where the font may be missing.">
          The wordmark
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <AssetCard
            title="Wordmark — Gold on ink"
            stage="ink"
            pngName="amara-moon-wordmark-gold-on-ink.png"
            pngBackground={INK}
            register={register}
          >
            <Wordmark ink="gold" style={{ fontSize: 40 }} />
          </AssetCard>
          <AssetCard
            title="Wordmark — Bone on ink"
            stage="ink"
            pngName="amara-moon-wordmark-bone-on-ink.png"
            pngBackground={INK}
            register={register}
          >
            <Wordmark ink="bone" style={{ fontSize: 40 }} />
          </AssetCard>
          <AssetCard
            title="Wordmark — Gold, transparent"
            note="No tagline"
            stage="checker"
            pngName="amara-moon-wordmark-gold.png"
            register={register}
          >
            <Wordmark ink="gold" tagline={false} style={{ fontSize: 40 }} />
          </AssetCard>
          <AssetCard
            title="Wordmark — Ink on bone"
            stage="bone"
            pngName="amara-moon-wordmark-ink-on-bone.png"
            pngBackground={BONE}
            register={register}
          >
            <Wordmark ink="ink" style={{ fontSize: 40 }} />
          </AssetCard>
        </div>
      </section>

      {/* Stacked lockup */}
      <section>
        <SectionTitle sub="A centred, stacked alternative for tight or square placements — mark above the name.">
          Stacked lockup
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <AssetCard
            title="Stacked — Gold on ink"
            stage="ink"
            pngName="amara-moon-stacked-gold-on-ink.png"
            pngBackground={INK}
            register={register}
          >
            <StackedLockup ink="gold" />
          </AssetCard>
          <AssetCard
            title="Stacked — Bone on ink"
            stage="ink"
            pngName="amara-moon-stacked-bone-on-ink.png"
            pngBackground={INK}
            register={register}
          >
            <StackedLockup ink="bone" />
          </AssetCard>
        </div>
      </section>

      {/* Colours */}
      <section>
        <SectionTitle sub="Tap a value to copy it.">Colour</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COLORS.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="h-24" style={{ backgroundColor: c.hex }} />
              <div className="space-y-1.5 p-4">
                <p className="font-serif text-lg text-foreground">{c.name}</p>
                <p className="font-sans text-xs text-muted-foreground">{c.use}</p>
                <button
                  type="button"
                  onClick={() => copy(c.hex)}
                  className="block font-mono text-xs text-foreground transition-colors hover:text-primary"
                >
                  {copied === c.hex ? 'Copied' : c.hex}
                </button>
                <button
                  type="button"
                  onClick={() => copy(c.oklch)}
                  className="block text-left font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-primary"
                >
                  {copied === c.oklch ? 'Copied' : c.oklch}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage */}
      <section>
        <SectionTitle>Clear space &amp; usage</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <ul className="space-y-3 rounded-lg border border-border bg-card p-6 font-sans text-sm text-muted-foreground">
            <li className="text-foreground">Do</li>
            <li>Keep clear space around the mark equal to the height of one ring.</li>
            <li>Use gold on dark; ink on light. Keep strong contrast.</li>
            <li>Scale the mark and wordmark proportionally.</li>
          </ul>
          <ul className="space-y-3 rounded-lg border border-border bg-card p-6 font-sans text-sm text-muted-foreground">
            <li className="text-foreground">Don&apos;t</li>
            <li>Recolour the rings outside the palette or add effects.</li>
            <li>Stretch, rotate, or change the overlap of the circles.</li>
            <li>Set the name in another typeface or in mixed case.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
