import Link from 'next/link'
import type { ReactNode } from 'react'

export type HubKey =
  | 'electricity'
  | 'solar'
  | 'ac'
  | 'water'
  | 'gas'
  | 'financial'
  | 'appliance'
  | 'fuel'

/**
 * Literal class strings per hub — Tailwind's compiler only picks up classes
 * it can see as static text, so this must be a lookup table, not a template
 * string like `text-hub-${hub}`.
 */
export const HUB_CLASSES: Record<
  HubKey,
  { badgeBorder: string; badgeBg: string; badgeText: string; dot: string; statText: string }
> = {
  electricity: {
    badgeBorder: 'border-hub-electricity/30',
    badgeBg: 'bg-hub-electricity/10',
    badgeText: 'text-hub-electricity',
    dot: 'bg-hub-electricity',
    statText: 'text-hub-electricity',
  },
  solar: {
    badgeBorder: 'border-hub-solar/30',
    badgeBg: 'bg-hub-solar/10',
    badgeText: 'text-hub-solar',
    dot: 'bg-hub-solar',
    statText: 'text-hub-solar',
  },
  ac: {
    badgeBorder: 'border-hub-ac/30',
    badgeBg: 'bg-hub-ac/10',
    badgeText: 'text-hub-ac',
    dot: 'bg-hub-ac',
    statText: 'text-hub-ac',
  },
  water: {
    badgeBorder: 'border-hub-water/30',
    badgeBg: 'bg-hub-water/10',
    badgeText: 'text-hub-water',
    dot: 'bg-hub-water',
    statText: 'text-hub-water',
  },
  gas: {
    badgeBorder: 'border-hub-gas/30',
    badgeBg: 'bg-hub-gas/10',
    badgeText: 'text-hub-gas',
    dot: 'bg-hub-gas',
    statText: 'text-hub-gas',
  },
  financial: {
    badgeBorder: 'border-hub-financial/30',
    badgeBg: 'bg-hub-financial/10',
    badgeText: 'text-hub-financial',
    dot: 'bg-hub-financial',
    statText: 'text-hub-financial',
  },
  appliance: {
    badgeBorder: 'border-hub-appliance/30',
    badgeBg: 'bg-hub-appliance/10',
    badgeText: 'text-hub-appliance',
    dot: 'bg-hub-appliance',
    statText: 'text-hub-appliance',
  },
  fuel: {
    badgeBorder: 'border-hub-fuel/30',
    badgeBg: 'bg-hub-fuel/10',
    badgeText: 'text-hub-fuel',
    dot: 'bg-hub-fuel',
    statText: 'text-hub-fuel',
  },
}

export interface StatChip {
  icon: string
  big: string
  small: string
  /** 'hub' uses this hub's accent; 'brass'/'spark-teal'/'caution-amber'/'seal-red' use the fixed sitewide semantic tokens (never override these with a hub color). */
  tone?: 'hub' | 'brass' | 'spark-teal' | 'caution-amber' | 'seal-red'
}

export const TONE_TEXT: Record<Exclude<StatChip['tone'], 'hub' | undefined>, string> = {
  brass: 'text-brass',
  'spark-teal': 'text-spark-teal',
  'caution-amber': 'text-caution-amber',
  'seal-red': 'text-seal-red',
}

/**
 * Full-bleed dark split hero, matching the pattern proven on the Electricity
 * DISCOM pages: breadcrumb + badge + pitch + CTAs on the left, a result card
 * and stat strip on the right. The `hub` prop controls ONLY the badge/dot/
 * stat-icon accent color — primary CTAs stay brass and any savings figure
 * inside resultCard/statChips should use the spark-teal tone, never the hub
 * accent, so the sitewide "green means savings" rule holds on every hub.
 */
export default function SplitHero({
  hub,
  breadcrumb,
  badgeLabel,
  h1,
  tagline,
  subtitle,
  primaryCta,
  secondaryCta,
  resultCard,
  statChips,
}: {
  hub: HubKey
  breadcrumb: { label: string; href: string }[]
  badgeLabel: string
  h1: string
  tagline?: string
  subtitle: string
  primaryCta: { label: string; href: string; emoji?: string }
  secondaryCta?: { label: string; href: string }
  resultCard: ReactNode
  statChips?: StatChip[]
}) {
  const c = HUB_CLASSES[hub]

  return (
    <section className="relative overflow-hidden py-14 hero-gradient sm:py-16">
      <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/50">
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

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border ${c.badgeBorder} ${c.badgeBg} px-3 py-1 text-xs font-semibold ${c.badgeText}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} aria-hidden />
              {badgeLabel}
            </span>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {h1}
            </h1>
            {tagline && (
              <p className="mt-2 font-display text-xl font-extrabold tracking-tight text-brass sm:text-2xl">
                {tagline}
              </p>
            )}

            <p className="mt-4 max-w-xl text-lg text-white/70">{subtitle}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={primaryCta.href}
                className="flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brass/90"
              >
                {primaryCta.emoji && <span aria-hidden>{primaryCta.emoji}</span>}
                {primaryCta.label}
              </a>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {resultCard}

            {statChips && statChips.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {statChips.map((s) => (
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
                    <p className="text-[11px] tracking-wide text-white/50 uppercase">
                      {s.small}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
