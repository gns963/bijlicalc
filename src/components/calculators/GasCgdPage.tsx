import Link from 'next/link'
import GasCgdBillCalculator from '@/components/calculators/GasCgdBillCalculator'
import PngVsLpgComparison from '@/components/calculators/PngVsLpgComparison'
import SplitHero from '@/components/SplitHero'
import { GAS_COMPANIES } from '@/data/gas-companies'
import { computeGasBill, getGasTariff } from '@/lib/calc/gas'
import { formatINR, formatIsoDate } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'

export default function GasCgdPage({ cgdCode, slug }: { cgdCode: string; slug: string }) {
  const tariff = getGasTariff(cgdCode)
  const path = `/gas/${slug}`
  const topRate = tariff.slabs[tariff.slabs.length - 1].ratePerSCM

  const lowExample = computeGasBill(tariff, { scmConsumed: 20 })
  const highExample = computeGasBill(tariff, { scmConsumed: 80 })
  const heroExample = lowExample

  const otherCgds = GAS_COMPANIES.filter((c) => c.slug !== slug).slice(0, 3)

  const tocLabel = tariff.billingCycle === 'bimonthly' ? '~60 days' : '~30 days'

  const faqs = [
    {
      q: `How is my ${tariff.cgdName} bill calculated?`,
      a: `Your SCM (standard cubic metre) consumption is multiplied by ${tariff.cgdName}'s current per-SCM rate, plus a flat fixed/meter charge for the billing cycle. ${tariff.cgdCode} does not use telescopic slabs for domestic PNG — every SCM is billed at the same rate.`,
    },
    {
      q: 'What is an SCM, and how much cooking does it represent?',
      a: 'A Standard Cubic Metre (SCM) is the billing unit for piped natural gas, roughly equivalent to one day of standard cooking (two meals) for an average family on a typical domestic burner — a useful mental benchmark, not an exact figure since actual usage varies by household size and cooking habits.',
    },
    {
      q: `Why is my ${tariff.cgdCode} bill bi-monthly instead of monthly?`,
      a: `${tariff.cgdCode} bills every ${tocLabel === '~60 days' ? 'two months' : 'month'}, so the SCM figure and total you see cover that whole period — don't compare it directly to a single LPG cylinder's cost without accounting for the longer period. Use the monthly-equivalent figure the calculator shows for a fair comparison.`,
    },
    {
      q: 'Is PNG cheaper than LPG cylinders?',
      a: 'It depends on your consumption and local LPG price — use the PNG vs LPG comparison below with your own numbers rather than assuming either is always cheaper. PNG generally has lower per-unit-energy cost but no cylinder-delivery hassle either way, while LPG doesn\'t require a fixed pipeline connection.',
    },
    {
      q: 'Why does my gas bill increase in winter?',
      a: 'Colder months bring more stovetop cooking time and, in homes that have one, more use of a gas geyser for hot water — both add SCM consumption. A 10-15% seasonal bump over your summer baseline is common and not a sign of a leak or meter fault by itself.',
    },
    {
      q: `How do I submit my ${tariff.cgdCode} meter reading if the reader can't access my meter?`,
      a: `Most CGDs, including ${tariff.cgdCode}, let you photograph the meter's black digit display and submit it via their customer app or website self-reading option when the meter reader can't access your property — check your provider's app for a "submit reading" or "self meter reading" feature.`,
    },
    {
      q: 'Is PNG safer than LPG cylinders?',
      a: 'Both are safe when installed and maintained correctly. Piped natural gas is lighter than air and disperses upward in a leak, while LPG is heavier than air and can pool near the floor — a factual difference in leak behavior, not a claim that one is broadly unsafe. Follow standard safety practice either way: regular leak checks, proper ventilation, and prompt professional attention to any gas smell.',
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
      q: 'How often are PNG tariff rates updated, and how do you keep this calculator accurate?',
      a: `CGD tariffs change periodically following PNGRB and provider notifications. We date every tariff figure with an effective-from and last-verified date (shown below) and cite the source — check that date against your own recent bill, since a rate change between our last verification and today would not yet be reflected here.`,
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
    description: `Piped natural gas (PNG) domestic tariff for ${tariff.cgdName}, effective ${tariff.effectiveFrom}.`,
    url: `${SITE}${path}#tariff-table`,
    dateModified: tariff.lastVerified,
    license: tariff.sourceUrl,
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: tariff.sourceUrl },
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
        h1={`${tariff.cgdName} (${tariff.cgdCode}) Bill Calculator`}
        subtitle={`Estimate your ${tariff.cgdCode} piped natural gas (PNG) bill using their real domestic tariff — not a self-entered rate. Covers ${tariff.citiesServed.slice(0, 3).join(', ')}${tariff.citiesServed.length > 3 ? ' and more' : ''}.`}
        primaryCta={{ label: `Calculate My ${tariff.cgdCode} Bill`, href: '#calculator', emoji: '🔥' }}
        secondaryCta={{ label: 'All gas providers →', href: '/gas' }}
        statChips={[
          { icon: '🔥', big: `₹${topRate.toFixed(2)}`, small: 'Rate per SCM', tone: 'hub' },
          { icon: '📅', big: tariff.billingCycle === 'bimonthly' ? 'Bi-monthly' : 'Monthly', small: 'Billing', tone: 'hub' },
          { icon: '➕', big: formatINR(tariff.fixedCharge), small: 'Fixed charge', tone: 'hub' },
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

        <section aria-labelledby="scm" className="mb-10 scroll-mt-20">
          <h2 id="scm" className="font-display mb-2 text-2xl font-semibold">
            Understanding SCM units
          </h2>
          <p className="text-ash/80 dark:text-gazette-cream/70">
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
          <p className="text-ash/80 dark:text-gazette-cream/70">
            {tariff.cgdCode} bills{' '}
            {tariff.billingCycle === 'bimonthly' ? 'every two months' : 'every month'}
            , so the SCM figure and total on your bill represent that whole
            period — not a single month. Don&apos;t compare a bi-monthly PNG
            total directly against one LPG cylinder&apos;s cost; use the
            monthly-equivalent figure the calculator shows above for a fair,
            like-for-like comparison.
          </p>
        </section>

        <section aria-labelledby="tariff-table" className="mb-10 scroll-mt-20">
          <h2 id="tariff-table" className="font-display mb-4 text-2xl font-semibold">
            {tariff.cgdCode} domestic PNG tariff
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
                <tr>
                  <th className="px-4 py-2 font-semibold">Slab (SCM)</th>
                  <th className="px-4 py-2 text-right font-semibold">Rate (₹/SCM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline dark:divide-white/10">
                {tariff.slabs.map((s, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{s.minSCM}–{s.maxSCM ?? 'above'}</td>
                    <td className="px-4 py-2 text-right tabular-nums">₹{s.ratePerSCM.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-mist text-ash/70 dark:bg-slate-800 dark:text-gazette-cream/70">
                <tr>
                  <td className="px-4 py-2">Fixed charge</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatINR(tariff.fixedCharge)}/cycle
                  </td>
                </tr>
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

        <section aria-labelledby="worked-examples" className="mb-10 scroll-mt-20">
          <h2 id="worked-examples" className="font-display mb-4 text-2xl font-semibold">
            Two worked examples
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
              <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
                Lower usage
              </p>
              <p className="font-display mt-1 text-2xl font-bold tabular-nums text-hub-gas">
                {formatINR(lowExample.total)}
              </p>
              <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
                20 SCM · {formatINR(lowExample.gasChargeGross)} gas charge + {formatINR(lowExample.fixedCharge)} fixed
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
              <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
                Higher usage
              </p>
              <p className="font-display mt-1 text-2xl font-bold tabular-nums text-hub-gas">
                {formatINR(highExample.total)}
              </p>
              <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
                80 SCM · {formatINR(highExample.gasChargeGross)} gas charge + {formatINR(highExample.fixedCharge)} fixed
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="png-vs-lpg" className="mb-10 scroll-mt-20">
          <h2 id="png-vs-lpg" className="font-display mb-2 text-2xl font-semibold">
            PNG vs LPG cylinder — which costs less for you?
          </h2>
          <p className="mb-4 text-sm text-ash/60 dark:text-gazette-cream/50">
            A real numeric comparison, not a guess — priced at {tariff.cgdCode}&apos;s
            actual tariff against your own local LPG cylinder price.
          </p>
          <PngVsLpgComparison cgdCode={tariff.cgdCode} />
          <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
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
          <h2 id="png-safety" className="font-display mb-2 text-xl font-bold text-ink-navy dark:text-gazette-cream">
            PNG vs LPG safety
          </h2>
          <p className="text-sm text-ash/80 dark:text-gazette-cream/70">
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
          <p className="text-ash/80 dark:text-gazette-cream/70">
            Colder months bring more stovetop cooking time and, in homes
            with one, more use of a gas geyser for hot water — both add SCM
            consumption. A 10-15% seasonal increase over your summer
            baseline is common on its own and doesn&apos;t necessarily mean
            a leak or meter issue.
          </p>
        </section>

        <section aria-labelledby="meter-reading" className="mb-10 scroll-mt-20">
          <h2 id="meter-reading" className="font-display mb-2 text-2xl font-semibold">
            How to submit your meter reading
          </h2>
          <p className="text-ash/80 dark:text-gazette-cream/70">
            If {tariff.cgdCode}&apos;s meter reader can&apos;t access your
            property, most CGDs let you submit a self-reading: photograph the
            meter&apos;s black digit display clearly, then upload it through
            your provider&apos;s customer app or website — look for a
            &ldquo;submit meter reading&rdquo; or &ldquo;self reading&rdquo;
            option. Keep the previous cycle&apos;s reading handy too, in case
            it&apos;s needed to confirm consumption.
          </p>
        </section>

        <section aria-labelledby="related" className="mb-10 scroll-mt-20">
          <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
            Related calculators
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/fuel-cost/lpg-cylinder-usage-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-fuel/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>🔥</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                LPG cylinder usage
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                Size your own LPG cylinder usage and cost per day.
              </p>
            </Link>
            {otherCgds.map((c) => (
              <Link
                key={c.slug}
                href={`/gas/${c.slug}`}
                className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
              >
                <span className="text-xl" aria-hidden>🏢</span>
                <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                  {c.name}
                </p>
                <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                  PNG bill calculator for {c.name}.
                </p>
              </Link>
            ))}
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
              {tariff.cgdName} tariff notification
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
