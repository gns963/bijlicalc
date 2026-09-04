import Link from 'next/link'
import GasCgdBillCalculator from '@/components/calculators/GasCgdBillCalculator'
import PngVsLpgComparison from '@/components/calculators/PngVsLpgComparison'
import GasCgdComparisonTable from '@/components/gas/GasCgdComparisonTable'
import GasConsumptionReferenceTable from '@/components/gas/GasConsumptionReferenceTable'
import GasFormulaBlock from '@/components/gas/GasFormulaBlock'
import GasNeighborDiagnostic from '@/components/gas/GasNeighborDiagnostic'
import SplitHero from '@/components/SplitHero'
import { GAS_COMPANIES } from '@/data/gas-companies'
import { computeGasBill, getGasTariff, gasTariffRegistry } from '@/lib/calc/gas'
import { formatINR, formatIsoDate } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

/** Every CGD with a real tariff file — used for the honest multi-provider
 *  comparison. Only IGL/MNGL/GGL exist today; more join as we verify them. */
const REAL_TARIFF_CGD_CODES = Object.keys(gasTariffRegistry)

export default function GasCgdPage({ cgdCode, slug }: { cgdCode: string; slug: string }) {
  const tariff = getGasTariff(cgdCode)
  const path = `/gas/${slug}`
  const topRate = tariff.slabs[tariff.slabs.length - 1].ratePerSCM

  const lowExample = computeGasBill(tariff, { scmConsumed: 20 })
  const highExample = computeGasBill(tariff, { scmConsumed: 80 })
  const heroExample = lowExample

  const otherCgds = GAS_COMPANIES.filter((c) => c.slug !== slug).slice(0, 3)
  const hasMultiCgdComparison = REAL_TARIFF_CGD_CODES.length > 1

  const tocLabel = tariff.billingCycle === 'bimonthly' ? '~60 days' : '~30 days'

  // Real rate spread across every CGD we've sourced — used in the "why most
  // calculators are wrong" section instead of an invented claim.
  const allRates = REAL_TARIFF_CGD_CODES.map((code) => getGasTariff(code))
  const cheapestTariff = [...allRates].sort((a, b) => a.slabs[0].ratePerSCM - b.slabs[0].ratePerSCM)[0]
  const priciestTariff = [...allRates].sort((a, b) => b.slabs[0].ratePerSCM - a.slabs[0].ratePerSCM)[0]
  const rateSpreadPercent =
    cheapestTariff && priciestTariff && cheapestTariff.cgdCode !== priciestTariff.cgdCode
      ? Math.round(
          ((priciestTariff.slabs[0].ratePerSCM - cheapestTariff.slabs[0].ratePerSCM) /
            cheapestTariff.slabs[0].ratePerSCM) *
            100,
        )
      : null

  const faqs = [
    {
      q: `How is my ${tariff.cgdName} bill calculated?`,
      a: `Your SCM (standard cubic metre) consumption is multiplied by ${tariff.cgdName}'s current per-SCM rate, plus a flat fixed/meter charge for the billing cycle. ${tariff.cgdCode} does not use telescopic slabs for domestic PNG — every SCM is billed at the same rate. See the full formula breakdown above.`,
    },
    {
      q: 'What is an SCM and how much cooking does it represent?',
      a: 'A Standard Cubic Metre (SCM) is the billing unit for piped natural gas, roughly equivalent to one day of standard cooking (two meals) for an average family on a typical domestic burner — a useful mental benchmark, not an exact figure since actual usage varies by household size and cooking habits.',
    },
    {
      q: `Why is my ${tariff.cgdCode} bill bi-monthly instead of monthly?`,
      a: `${tariff.cgdCode} bills every ${tocLabel === '~60 days' ? 'two months' : 'month'}, so the SCM figure and total you see cover that whole period — don't compare it directly to a single LPG cylinder's cost without accounting for the longer period. Use the monthly-equivalent figure the calculator shows for a fair comparison.`,
    },
    {
      q: 'Is PNG cheaper than LPG cylinders?',
      a: 'It depends on your consumption and local LPG price — use the PNG vs LPG comparison below with your own numbers rather than assuming either is always cheaper. PNG generally has a lower per-unit-energy cost but no cylinder-delivery hassle either way, while LPG doesn\'t require a fixed pipeline connection.',
    },
    {
      q: 'Why does my gas bill increase in winter?',
      a: 'Colder months bring more stovetop cooking time and, in homes that have one, more use of a gas geyser for hot water — both add SCM consumption. A 10-15% seasonal bump over your summer baseline is common and not a sign of a leak or meter fault by itself.',
    },
    {
      q: 'Gas ka bill kitna aata hai ek normal ghar mein?',
      a: `For an average household cooking two meals a day, expect somewhere around 40-60 SCM per bi-monthly cycle — on ${tariff.cgdCode}'s real rate that works out to roughly ${formatINR(computeGasBill(tariff, { scmConsumed: 50 }).total)} for the cycle (about ${formatINR(computeGasBill(tariff, { scmConsumed: 50 }).monthlyEquivalent?.total ?? computeGasBill(tariff, { scmConsumed: 50 }).total)}/month). Your actual bill depends on household size and cooking habits — use the calculator above for your own numbers.`,
    },
    {
      q: 'PNG aur LPG mein kya farak hai?',
      a: 'PNG (piped natural gas) arrives continuously through an underground pipeline connection and is billed by metered SCM consumption, with no cylinder to book or store. LPG (liquefied petroleum gas) comes in a physical cylinder you book, collect or have delivered, and pay for upfront per cylinder — see our PNG vs LPG comparison below for the actual cost difference at your usage.',
    },
    {
      q: 'What is the fixed charge on my PNG bill for?',
      a: 'It covers the CGD\'s cost of maintaining the pipeline connection, meter and billing infrastructure to your home — charged regardless of how much gas you actually use that cycle, similar to an electricity connection\'s fixed/demand charge.',
    },
    {
      q: `How do I check or pay my ${tariff.cgdCode} bill online?`,
      a: `${tariff.cgdName} provides an online customer portal and mobile app for checking consumption history, viewing bills and paying online — check their official website for the current portal link, since these occasionally change.`,
    },
    {
      q: "How often is this calculator's tariff data verified?",
      a: `We date every tariff figure with an effective-from and last-verified date, shown in the tariff table above and the footer of this page, and cite the source. ${tariff.cgdCode}'s rate was last verified ${formatIsoDate(tariff.lastVerified)} — check that date against your own recent bill, since a rate change between our last verification and today wouldn't yet be reflected here.`,
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
    name: `${tariff.cgdName} Gas Bill Calculator`,
    url: `${SITE}${path}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    areaServed: tariff.citiesServed,
  }
  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${tariff.cgdName} domestic PNG tariff`,
    description: `Piped natural gas (PNG) domestic tariff for ${tariff.cgdName}, effective ${tariff.effectiveFrom} — also underlies the per-CGD comparison and consumption reference tables on this page.`,
    url: `${SITE}${path}#tariff-table`,
    dateModified: tariff.lastVerified,
    creator: { '@type': 'Organization', name: 'DesiMetrics', url: SITE },
    license: tariff.sourceUrl,
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: tariff.sourceUrl },
    ],
  }
  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to calculate your ${tariff.cgdCode} PNG gas bill`,
    step: [
      { '@type': 'HowToStep', position: 1, text: `Select ${tariff.cgdCode} as your CGD/provider.` },
      { '@type': 'HowToStep', position: 2, text: 'Enter your SCM consumption from your meter or last bill.' },
      { '@type': 'HowToStep', position: 3, text: 'Choose your connection type, if applicable.' },
      { '@type': 'HowToStep', position: 4, text: 'Get your itemised bill — gas charge, fixed charge and total.' },
    ],
  }
  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '' },
    { name: 'Gas', path: '/gas' },
    { name: tariff.cgdName, path },
  ])

  return (
    <>
      <SplitHero
        hub="gas"
        breadcrumb={[
          { label: 'Gas', href: '/gas' },
          { label: tariff.cgdCode, href: path },
        ]}
        badgeLabel={`${tariff.citiesServed[0]} · ${tariff.cgdCode} · ${tariff.billingCycle} billing`}
        h1={`${tariff.cgdName} (${tariff.cgdCode}) PNG Gas Bill Calculator`}
        subtitle={`Estimate your monthly ${tariff.cgdCode} piped natural gas (PNG) bill using their real domestic tariff — not a self-entered rate. Covers ${tariff.citiesServed.slice(0, 3).join(', ')}${tariff.citiesServed.length > 3 ? ' and more' : ''}, billed ${tariff.billingCycle}.`}
        primaryCta={{ label: `Calculate My ${tariff.cgdCode} Bill`, href: '#calculator', emoji: '🔥' }}
        secondaryCta={{ label: 'All gas providers →', href: '/gas' }}
        statChips={[
          { icon: '🔥', big: `${formatINR(topRate)}`, small: 'Rate per SCM', tone: 'hub' },
          { icon: '📅', big: tariff.billingCycle === 'bimonthly' ? 'Bi-monthly' : 'Monthly', small: 'Billing', tone: 'hub' },
          { icon: '➕', big: 'Free', small: 'No login', tone: 'hub' },
          { icon: '✓', big: formatIsoDate(tariff.lastVerified), small: 'Verified', tone: 'seal-red' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
              <span aria-hidden>🔥</span> Worked example
            </p>
            <p className="mt-2 text-sm text-white/70">
              20 SCM on {tariff.cgdCode}&apos;s tariff costs about
            </p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums text-white">
              {formatINR(heroExample.total)}
              <span className="ml-1 text-sm font-normal text-white/50">
                /{tariff.billingCycle === 'bimonthly' ? 'cycle' : 'month'}
              </span>
            </p>
            {heroExample.monthlyEquivalent && (
              <p className="mt-2 text-xs text-white/50">
                ≈ {formatINR(heroExample.monthlyEquivalent.total)}/month equivalent
              </p>
            )}
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
          <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
            Calculate your {tariff.cgdCode} bill
          </h2>
          <GasCgdBillCalculator cgdCode={tariff.cgdCode} cgdName={tariff.cgdName} />
        </section>

        <section aria-labelledby="how-to" className="mb-10 scroll-mt-20">
          <h2 id="how-to" className="font-display mb-4 text-2xl font-semibold">
            How to calculate your {tariff.cgdCode} PNG gas bill
          </h2>
          <ol className="space-y-3">
            {[
              `Select ${tariff.cgdCode} as your CGD/provider.`,
              'Enter your SCM consumption from your meter or last bill.',
              'Choose your connection type, if applicable.',
              'Get your itemised bill — gas charge, fixed charge and total.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hub-gas font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-ash/80">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="reference" className="mb-10 scroll-mt-20">
          <h2 id="reference" className="font-display mb-2 text-2xl font-semibold">
            PNG consumption — quick reference table
          </h2>
          <GasConsumptionReferenceTable />
        </section>

        <section aria-labelledby="scm" className="mb-10 scroll-mt-20">
          <h2 id="scm" className="font-display mb-2 text-2xl font-semibold">
            Understanding SCM units
          </h2>
          <p className="text-ash/80">
            A <strong>Standard Cubic Metre (SCM)</strong> is the billing unit
            for piped natural gas — roughly one day of standard cooking (two
            meals) for an average family on a typical domestic burner. It is
            a useful mental benchmark, not an exact conversion: actual usage
            varies with household size, cooking style and burner efficiency.
          </p>
        </section>

        <section aria-labelledby="billing-cycle" className="mb-10 scroll-mt-20">
          <h2 id="billing-cycle" className="font-display mb-2 text-2xl font-semibold">
            Why your {tariff.cgdCode} bill covers {tocLabel}
          </h2>
          <p className="text-ash/80">
            {tariff.cgdCode} bills{' '}
            {tariff.billingCycle === 'bimonthly' ? 'every two months' : 'every month'}
            , so the SCM figure and total on your bill represent that whole
            period — not a single month. Don&apos;t compare a bi-monthly PNG
            total directly against one LPG cylinder&apos;s cost; use the
            monthly-equivalent figure the calculator shows above for a fair,
            like-for-like comparison.
          </p>
        </section>

        <section aria-labelledby="wrong" className="mb-10 scroll-mt-20">
          <h2 id="wrong" className="font-display mb-4 text-2xl font-semibold">
            Why most gas bill calculators are wrong in 2026
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="font-display font-bold text-ink-navy">
                They use a flat, generic rate
              </p>
              <p className="mt-1 text-sm text-ash/70">
                Most gas calculators ask you to type in your own per-SCM rate,
                or quietly apply one national-average figure. Real PNG tariffs
                vary a lot by CGD
                {rateSpreadPercent !== null && cheapestTariff && priciestTariff ? (
                  <>
                    {' '}
                    — as of today, {cheapestTariff.cgdCode} charges{' '}
                    {formatINR(cheapestTariff.slabs[0].ratePerSCM)}/SCM while{' '}
                    {priciestTariff.cgdCode} charges{' '}
                    {formatINR(priciestTariff.slabs[0].ratePerSCM)}/SCM — a{' '}
                    {rateSpreadPercent}% difference for the exact same
                    consumption, computed live from our own tariff files, not
                    invented for this page.
                  </>
                ) : (
                  '.'
                )}
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="font-display font-bold text-ink-navy">
                They ignore bi-monthly billing confusion
              </p>
              <p className="mt-1 text-sm text-ash/70">
                Most PNG connections bill every two months, but generic
                calculators present the total as if it were a monthly figure —
                leaving users thinking their gas bill just doubled when
                actually it&apos;s covering twice the period. We always show
                the monthly-equivalent figure alongside the real cycle total.
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="font-display font-bold text-ink-navy">
                They skip the fixed/meter charge
              </p>
              <p className="mt-1 text-sm text-ash/70">
                Many quick calculators price only the SCM consumption and
                quietly drop the separate fixed/meter charge every CGD
                applies — understating the real bill by exactly that amount
                every single cycle. Our formula includes it; see the
                breakdown below.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="formula" className="mb-10 scroll-mt-20">
          <h2 id="formula" className="font-display mb-4 text-2xl font-semibold">
            The correct PNG billing formula
          </h2>
          <GasFormulaBlock cgdCode={tariff.cgdCode} />
        </section>

        <section aria-labelledby="tariff-table" className="mb-10 scroll-mt-20">
          <h2 id="tariff-table" className="font-display mb-4 text-2xl font-semibold">
            {tariff.cgdCode} domestic PNG tariff
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Slab (SCM)</th>
                  <th className="px-4 py-2 text-right font-semibold">Rate (₹/SCM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {tariff.slabs.map((s, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{s.minSCM}–{s.maxSCM ?? 'above'}</td>
                    <td className="px-4 py-2 text-right tabular-nums">₹{s.ratePerSCM.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-mist text-ash/70">
                <tr>
                  <td className="px-4 py-2">Fixed charge</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatINR(tariff.fixedCharge)}/cycle
                  </td>
                </tr>
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

        <section aria-labelledby="worked-examples" className="mb-10 scroll-mt-20">
          <h2 id="worked-examples" className="font-display mb-4 text-2xl font-semibold">
            Two worked examples
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase">
                Lower usage
              </p>
              <p className="font-display mt-1 text-2xl font-bold tabular-nums text-hub-gas">
                {formatINR(lowExample.total)}
              </p>
              <p className="mt-1 text-sm text-ash/60">
                20 SCM · {formatINR(lowExample.gasChargeGross)} gas charge + {formatINR(lowExample.fixedCharge)} fixed
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase">
                Higher usage
              </p>
              <p className="font-display mt-1 text-2xl font-bold tabular-nums text-hub-gas">
                {formatINR(highExample.total)}
              </p>
              <p className="mt-1 text-sm text-ash/60">
                80 SCM · {formatINR(highExample.gasChargeGross)} gas charge + {formatINR(highExample.fixedCharge)} fixed
              </p>
            </div>
          </div>
        </section>

        {hasMultiCgdComparison && (
          <section aria-labelledby="cgd-comparison" className="mb-10 scroll-mt-20">
            <h2 id="cgd-comparison" className="font-display mb-2 text-2xl font-semibold">
              How per-CGD billing changes your gas bill
            </h2>
            <p className="mb-4 text-sm text-ash/60">
              The exact same <strong>20 SCM</strong> — priced at each
              provider&apos;s real tariff, computed live by this
              calculator&apos;s own engine. We only compare CGDs with a
              source-verified tariff on file, so this list grows as we add more:
            </p>
            <GasCgdComparisonTable scmConsumed={20} cgdCodes={REAL_TARIFF_CGD_CODES} />
          </section>
        )}

        <section aria-labelledby="neighbor" className="mb-10 scroll-mt-20">
          <h2 id="neighbor" className="font-display mb-4 text-2xl font-semibold">
            Why your gas bill might be higher than your neighbor&apos;s
          </h2>
          <GasNeighborDiagnostic />
        </section>

        <section aria-labelledby="png-vs-lpg" className="mb-10 scroll-mt-20">
          <h2 id="png-vs-lpg" className="font-display mb-2 text-2xl font-semibold">
            PNG vs LPG cylinder — which costs less for you?
          </h2>
          <p className="mb-4 text-sm text-ash/60">
            A real numeric comparison, not a guess — priced at {tariff.cgdCode}&apos;s
            actual tariff against your own local LPG cylinder price.
          </p>
          <PngVsLpgComparison cgdCode={tariff.cgdCode} />
          <p className="mt-2 text-xs text-ash/50">
            Uses a commonly cited ~1.33 SCM-per-kg calorific equivalence to
            translate your PNG usage into an equivalent LPG weight — a
            planning approximation, not a precise thermodynamic conversion.
            Want to size your actual LPG usage instead? Try our{' '}
            <Link href="/fuel-cost/lpg-cylinder-usage-calculator" className="underline hover:text-hub-gas">
              LPG cylinder usage calculator
            </Link>
            .
          </p>
        </section>

        <section
          aria-labelledby="png-safety"
          className="mb-10 scroll-mt-20 rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5"
        >
          <h2 id="png-safety" className="font-display mb-2 text-xl font-bold text-ink-navy">
            PNG vs LPG safety
          </h2>
          <p className="text-sm text-ash/80">
            Both are safe when installed and maintained correctly. Piped
            natural gas is lighter than air and disperses upward in a leak;
            LPG is heavier than air and can pool near the floor — a factual
            difference in leak behavior, not a claim that either is broadly
            unsafe. Follow standard practice regardless: get connections
            checked periodically, ensure adequate kitchen ventilation, and
            contact your provider immediately if you smell gas.
          </p>
        </section>

        <section aria-labelledby="winter" className="mb-10 scroll-mt-20">
          <h2 id="winter" className="font-display mb-2 text-2xl font-semibold">
            Why your bill might spike in winter
          </h2>
          <p className="text-ash/80">
            Colder months bring more stovetop cooking time and, in homes
            with one, more use of a gas geyser for hot water — both add SCM
            consumption. A 10-15% seasonal increase over your summer
            baseline is common on its own and doesn&apos;t necessarily mean
            a leak or meter issue.
          </p>
        </section>

        <section aria-labelledby="pngrb" className="mb-10 scroll-mt-20">
          <h2 id="pngrb" className="font-display mb-2 text-2xl font-semibold">
            The PNGRB tariff landscape: how the math changes
          </h2>
          <p className="text-ash/80">
            The <strong>Petroleum and Natural Gas Regulatory Board (PNGRB)</strong>{' '}
            oversees India&apos;s city gas distribution framework, but unlike
            electricity, individual CGD tariffs aren&apos;t set by a single
            state regulator — each CGD revises its own domestic PNG price
            periodically, largely tracking input gas costs, so rates can move
            up or down several times a year and don&apos;t move in lockstep
            across providers. That&apos;s exactly why we price every
            calculator against a specific, dated CGD tariff rather than one
            assumed national rate — see the effective-from and last-verified
            dates on the tariff table above, and always check them against
            your own current bill.
          </p>
        </section>

        <section aria-labelledby="meter-reading" className="mb-10 scroll-mt-20">
          <h2 id="meter-reading" className="font-display mb-2 text-2xl font-semibold">
            How to submit your meter reading
          </h2>
          <p className="text-ash/80">
            If {tariff.cgdCode}&apos;s meter reader can&apos;t access your
            property, most CGDs let you submit a self-reading: photograph the
            meter&apos;s black digit display clearly, then upload it through
            your provider&apos;s customer app or website — look for a
            &ldquo;submit meter reading&rdquo; or &ldquo;self reading&rdquo;
            option. Keep the previous cycle&apos;s reading handy too, in case
            it&apos;s needed to confirm consumption.
          </p>
        </section>

        <section aria-labelledby="ecosystem" className="mb-10 scroll-mt-20">
          <h2 id="ecosystem" className="font-display mb-4 text-2xl font-semibold">
            Your gas energy ecosystem
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/fuel-cost/lpg-cylinder-usage-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-fuel/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>🔥</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                LPG cylinder usage
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Size your own LPG cylinder usage and cost per day.
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
              href="/ac"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>❄️</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                AC running cost
              </p>
              <p className="mt-1 text-xs text-ash/60">
                What your AC adds to the same electricity bill.
              </p>
            </Link>
            <Link
              href="/appliances"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>🔌</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                Appliance calculators
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Fan, fridge, inverter sizing and more.
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
            {otherCgds.map((c) => (
              <Link
                key={c.slug}
                href={`/gas/${c.slug}`}
                className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm"
              >
                <span className="text-xl" aria-hidden>🏢</span>
                <p className="font-display mt-2 font-bold text-ink-navy">
                  {c.name}
                </p>
                <p className="mt-1 text-xs text-ash/60">
                  PNG bill calculator for {c.name}.
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="guides" className="mb-10 scroll-mt-20">
          <h2 id="guides" className="font-display mb-4 text-2xl font-semibold">
            Related guides: understand your gas bill
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <a
              href="#scm"
              className="rounded-xl border border-hairline bg-paper p-4 text-sm font-semibold text-ink-navy transition hover:border-hub-gas/50 hover:shadow-sm"
            >
              How PNG billing units (SCM) work →
            </a>
            <a
              href="#meter-reading"
              className="rounded-xl border border-hairline bg-paper p-4 text-sm font-semibold text-ink-navy transition hover:border-hub-gas/50 hover:shadow-sm"
            >
              How to read/submit your gas meter →
            </a>
            <a
              href="#png-safety"
              className="rounded-xl border border-hairline bg-paper p-4 text-sm font-semibold text-ink-navy transition hover:border-hub-gas/50 hover:shadow-sm"
            >
              PNG safety basics →
            </a>
          </div>
          <p className="mt-2 text-xs text-ash/50">
            Standalone deep-dive guides on connection process and installation
            are on our roadmap — for now, each of these jumps to the relevant
            section on this page.
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
              {tariff.cgdName} tariff notification
            </a>
          </p>
          <p className="mt-1 text-xs text-ash/50">{tariff.verifiedBy}</p>
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
