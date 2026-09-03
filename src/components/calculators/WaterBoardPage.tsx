import Link from 'next/link'
import WaterBoardBillCalculator from '@/components/calculators/WaterBoardBillCalculator'
import SplitHero from '@/components/SplitHero'
import PipedVsTankerComparison from '@/components/water/PipedVsTankerComparison'
import WaterBoardComparisonTable from '@/components/water/WaterBoardComparisonTable'
import WaterConsumptionReferenceTable from '@/components/water/WaterConsumptionReferenceTable'
import WaterFormulaBlock from '@/components/water/WaterFormulaBlock'
import WaterNeighborDiagnostic from '@/components/water/WaterNeighborDiagnostic'
import WaterHouseholdConsumptionTable from '@/components/water/WaterHouseholdConsumptionTable'
import WaterSampleCalculations from '@/components/water/WaterSampleCalculations'
import { getWaterBoardFacts } from '@/data/water-board-facts'
import waterBoardsJson from '@/data/water-boards.json'
import { computeWaterBill, getWaterTariff, waterTariffRegistry } from '@/lib/calc/water'
import { formatINR, formatIsoDate } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

/** Every board with a real tariff file — used for the honest multi-board
 *  comparison. Only DJB/CMWSSB exist today; more join as we verify them. */
const REAL_TARIFF_BOARD_CODES = Object.keys(waterTariffRegistry)

