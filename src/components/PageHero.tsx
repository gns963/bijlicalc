import Link from 'next/link'
import type { ReactNode } from 'react'
import { HUB_CLASSES, TONE_TEXT, type HubKey, type StatChip } from './SplitHero'

/**
 * Single-column dark hero for content/tool pages that don't need SplitHero's
 * result-card column (single AC brand, solar/unit-price state pages, and
 * every calculator/hub page that used to render a plain light page-header).
 * Same hero-gradient/pill/glass language as the homepage and SplitHero.
 */
export default function PageHero({
  hub,
  breadcrumb,
  badgeLabel,
  h1,
  subtitle,
  stats,
}: {
  hub: HubKey
  breadcrumb: { label: string; href: string }[]
  badgeLabel: ReactNode
  h1: ReactNode
  subtitle: ReactNode
  stats?: StatChip[]
}) {
  const c = HUB_CLASSES[hub]

  return (
    <section className="relative overflow-hidden py-14 hero-gradient sm:py-16">
      <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-brass">
                Home
              </Link>
            </li>
            {breadcrumb.map((b) => (
              <li key={b.href} className="flex items-center gap-1.5">
                <span aria-hidden>/</span>
                <Link href={b.href} className="hover:text-brass">
                  {b.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border ${c.badgeBorder} ${c.badgeBg} px-3 py-1 text-xs font-semibold ${c.badgeText}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} aria-hidden />
          {badgeLabel}
        </span>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {h1}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/70">{subtitle}</p>

        {stats && stats.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.small}
                className="rounded-xl border border-white/15 bg-white/[0.07] px-3 py-3 text-center backdrop-blur-md"
              >
                <span className="text-lg" aria-hidden>
                  {s.icon}
                </span>
                <p
                  className={`mt-1 font-display text-lg font-bold tabular-nums ${
                    !s.tone || s.tone === 'hub' ? c.statText : TONE_TEXT[s.tone]
                  }`}
                >
                  {s.big}
                </p>
                <p className="text-[11px] tracking-wide text-white/50 uppercase">{s.small}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
