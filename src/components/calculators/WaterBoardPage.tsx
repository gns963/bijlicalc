import Link from 'next/link'
import WaterBoardBillCalculator from '@/components/calculators/WaterBoardBillCalculator'
import SplitHero from '@/components/SplitHero'
import { computeWaterBill, getWaterTariff } from '@/lib/calc/water'
import { formatINR, formatIsoDate } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'

export default function WaterBoardPage({ boardCode, slug }: { boardCode: string; slug: string }) {
  const tariff = getWaterTariff(boardCode)
  const path = `/water/${slug}`
  const defaultMeter = Object.keys(tariff.fixedChargeByMeterSize)[0]
  const topRate = tariff.slabs[tariff.slabs.length - 1].ratePerKL
  const freeKl = tariff.freeAllowance?.kl

  const underExample = freeKl != null ? computeWaterBill(tariff, { consumptionKl: freeKl }) : null
  const overExample = freeKl != null ? computeWaterBill(tariff, { consumptionKl: freeKl + 1 }) : null
  const heroExample = underExample ?? computeWaterBill(tariff, { consumptionKl: 15 })

  const faqs = [
    {
      q: `How is my ${tariff.boardCode} water bill calculated?`,
      a: `Your KL (kilolitre) consumption is priced through ${tariff.boardName}'s slab rates, plus a sewerage charge (${tariff.sewerageChargePercent}% of the water charge) and a fixed charge based on your connection's meter size.`,
    },
    ...(freeKl != null
      ? [
          {
            q: `What happens if I use even 1 litre more than ${freeKl},000 litres?`,
            a: `${tariff.boardCode}'s free allowance is all-or-nothing, not a true exemption: stay at or under ${freeKl} KL and your water charge is ₹0. Cross it by even 1 litre and your ENTIRE consumption — not just the amount above ${freeKl} KL — becomes billable at slab rates. See the two worked examples below for exactly how large that jump is.`,
          },
        ]
      : []),
    {
      q: 'What is the sewerage charge on my water bill?',
      a: `It's a charge for wastewater treatment and disposal, billed as a percentage of your water (volumetric) charge — currently ${tariff.sewerageChargePercent}% for ${tariff.boardCode}. If your water charge is waived, the sewerage charge is too, since it's calculated off that base.`,
    },
    {
      q: 'Does my meter size affect my fixed charge?',
      a: `Yes — ${tariff.boardCode} charges a different flat fixed charge depending on your connection's meter size (${Object.keys(tariff.fixedChargeByMeterSize).join(', ')}), regardless of how much water you use.`,
    },
    {
      q: `Is ${tariff.boardCode}'s free water scheme different from other cities?`,
      a: freeKl != null
        ? `Yes — not every Indian city offers a free consumption threshold, and among those that do, the "all-or-nothing" cliff-edge design (as opposed to a true allowance that only exempts the first block) isn't universal. Always check your own board's specific rules rather than assuming another city's scheme applies.`
        : `Free-water schemes vary significantly by city and board — check your own board's current rules rather than assuming another city's scheme applies here.`,
    },
    {
      q: 'How can I reduce my water bill?',
      a: freeKl != null
        ? `The single biggest lever here is staying at or under the ${freeKl} KL free threshold if you're close to it — crossing it costs far more than the extra litres alone would suggest, because the whole bill becomes payable. Beyond that: fix dripping taps and running cisterns promptly, and consider low-flow fixtures.`
        : 'Fix dripping taps and running cisterns promptly (a slow drip can waste hundreds of litres a month), and consider low-flow fixtures for showers and taps.',
    },
    {
      q: 'Is piped water cheaper than tanker or jar delivery?',
      a: 'Almost always yes, by a wide margin, when piped supply is reliable — tanker and jar water carry a large delivery/packaging premium per litre. See the comparison below for typical ranges; tanker and jar prices vary a lot by city, so check local rates for an exact comparison.',
    },
    {
      q: 'What is a KL and how do I read my meter?',
      a: 'A kilolitre (KL) = 1,000 litres, the standard billing unit for metered water supply in India. Most water meters display a running total in KL or cubic metres (the same unit) on a small odometer-style or digital display — subtract your previous reading from your current one to find your period\'s consumption.',
    },
    {
      q: `How do I check or pay my ${tariff.boardCode} bill online?`,
      a: `${tariff.boardName} provides an online customer portal for checking consumption history, viewing bills and paying online — check their official website for the current portal link, since these occasionally change.`,
    },
    {
      q: 'How often is this tariff data verified?',
      a: `We date every tariff figure with an effective-from and last-verified date (shown below) and cite the source. ${tariff.verifiedBy}`,
    },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${tariff.boardName} Water Bill Calculator`,
    url: `${SITE}${path}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    areaServed: tariff.citiesServed,
  }
  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${tariff.boardName} domestic water tariff`,
    description: `Municipal water tariff for ${tariff.boardName}, effective ${tariff.effectiveFrom}.`,
    url: `${SITE}${path}#tariff-table`,
    dateModified: tariff.lastVerified,
    license: tariff.sourceUrl,
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: tariff.sourceUrl },
    ],
  }
  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '' },
    { name: 'Water', path: '/water' },
    { name: tariff.boardName, path },
  ])

  return (
    <>
      <SplitHero
        hub="water"
        breadcrumb={[
          { label: 'Water', href: '/water' },
          { label: tariff.boardCode, href: path },
        ]}
        badgeLabel={`${tariff.citiesServed[0]} · ${tariff.boardCode} · ${tariff.billingCycle} billing`}
        h1={`${tariff.boardName} (${tariff.boardCode}) Bill Calculator`}
        subtitle={`Estimate your ${tariff.boardCode} water bill using their real domestic tariff — not a self-entered rate. Covers ${tariff.citiesServed.slice(0, 3).join(', ')}.`}
        primaryCta={{ label: `Calculate My ${tariff.boardCode} Bill`, href: '#calculator', emoji: '💧' }}
        secondaryCta={{ label: 'All water calculators →', href: '/water' }}
        statChips={[
          { icon: '💧', big: `₹${topRate.toFixed(2)}`, small: 'Top slab ₹/KL', tone: 'hub' },
          { icon: '📅', big: tariff.billingCycle === 'bimonthly' ? 'Bi-monthly' : 'Monthly', small: 'Billing', tone: 'hub' },
          freeKl != null
            ? { icon: '🎁', big: `${freeKl} KL`, small: 'Free (all-or-nothing)', tone: 'hub' }
            : { icon: '➕', big: formatINR(tariff.fixedChargeByMeterSize[defaultMeter]), small: 'Fixed charge', tone: 'hub' },
          { icon: '✓', big: formatIsoDate(tariff.lastVerified), small: 'Verified', tone: 'seal-red' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
              <span aria-hidden>💧</span> Worked example
            </p>
            <p className="mt-2 text-sm text-white/70">
              {freeKl != null ? `${freeKl} KL` : '15 KL'} on {tariff.boardCode}&apos;s tariff costs about
            </p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums text-white">
              {formatINR(heroExample.total)}
              <span className="ml-1 text-sm font-normal text-white/50">
                /{tariff.billingCycle === 'bimonthly' ? 'cycle' : 'month'}
              </span>
            </p>
            {heroExample.freeAllowanceApplied && (
              <p className="mt-2 text-xs text-spark-teal">
                Within the free allowance — only the fixed charge applies.
              </p>
            )}
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
          <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
            Calculate your {tariff.boardCode} bill
          </h2>
          <WaterBoardBillCalculator boardCode={tariff.boardCode} boardName={tariff.boardName} />
        </section>

        {freeKl != null && (
          <section
            aria-labelledby="free-rule"
            className="mb-10 scroll-mt-20 rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5"
          >
            <h2 id="free-rule" className="font-display mb-2 text-xl font-bold text-ink-navy dark:text-gazette-cream">
              Understanding the {freeKl} KL free rule
            </h2>
            <p className="text-sm text-ash/80 dark:text-gazette-cream/70">
              This is <strong>not</strong> a true allowance where only your
              first {freeKl} KL is free and the rest is billed normally.
              It&apos;s all-or-nothing: stay at or under {freeKl} KL and your
              water charge is ₹0. Use even 1 litre more, and your{' '}
              <strong>entire</strong> consumption — including the first{' '}
              {freeKl} KL — becomes billable at slab rates. This cliff-edge
              design is a common point of confusion, so budget accordingly if
              your usage is close to the threshold.
            </p>
          </section>
        )}

        <section aria-labelledby="tariff-table" className="mb-10 scroll-mt-20">
          <h2 id="tariff-table" className="font-display mb-4 text-2xl font-semibold">
            {tariff.boardCode} domestic water tariff
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
                <tr>
                  <th className="px-4 py-2 font-semibold">Slab (KL)</th>
                  <th className="px-4 py-2 text-right font-semibold">Rate (₹/KL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline dark:divide-white/10">
                {tariff.slabs.map((s, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{s.minKL}–{s.maxKL ?? 'above'}</td>
                    <td className="px-4 py-2 text-right tabular-nums">₹{s.ratePerKL.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-mist text-ash/70 dark:bg-slate-800 dark:text-gazette-cream/70">
                <tr>
                  <td className="px-4 py-2">Sewerage charge</td>
                  <td className="px-4 py-2 text-right tabular-nums">{tariff.sewerageChargePercent}% of water charge</td>
                </tr>
                {Object.entries(tariff.fixedChargeByMeterSize).map(([size, amt]) => (
                  <tr key={size}>
                    <td className="px-4 py-2">Fixed charge ({size} meter)</td>
                    <td className="px-4 py-2 text-right tabular-nums">{formatINR(amt)}/cycle</td>
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
          <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
            Effective from {formatIsoDate(tariff.effectiveFrom)} · Verified{' '}
            {formatIsoDate(tariff.lastVerified)} ·{' '}
            <a
              href={tariff.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass underline"
            >
              source
            </a>
            . <strong>{tariff.verifiedBy}</strong>
          </p>
        </section>

        {underExample && overExample && (
          <section aria-labelledby="worked-examples" className="mb-10 scroll-mt-20">
            <h2 id="worked-examples" className="font-display mb-4 text-2xl font-semibold">
              Two worked examples — just under vs just over the threshold
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-spark-teal/25 bg-spark-teal/5 p-5">
                <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
                  {freeKl} KL — at the free threshold
                </p>
                <p className="font-display mt-1 text-2xl font-bold tabular-nums text-spark-teal">
                  {formatINR(underExample.total)}
                </p>
                <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
                  Water charge waived · only the fixed charge applies
                </p>
              </div>
              <div className="rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5">
                <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
                  {(freeKl ?? 0) + 1} KL — just 1 KL over
                </p>
                <p className="font-display mt-1 text-2xl font-bold tabular-nums text-caution-amber">
                  {formatINR(overExample.total)}
                </p>
                <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
                  Full consumption billed · {formatINR(overExample.waterCharge)} water + {formatINR(overExample.sewerageCharge)} sewerage
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
              A single extra litre pushes the bill from{' '}
              {formatINR(underExample.total)} to {formatINR(overExample.total)}{' '}
              — the all-or-nothing rule in action.
            </p>
          </section>
        )}

        <section aria-labelledby="charges-explained" className="mb-10 scroll-mt-20">
          <h2 id="charges-explained" className="font-display mb-2 text-2xl font-semibold">
            Sewerage &amp; fixed charges explained
          </h2>
          <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
            <p>
              <strong>Sewerage charge.</strong> A wastewater treatment and
              disposal fee, billed as {tariff.sewerageChargePercent}% of your
              water (volumetric) charge — it scales with usage the same way
              the water charge does, and is waived alongside it if your
              water charge is ₹0.
            </p>
            <p>
              <strong>Fixed charge.</strong> A flat amount per billing cycle
              based on your connection&apos;s meter size, charged regardless
              of usage — it covers the cost of maintaining your connection
              and meter infrastructure.
            </p>
          </div>
        </section>

        <section aria-labelledby="tanker" className="mb-10 scroll-mt-20">
          <h2 id="tanker" className="font-display mb-2 text-2xl font-semibold">
            Piped water vs tanker/jar delivery
          </h2>
          <p className="text-ash/80 dark:text-gazette-cream/70">
            Piped municipal supply is almost always dramatically cheaper per
            litre than tanker or 20L jar delivery, when it&apos;s reliably
            available. As a rough sense of scale: a private water tanker
            (typically 5,000-10,000 litres) commonly costs somewhere in the{' '}
            <strong>₹500-1,500</strong> range in many Indian cities, and a
            20L branded jar commonly runs <strong>₹40-80</strong> — both
            figures vary a lot by city and season, so check local rates for
            an exact comparison. Either way, that works out to many times
            more per litre than metered piped water, even after sewerage
            and fixed charges.
          </p>
        </section>

        <section aria-labelledby="related" className="mb-10 scroll-mt-20">
          <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
            Related calculators
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/water"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-water/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>🗺️</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                All water calculators
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                Browse every state we cover.
              </p>
            </Link>
            <Link
              href="/appliances/water-tank-filling-time-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>🚰</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Water tank fill time
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                How long your tank takes to fill.
              </p>
            </Link>
            <Link
              href="/gas/igl"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>🔥</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Gas bill calculator
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                Same real-tariff approach for PNG.
              </p>
            </Link>
            <Link
              href="/electricity"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>⚡</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Electricity bill calculators
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                Real DISCOM tariffs for all 36 states.
              </p>
            </Link>
          </div>
        </section>

        <section aria-labelledby="faq" className="mb-10 scroll-mt-20">
          <h2 id="faq" className="font-display mb-4 text-2xl font-semibold">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-hairline dark:divide-white/10">
            {faqs.map((f, i) => (
              <details key={i} className="group py-3">
                <summary className="cursor-pointer list-none font-medium text-ash marker:hidden dark:text-gazette-cream">
                  {f.q}
                </summary>
                <p className="mt-2 text-ash/70 dark:text-gazette-cream/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-seal-red/30 bg-seal-red/5 px-2.5 py-1 text-xs font-semibold text-seal-red">
              <span aria-hidden>⦿</span> Verified {formatIsoDate(tariff.lastVerified)}
            </span>
            <span className="text-xs text-ash/50 dark:text-gazette-cream/40">
              Effective from {formatIsoDate(tariff.effectiveFrom)}
            </span>
          </div>
          <p className="mt-3 text-sm text-ash/70 dark:text-gazette-cream/60">
            Source:{' '}
            <a
              href={tariff.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass underline"
            >
              {tariff.boardName} tariff notification
            </a>
          </p>
          <p className="mt-1 text-xs text-ash/50 dark:text-gazette-cream/40">{tariff.verifiedBy}</p>
        </footer>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      </main>
    </>
  )
}