export default function WaterBoardPage({ boardCode, slug }: { boardCode: string; slug: string }) {
  const tariff = getWaterTariff(boardCode)
  const path = `/water/${slug}`
  const defaultMeter = Object.keys(tariff.fixedChargeByMeterSize)[0]
  const topRate = tariff.slabs[tariff.slabs.length - 1].ratePerKL
  const freeKl = tariff.freeAllowance?.kl

  const underExample = freeKl != null ? computeWaterBill(tariff, { consumptionKl: freeKl }) : null
  const overExample = freeKl != null ? computeWaterBill(tariff, { consumptionKl: freeKl + 1 }) : null
  const heroExample = underExample ?? computeWaterBill(tariff, { consumptionKl: 15 })

  const facts = getWaterBoardFacts(boardCode)
  const otherBoards = waterBoardsJson.boards.filter((b) => b.slug !== slug).slice(0, 3)
  const hasMultiBoardComparison = REAL_TARIFF_BOARD_CODES.length > 1
  const comparisonKl = 15

  // Real entry-slab rate spread and sewerage-charge spread across every
  // board we've sourced — used in the "why calculators are wrong" section
  // instead of an invented claim.
  const allTariffs = REAL_TARIFF_BOARD_CODES.map((code) => getWaterTariff(code))
  const cheapestEntry = [...allTariffs].sort((a, b) => a.slabs[0].ratePerKL - b.slabs[0].ratePerKL)[0]
  const priciestEntry = [...allTariffs].sort((a, b) => b.slabs[0].ratePerKL - a.slabs[0].ratePerKL)[0]
  const hasRateSpread = cheapestEntry && priciestEntry && cheapestEntry.boardCode !== priciestEntry.boardCode
  const cyclesDiffer = allTariffs.some((t) => t.billingCycle !== tariff.billingCycle)

  const faqs = [
    {
      q: `How is my ${tariff.boardCode} water bill calculated?`,
      a: `Your KL (kilolitre) consumption is priced through ${tariff.boardName}'s slab rates, plus a sewerage charge (${tariff.sewerageChargePercent}% of the water charge) and a fixed charge based on your connection's meter size.`,
    },
    ...(freeKl != null
      ? [
          {
            q: `What happens if I use even 1 litre more than ${freeKl},000 litres?`,
            a: `${tariff.boardCode}'s free allowance is all-or-nothing, not a true exemption: stay at or under ${freeKl} KL and your water charge is ₹0. Cross it by even 1 litre and your ENTIRE consumption — not just the amount above ${freeKl} KL — becomes billable at slab rates. See the worked examples above for exactly how large that jump is.`,
          },
        ]
      : [
          {
            q: `Does ${tariff.boardCode} offer any free consumption threshold?`,
            a: `Not currently, as far as we've verified — ${tariff.boardCode} bills from the first KL at slab rates, with a flat minimum charge per connection. Some other Indian boards (like Delhi) do offer a free-consumption scheme; always check your own board's specific rules.`,
          },
        ]),
    {
      q: 'What is the sewerage charge on my water bill?',
      a: `It's a charge for wastewater treatment and disposal, billed as a percentage of your water (volumetric) charge — currently ${tariff.sewerageChargePercent}% for ${tariff.boardCode}. If your water charge is waived, the sewerage charge is too, since it's calculated off that base.`,
    },
    {
      q: 'Does my meter size affect my fixed charge?',
      a: `Yes — ${tariff.boardCode} charges a different flat fixed charge depending on your connection's meter size (${Object.keys(tariff.fixedChargeByMeterSize).join(', ')}), regardless of how much water you use.`,
    },
    {
      q: 'How can I reduce my water bill?',
      a: `See the "Tips to reduce your ${tariff.boardCode} water bill" section above for the full list — the short version: fix leaks promptly, install low-flow fixtures, and${freeKl != null ? ` stay at or under the ${freeKl} KL free threshold if you're close to it.` : ' every KL saved lowers your bill directly, since billing here is fully volumetric.'}`,
    },
    {
      q: 'Is piped water cheaper than tanker or jar delivery?',
      a: 'Almost always yes, by a wide margin, when piped supply is reliable — use the piped-vs-tanker-vs-jar comparison above with your own local tanker and jar prices for an exact, computed answer rather than a generic claim.',
    },
    {
      q: 'What is a KL and how do I read my meter?',
      a: 'A kilolitre (KL) = 1,000 litres, the standard billing unit for metered water supply in India. Most water meters display a running total in KL or cubic metres (the same unit) on a small odometer-style or digital display — subtract your previous reading from your current one to find your period\'s consumption.',
    },
    {
      q: `How do I check or pay my ${tariff.boardCode} bill online?`,
      a: facts
        ? `Use the ${facts.paymentPortal.name} (${facts.paymentPortal.url})${facts.app ? `, or the ${facts.app.name} app — ${facts.app.note}` : ''}. ${facts.helpline ? `For complaints or issues: ${facts.helpline}.` : ''}`
        : `${tariff.boardName} provides an online customer portal for checking consumption history, viewing bills and paying online — check their official website for the current portal link, since these occasionally change.`,
    },
    ...(facts
      ? [
          {
            q: `Is ${tariff.boardCode} tap water safe to drink?`,
            a: facts.qualityNote,
          },
          {
            q: `Where does my ${tariff.boardCode} water actually come from?`,
            a: facts.waterSources,
          },
        ]
      : []),
    ...(facts?.meteringCaveat
      ? [
          {
            q: `Does this calculator apply to my connection if I don't have a working meter?`,
            a: facts.meteringCaveat,
          },
        ]
      : []),
    {
      q: 'Paani ka bill kitna aata hai mahine mein?',
      a: `For a typical household using around 15 KL a month, expect roughly ${formatINR(computeWaterBill(tariff, { consumptionKl: 15 * (tariff.billingCycle === 'bimonthly' ? 2 : 1) }).monthlyEquivalent?.total ?? computeWaterBill(tariff, { consumptionKl: 15 }).total)} on ${tariff.boardCode}'s real tariff — your actual bill depends on household size and your board's own rate. Use the calculator above for your specific number.`,
    },
    {
      q: 'Paani ka meter reading kaise padhein?',
      a: 'Your water meter shows a running total in KL (or cubic metres, the same unit) on a small digital or odometer-style display — note the current reading, subtract your previous bill\'s reading, and the difference is your billing period\'s consumption in KL.',
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
    description: `Municipal water tariff for ${tariff.boardName}, effective ${tariff.effectiveFrom} — also underlies the per-board comparison and consumption reference tables on this page.`,
    url: `${SITE}${path}#tariff-table`,
    dateModified: tariff.lastVerified,
    license: tariff.sourceUrl,
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: tariff.sourceUrl },
    ],
  }
  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to calculate your ${tariff.boardCode} water bill`,
    step: [
      { '@type': 'HowToStep', position: 1, text: `Find your KL consumption from your meter or last bill.` },
      { '@type': 'HowToStep', position: 2, text: 'Note your connection\'s meter size, if you know it.' },
      { '@type': 'HowToStep', position: 3, text: 'Enter both into the calculator above.' },
      { '@type': 'HowToStep', position: 4, text: 'Get your itemised bill — water charge, sewerage and fixed charge.' },
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

        <section aria-labelledby="how-to" className="mb-10 scroll-mt-20">
          <h2 id="how-to" className="font-display mb-4 text-2xl font-semibold">
            How to calculate your {tariff.boardCode} water bill
          </h2>
          <ol className="space-y-3">
            {[
              'Find your KL consumption from your meter or last bill.',
              'Note your connection\'s meter size, if you know it.',
              'Enter both into the calculator above.',
              'Get your itemised bill — water charge, sewerage and fixed charge.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hub-water font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-ash/80">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="features" className="mb-10 scroll-mt-20">
          <h2 id="features" className="font-display mb-4 text-2xl font-semibold">
            {tariff.boardCode} water bill calculator — key features
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '📋', title: 'Real, dated tariff', body: `${tariff.boardCode}'s actual published slab rates, not a national average.` },
              { icon: '📏', title: 'Meter-size aware', body: 'Fixed charge adjusts to your connection\'s meter size, where it varies.' },
              { icon: '🚿', title: 'Sewerage charge included', body: 'Computed as a real percentage of your water charge, not skipped.' },
              { icon: '📶', title: 'Telescopic slabs', body: 'Each KL band priced at its own rate, exactly as billed.' },
              { icon: '🗓️', title: 'Correct billing cycle', body: `Monthly-equivalent shown alongside the real ${tariff.billingCycle} total.` },
              { icon: '🧾', title: 'Itemised breakdown', body: 'Water charge, sewerage and fixed charge shown separately, never bundled.' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-hairline bg-paper p-5">
                <span className="text-2xl" aria-hidden>{f.icon}</span>
                <p className="font-display mt-2 font-bold text-ink-navy">{f.title}</p>
                <p className="mt-1 text-sm text-ash/70">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="reference" className="mb-10 scroll-mt-20">
          <h2 id="reference" className="font-display mb-2 text-2xl font-semibold">
            Water consumption — quick reference table
          </h2>
          <WaterConsumptionReferenceTable />
        </section>

        {freeKl != null && (
          <section
            aria-labelledby="free-rule"
            className="mb-10 scroll-mt-20 rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5"
          >
            <h2 id="free-rule" className="font-display mb-2 text-xl font-bold text-ink-navy">
              Understanding the {freeKl} KL free rule
            </h2>
            <p className="text-sm text-ash/80">
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

        <section aria-labelledby="wrong" className="mb-10 scroll-mt-20">
          <h2 id="wrong" className="font-display mb-4 text-2xl font-semibold">
            Why most water bill calculators are wrong
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="font-display font-bold text-ink-navy">
                They use a flat, generic rate
              </p>
              <p className="mt-1 text-sm text-ash/70">
                Most water calculators ask you to type in your own per-KL
                rate, or apply one assumed national figure. Real municipal
                water tariffs vary a lot by board
                {hasRateSpread ? (
                  <>
                    {' '}
                    — as of today, {cheapestEntry.boardCode}&apos;s entry
                    slab is {formatINR(cheapestEntry.slabs[0].ratePerKL)}/KL
                    while {priciestEntry.boardCode}&apos;s is{' '}
                    {formatINR(priciestEntry.slabs[0].ratePerKL)}/KL,
                    computed live from our own tariff files, not invented for
                    this page.
                  </>
                ) : (
                  '.'
                )}
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="font-display font-bold text-ink-navy">
                They skip the sewerage charge
              </p>
              <p className="mt-1 text-sm text-ash/70">
                Many quick calculators price only the volumetric water
                charge and drop the sewerage charge entirely — and because
                it&apos;s a percentage of the water charge (as high as{' '}
                {Math.max(...allTariffs.map((t) => t.sewerageChargePercent))}%
                on some boards we&apos;ve verified), skipping it can
                understate the real bill substantially, not just by a small
                flat amount.
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="font-display font-bold text-ink-navy">
                They ignore billing-cycle differences
              </p>
              <p className="mt-1 text-sm text-ash/70">
                {cyclesDiffer
                  ? 'Some boards bill monthly and others bi-monthly — a generic calculator that assumes one cycle for every city will misstate your real bill by up to 2×.'
                  : `${tariff.boardCode} bills ${tariff.billingCycle}, and generic calculators often assume a single cycle for every city.`}{' '}
                We always show the monthly-equivalent figure alongside the
                real cycle total, so you can compare fairly across boards.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="formula" className="mb-10 scroll-mt-20">
          <h2 id="formula" className="font-display mb-4 text-2xl font-semibold">
            The correct water billing formula
          </h2>
          <WaterFormulaBlock boardCode={tariff.boardCode} />
        </section>

        <section aria-labelledby="tariff-table" className="mb-10 scroll-mt-20">
          <h2 id="tariff-table" className="font-display mb-4 text-2xl font-semibold">
            {tariff.boardCode} domestic water tariff
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Slab (KL)</th>
                  <th className="px-4 py-2 text-right font-semibold">Rate (₹/KL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {tariff.slabs.map((s, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{s.minKL}–{s.maxKL ?? 'above'}</td>
                    <td className="px-4 py-2 text-right tabular-nums">₹{s.ratePerKL.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-mist text-ash/70">
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
          <p className="mt-2 text-xs text-ash/50">
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

        <section aria-labelledby="about-board" className="mb-10 scroll-mt-20">
          <h2 id="about-board" className="font-display mb-2 text-2xl font-semibold">
            About {tariff.boardName}
          </h2>
          <div className="space-y-3 text-ash/80">
            <p>
              {tariff.boardName} ({tariff.boardCode}) is the civic body
              responsible for piped water supply and sewerage services across{' '}
              {tariff.citiesServed.join(', ')}. Like every municipal water
              board in India, it sets and revises its own domestic tariff —
              the slab rates, sewerage charge and fixed charges shown above
              are theirs, sourced and dated as shown on the tariff table.
            </p>
            {facts && (
              <>
                <p>
                  <strong>Where your water comes from.</strong> {facts.waterSources}{' '}
                  <a href={facts.sourcesCitation} target="_blank" rel="noopener noreferrer" className="text-brass underline">
                    Source
                  </a>
                  .
                </p>
                <p>
                  <strong>Water quality.</strong> {facts.qualityNote}
                </p>
                {facts.meteringCaveat && (
                  <p className="rounded-lg border border-caution-amber/25 bg-caution-amber/5 p-3 text-sm">
                    <strong>Metering status:</strong> {facts.meteringCaveat}
                  </p>
                )}
                <p>
                  <strong>Paying your bill.</strong> {tariff.boardCode} runs an
                  online portal — the{' '}
                  <a href={facts.paymentPortal.url} target="_blank" rel="noopener noreferrer" className="text-brass underline">
                    {facts.paymentPortal.name}
                  </a>
                  {facts.app && (
                    <> — plus the <strong>{facts.app.name}</strong> app, {facts.app.note}.</>
                  )}
                  {facts.helpline && (
                    <> For complaints or questions: {facts.helpline}.</>
                  )}
                </p>
              </>
            )}
            <p className="rounded-lg border border-caution-amber/25 bg-caution-amber/5 p-3 text-sm">
              <strong>Independence disclaimer:</strong> DesiMetrics is an
              independent calculator and is <strong>not affiliated with,
              endorsed by, or operated by</strong> {tariff.boardName} or any
              government body. Figures here are estimates for planning
              purposes only — your official bill from {tariff.boardCode}{' '}
              is the authoritative source. Always cross-check against your
              actual bill or {tariff.boardCode}&apos;s own portal for billing
              or payment purposes.
            </p>
          </div>
        </section>

        <section aria-labelledby="household" className="mb-10 scroll-mt-20">
          <h2 id="household" className="font-display mb-2 text-2xl font-semibold">
            Estimated bill by household size
          </h2>
          <p className="mb-4 text-sm text-ash/60">
            A relatable starting point if you don&apos;t have a meter reading
            handy yet — computed through {tariff.boardCode}&apos;s real
            tariff, using a common per-person usage benchmark.
          </p>
          <WaterHouseholdConsumptionTable tariff={tariff} />
        </section>

        <section aria-labelledby="samples" className="mb-10 scroll-mt-20">
          <h2 id="samples" className="font-display mb-2 text-2xl font-semibold">
            Sample {tariff.boardCode} water bill calculations
          </h2>
          <p className="mb-4 text-sm text-ash/60">
            A spread of common consumption levels, computed live through{' '}
            {tariff.boardCode}&apos;s real tariff — the same engine as the
            calculator above, not restated numbers.
          </p>
          <WaterSampleCalculations tariff={tariff} />
        </section>

        {underExample && overExample && (
          <section aria-labelledby="worked-examples" className="mb-10 scroll-mt-20">
            <h2 id="worked-examples" className="font-display mb-4 text-2xl font-semibold">
              Two worked examples — just under vs just over the threshold
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-spark-teal/25 bg-spark-teal/5 p-5">
                <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase">
                  {freeKl} KL — at the free threshold
                </p>
                <p className="font-display mt-1 text-2xl font-bold tabular-nums text-spark-teal">
                  {formatINR(underExample.total)}
                </p>
                <p className="mt-1 text-sm text-ash/60">
                  Water charge waived · only the fixed charge applies
                </p>
              </div>
              <div className="rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5">
                <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase">
                  {(freeKl ?? 0) + 1} KL — just 1 KL over
                </p>
                <p className="font-display mt-1 text-2xl font-bold tabular-nums text-caution-amber">
                  {formatINR(overExample.total)}
                </p>
                <p className="mt-1 text-sm text-ash/60">
                  Full consumption billed · {formatINR(overExample.waterCharge)} water + {formatINR(overExample.sewerageCharge)} sewerage
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-ash/50">
              A single extra litre pushes the bill from{' '}
              {formatINR(underExample.total)} to {formatINR(overExample.total)}{' '}
              — the all-or-nothing rule in action.
            </p>
          </section>
        )}

        {hasMultiBoardComparison && (
          <section aria-labelledby="board-comparison" className="mb-10 scroll-mt-20">
            <h2 id="board-comparison" className="font-display mb-2 text-2xl font-semibold">
              How per-board billing changes your water bill
            </h2>
            <p className="mb-4 text-sm text-ash/60">
              The exact same <strong>{comparisonKl} KL</strong> — priced at
              each board&apos;s real tariff, computed live by this
              calculator&apos;s own engine. We only compare boards with a
              source-verified tariff on file, so this list grows as we add
              more:
            </p>
            <WaterBoardComparisonTable consumptionKl={comparisonKl} boardCodes={REAL_TARIFF_BOARD_CODES} />
          </section>
        )}

        <section aria-labelledby="neighbor" className="mb-10 scroll-mt-20">
          <h2 id="neighbor" className="font-display mb-4 text-2xl font-semibold">
            Why your water bill might be higher than your neighbor&apos;s
          </h2>
          <WaterNeighborDiagnostic />
        </section>

        <section aria-labelledby="charges-explained" className="mb-10 scroll-mt-20">
          <h2 id="charges-explained" className="font-display mb-4 text-2xl font-semibold">
            {tariff.boardCode} water bill components explained
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Component</th>
                  <th className="px-4 py-2 font-semibold">Charge type</th>
                  <th className="px-4 py-2 font-semibold">What it is</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="px-4 py-2 font-medium">Water charge</td>
                  <td className="px-4 py-2 text-ash/60">Telescopic, per KL</td>
                  <td className="px-4 py-2 text-ash/70">
                    Your metered consumption priced through {tariff.boardCode}&apos;s slab rates.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Sewerage charge</td>
                  <td className="px-4 py-2 text-ash/60">{tariff.sewerageChargePercent}% of water charge</td>
                  <td className="px-4 py-2 text-ash/70">
                    Wastewater treatment and disposal fee — scales with usage, waived alongside the water charge if that&apos;s ₹0.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Fixed charge</td>
                  <td className="px-4 py-2 text-ash/60">Flat, per cycle</td>
                  <td className="px-4 py-2 text-ash/70">
                    Covers connection and meter maintenance, charged regardless of usage — varies by meter size where {tariff.boardCode} tiers it.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="tips" className="mb-10 scroll-mt-20">
          <h2 id="tips" className="font-display mb-4 text-2xl font-semibold">
            Tips to reduce your {tariff.boardCode} water bill
          </h2>
          <ul className="space-y-2.5 text-ash/80">
            {[
              freeKl != null
                ? `Stay at or under the ${freeKl} KL free threshold if you're close to it — crossing it costs far more than the extra litres alone, since the whole bill becomes payable.`
                : 'Every KL you save lowers your bill directly, since billing here is fully volumetric with no free allowance.',
              'Fix dripping taps and running cisterns promptly — a slow drip can waste hundreds of litres a month unnoticed.',
              'Install low-flow fixtures on showers and taps for a real, ongoing reduction in consumption.',
              'Run washing machines and dishwashers full, not half-full, to get more use per KL billed.',
              'Check for a leak downstream of your meter if your bill jumps with no real change in usage.',
              'Compare your bill against the reference table above to see if your consumption is unusually high for your household size.',
            ].map((tip, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-0.5 text-hub-water" aria-hidden>✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tanker" className="mb-10 scroll-mt-20">
          <h2 id="tanker" className="font-display mb-2 text-2xl font-semibold">
            Piped water vs tanker/jar delivery
          </h2>
          <p className="mb-4 text-sm text-ash/60">
            A real numeric comparison, not a guess — priced at{' '}
            {tariff.boardCode}&apos;s actual tariff against your own local
            tanker and jar prices.
          </p>
          <PipedVsTankerComparison boardCode={tariff.boardCode} />
        </section>

        <section aria-labelledby="landscape" className="mb-10 scroll-mt-20">
          <h2 id="landscape" className="font-display mb-2 text-2xl font-semibold">
            How municipal water tariffs are actually set
          </h2>
          <p className="text-ash/80">
            Unlike electricity (state electricity regulatory commissions) or
            gas (the PNGRB), there&apos;s no single central regulator that
            sets municipal water tariffs in India — each municipal
            corporation or water board sets and revises its own domestic
            tariff independently, sometimes with state urban-development
            department oversight. That&apos;s exactly why {tariff.boardCode}
            &apos;s structure can look completely different from another
            city&apos;s — different slab counts, different free-allowance
            rules, different billing cycles — and why finding a verifiable,
            consistently-published rate for every board is genuinely harder
            than it is for electricity or gas. We only publish a board here
            once we can cite a specific, dated source for it; see the
            citation on the tariff table above.
          </p>
        </section>

        <section aria-labelledby="ecosystem" className="mb-10 scroll-mt-20">
          <h2 id="ecosystem" className="font-display mb-4 text-2xl font-semibold">
            Your utility ecosystem
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/appliances/water-tank-filling-time-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>🚰</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Water tank fill time
              </p>
              <p className="mt-1 text-xs text-ash/60">
                How long your tank takes to fill.
              </p>
            </Link>
            <Link
              href="/electricity"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>⚡</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Electricity bill calculators
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Real DISCOM tariffs for all 36 states.
              </p>
            </Link>
            <Link
              href="/gas"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>🔥</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Gas bill calculator
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Same real-tariff approach for PNG.
              </p>
            </Link>
            <Link
              href="/appliances/household-bill-builder"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>🔌</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Household bill builder
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Add every appliance, see your combined electricity bill.
              </p>
            </Link>
            <Link
              href="/ac"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>❄️</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                AC running cost
              </p>
              <p className="mt-1 text-xs text-ash/60">
                What your AC adds to your electricity bill.
              </p>
            </Link>
            <Link
              href="/fuel-cost"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-fuel/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>⛽</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Fuel cost calculators
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Petrol/diesel, LPG cylinder and generator cost.
              </p>
            </Link>
            <Link
              href="/financial"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-financial/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>🧮</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Financial calculators
              </p>
              <p className="mt-1 text-xs text-ash/60">
                GST, SIP, gratuity and tax-regime maths.
              </p>
            </Link>
            {otherBoards.map((b) => (
              <Link
                key={b.slug}
                href={`/water/${b.slug}`}
                className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-water/50 hover:shadow-sm"
              >
                <span className="text-xl" aria-hidden>🗺️</span>
                <p className="font-display mt-2 font-bold text-ink-navy">
                  {b.name}
                </p>
                <p className="mt-1 text-xs text-ash/60">
                  {b.hasTariffFile ? `Water bill calculator for ${b.name}.` : 'Coming soon.'}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="guides" className="mb-10 scroll-mt-20">
          <h2 id="guides" className="font-display mb-4 text-2xl font-semibold">
            Related guides: understand your water bill
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="#reference"
              className="rounded-xl border border-hairline bg-paper p-4 text-sm font-semibold text-ink-navy transition hover:border-hub-water/50 hover:shadow-sm"
            >
              How KL billing units work →
            </a>
            <a
              href="#charges-explained"
              className="rounded-xl border border-hairline bg-paper p-4 text-sm font-semibold text-ink-navy transition hover:border-hub-water/50 hover:shadow-sm"
            >
              Water bill components explained →
            </a>
            <a
              href="#tips"
              className="rounded-xl border border-hairline bg-paper p-4 text-sm font-semibold text-ink-navy transition hover:border-hub-water/50 hover:shadow-sm"
            >
              Tips to reduce your bill →
            </a>
            <Link
              href="/water"
              className="rounded-xl border border-hairline bg-paper p-4 text-sm font-semibold text-ink-navy transition hover:border-hub-water/50 hover:shadow-sm"
            >
              Browse all water calculators →
            </Link>
          </div>
          <p className="mt-2 text-xs text-ash/50">
            Standalone deep-dive guides on connection process and metering
            are on our roadmap — for now, each of these jumps to the
            relevant section on this page.
          </p>
        </section>

        <section aria-labelledby="faq" className="mb-10 scroll-mt-20">
          <h2 id="faq" className="font-display mb-4 text-2xl font-semibold">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-hairline">
            {faqs.map((f, i) => (
              <details key={i} className="group py-3">
                <summary className="cursor-pointer list-none font-medium text-ash marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-ash/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="rounded-xl border border-hairline bg-paper p-5">
          <p className="font-display mb-3 font-bold text-ink-navy">
            Official reference &amp; regulator details
          </p>
          <dl className="mb-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ash/50">Utility provider</dt>
              <dd className="text-ink-navy">{tariff.boardName} ({tariff.boardCode})</dd>
            </div>
            <div>
              <dt className="text-ash/50">Jurisdiction / cities served</dt>
              <dd className="text-ink-navy">{tariff.citiesServed.join(', ')}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-seal-red/30 bg-seal-red/5 px-2.5 py-1 text-xs font-semibold text-seal-red">
              <span aria-hidden>⦿</span> Verified {formatIsoDate(tariff.lastVerified)}
            </span>
            <span className="text-xs text-ash/50">
              Effective from {formatIsoDate(tariff.effectiveFrom)}
            </span>
          </div>
          <p className="mt-3 text-sm text-ash/70">
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
          <p className="mt-1 text-xs text-ash/50">{tariff.verifiedBy}</p>
          <p className="mt-3 border-t border-hairline pt-3 text-xs text-ash/50">
            DesiMetrics is an independent calculator, not affiliated with,
            endorsed by, or operated by {tariff.boardName} or any government
            body. Estimates are for planning purposes only — always verify
            against your official bill.
          </p>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      </main>
    </>
  )
}
