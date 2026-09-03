import Link from 'next/link'
import type { CSSProperties } from 'react'
import LeadGenForm from '@/components/LeadGenForm'
import QuickBillEstimate from '@/components/QuickBillEstimate'
import { stateNameFor } from '@/data/state-names-i18n'
import {
  buildQuickEstimateDiscoms,
  buildStateAvailability,
  cheapestRates,
  HUB_STRUCTURE,
  priciestRates,
  tickerData,
  verifiedDate,
  type HomeTexts,
} from '@/lib/homeShared'
import { itemListLd } from '@/lib/seo'

/** Renders any locale's homepage from its HomeTexts — the JSX/layout is
 *  shared verbatim with the English homepage (src/app/page.tsx), which is
 *  kept as its own file rather than routed through here, since it's the
 *  flagship page and safest left untouched. */
export default function HomePageView({ texts }: { texts: HomeTexts }) {
  const stateAvailability = buildStateAvailability(texts.locale)
  const quickEstimateDiscoms = buildQuickEstimateDiscoms()
  const tickerFacts = texts.tickerFacts(tickerData)

  const hubs = HUB_STRUCTURE.map((structure, i) => {
    const t = texts.hubTexts[i]
    return {
      ...structure,
      title: t.title,
      description: t.description,
      countLabel: t.countLabel,
      badge: t.badge,
      exploreSuffix: t.exploreSuffix,
      tools: t.toolLabels.map((label, j) => ({ label, href: structure.toolHrefs[j] })),
    }
  })

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: texts.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const hubsItemList = itemListLd(hubs.map((h) => ({ name: h.title, path: h.explore })))

  const heroStatValues: [string, string][] = [
    [`${tickerData.totalStateCount}`, texts.heroStatLabels[0]],
    ['200+', texts.heroStatLabels[1]],
    ['100%', texts.heroStatLabels[2]],
    ['SERC', texts.heroStatLabels[3]],
  ]

  const scattered: { big: string; small: string; style: CSSProperties }[] = [
    { big: heroStatValues[0][0], small: heroStatValues[0][1], style: { top: '9%', left: '4%', '--tilt': '-7deg', animationDuration: '7.5s', animationDelay: '0s' } as CSSProperties },
    { big: heroStatValues[1][0], small: heroStatValues[1][1], style: { top: '24%', right: '6%', '--tilt': '5deg', animationDuration: '8.5s', animationDelay: '1.1s' } as CSSProperties },
    { big: heroStatValues[2][0], small: heroStatValues[2][1], style: { top: '58%', left: '9%', '--tilt': '4deg', animationDuration: '6.5s', animationDelay: '0.6s' } as CSSProperties },
    { big: heroStatValues[3][0], small: heroStatValues[3][1], style: { top: '70%', right: '3%', '--tilt': '-5deg', animationDuration: '7.8s', animationDelay: '1.8s' } as CSSProperties },
  ]

  return (
    <>
      <main lang={texts.locale}>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative -mt-16 overflow-hidden pt-16 hero-gradient">
          <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-4 py-6 text-center lg:py-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-spark-teal/40 bg-spark-teal/10 px-3 py-1 text-xs font-semibold text-spark-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-teal" aria-hidden />
              {texts.badge}
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
              {texts.h1}
            </h1>
            <p className="mt-2 font-display text-xl font-extrabold text-brass sm:text-3xl">
              {texts.subhead}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
              {texts.paragraph}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/electricity"
                className="rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brass/90"
              >
                {texts.ctaElectricity}
              </Link>
              <Link
                href="#tools"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white/50"
              >
                {texts.ctaExploreAll}
                <span aria-hidden className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px]">
                  →
                </span>
              </Link>
            </div>

            <div className="mx-auto mt-4 max-w-md text-left">
              <QuickBillEstimate discoms={quickEstimateDiscoms} labels={texts.quickEstimateLabels} />
            </div>

            <div className="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4 xl:hidden">
              {heroStatValues.map(([big, small]) => (
                <div key={small} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center">
                  <p className="font-display text-lg font-extrabold text-brass">{big}</p>
                  <p className="mt-0.5 text-xs leading-tight text-white/50">{small}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden xl:block">
            {scattered.map(({ big, small, style }) => (
              <div key={small} style={style} className="hero-float-chip absolute rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center">
                <p className="font-display text-lg font-extrabold text-brass">{big}</p>
                <p className="mt-0.5 text-xs leading-tight text-white/50">{small}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden border-y border-white/10 bg-black/20 py-2">
            <div className="ticker-track flex w-max gap-10 text-sm text-white/70">
              {[...tickerFacts, ...tickerFacts].map((fact, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden />
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- Tool grid */}
        <section id="tools" aria-labelledby="tools-h" className="bg-gazette-cream">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                {texts.toolsEyebrow}
              </span>
              <h2 id="tools-h" className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy">
                {texts.toolsH2}
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hubs.map((h) => (
                <div key={h.key} className={`relative flex flex-col rounded-2xl border border-hairline bg-paper p-6 text-center transition hover:shadow-lg ${h.cardBorder}`}>
                  {h.badge && (
                    <span className={`absolute top-4 right-4 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${h.chipBg}`}>
                      {h.badge}
                    </span>
                  )}
                  <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${h.chipBg}`}>
                    {h.emoji}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink-navy">{h.title}</h3>
                  <p className={`mt-0.5 font-display text-sm font-bold ${h.accent}`}>
                    {h.count > 0 ? `${h.count} ${h.countLabel}` : h.countLabel}
                  </p>
                  <p className="mt-1 text-xs text-ash/60">{h.description}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-left text-sm">
                    {h.tools.map((t) => (
                      <li key={t.label}>
                        <Link href={t.href} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-ash hover:bg-mist">
                          {t.label}
                          <span className={h.accent}>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={h.explore} className={`mt-4 text-sm font-semibold ${h.accent}`}>
                    {h.title} {h.exploreSuffix}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Real rate comparison */}
        <section aria-labelledby="rate-compare" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
              {texts.rateCompareEyebrow}
            </span>
            <h2 id="rate-compare" className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy">
              {texts.rateCompareH2}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-ash/70">{texts.rateCompareSub}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-spark-teal/25 bg-spark-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-spark-teal">
                {texts.cheapestLabel}
              </p>
              <ul className="mt-4 space-y-3">
                {cheapestRates.map((r) => (
                  <li key={r.code}>
                    <Link href={r.href} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/60">
                      <span className="text-sm font-medium text-ink-navy">
                        {stateNameFor(texts.locale, r.state)}
                        <span className="text-ash/50"> ({r.code})</span>
                      </span>
                      <span className="font-display font-bold tabular-nums text-spark-teal">
                        ₹{r.topRate.toFixed(2)}{texts.perUnitSuffix}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-caution-amber/25 bg-caution-amber/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-caution-amber">
                {texts.priciestLabel}
              </p>
              <ul className="mt-4 space-y-3">
                {priciestRates.map((r) => (
                  <li key={r.code}>
                    <Link href={r.href} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/60">
                      <span className="text-sm font-medium text-ink-navy">
                        {stateNameFor(texts.locale, r.state)} <span className="text-ash/50">({r.code})</span>
                      </span>
                      <span className="font-display font-bold tabular-nums text-caution-amber">
                        ₹{r.topRate.toFixed(2)}{texts.perUnitSuffix}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- State grid */}
        <section aria-labelledby="states" className="bg-gazette-cream px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                {texts.statesEyebrow}
              </span>
              <h2 id="states" className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy">
                {texts.statesH2}
              </h2>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {stateAvailability.map((s) => {
                const label = s.discoms.map((d) => d.code).join(' / ')
                return s.available ? (
                  <li key={s.name}>
                    <Link href={s.href} className="flex h-full flex-col rounded-xl border border-hairline bg-paper p-4 transition hover:border-brass hover:shadow-sm">
                      <span className="font-semibold text-ink-navy">{s.nameLocalized}</span>
                      <span className="mt-1 text-xs text-brass">{label}</span>
                    </Link>
                  </li>
                ) : (
                  <li key={s.name} title={texts.comingSoonLabel} className="cursor-not-allowed rounded-xl border border-hairline bg-mist p-4 opacity-60">
                    <span className="font-medium text-ash/60">{s.nameLocalized}</span>
                    <span className="mt-1 block text-xs text-ash/40">{texts.comingSoonLabel}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- Solar lead-gen */}
        <section id="solar-leadgen" className="relative overflow-hidden hero-gradient">
          <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
            <div className="text-white">
              <span className="text-xs font-semibold tracking-[0.2em] text-spark-teal uppercase">
                {texts.solarEyebrow}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {texts.solarH2}
              </h2>
              <p className="mt-4 max-w-md text-white/70">{texts.solarParagraph}</p>
              <ul className="mt-5 space-y-1.5 text-sm text-white/70">
                {texts.solarBullets.map((b) => (
                  <li key={b}>✓ {b}</li>
                ))}
              </ul>
            </div>
            <div>
              <LeadGenForm
                source={`homepage-solar-block-${texts.locale}`}
                tone="glass"
                heading={texts.leadGenHeading}
                subheading={texts.leadGenSubheading}
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- How we verify */}
        <section className="bg-gazette-cream">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                {texts.verifyEyebrow}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy">
                {texts.verifyH2}
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {texts.verifySteps.map((s, i) => (
                <div key={i} className="relative rounded-2xl border border-hairline bg-paper p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass font-display text-lg font-bold text-white">
                      {i + 1}
                    </span>
                    {i === 2 && (
                      <span className="ml-auto flex items-center gap-1.5 rounded-full border border-seal-red/40 px-2.5 py-1 text-xs font-semibold text-seal-red">
                        ⦿ {texts.verifiedPrefix} {verifiedDate}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink-navy">{s.title}</h3>
                  <p className="mt-1 text-sm text-ash/80">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/methodology" className="text-sm font-semibold text-brass hover:underline">
                {texts.methodologyLink}
              </Link>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- FAQ */}
        <section aria-labelledby="home-faq" className="border-t border-hairline bg-gazette-cream">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 id="home-faq" className="text-center font-display text-3xl font-extrabold tracking-tight text-ink-navy">
              {texts.faqH2}
            </h2>
            <div className="mt-8 divide-y divide-hairline">
              {texts.faqs.map((f, i) => (
                <details key={i} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink-navy">
                    {f.q}
                    <span className="ml-4 text-brass transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-ash/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubsItemList) }} />
    </>
  )
}
