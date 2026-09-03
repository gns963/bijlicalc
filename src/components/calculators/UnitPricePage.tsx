import Link from 'next/link'
import PageHero from '@/components/PageHero'
import type { DiscomPageConfig } from '@/data/calculator-pages'
import { getTariff } from '@/lib/calc/electricity'
import { marginalRatePerUnit } from '@/lib/calc/ac'
import { cycleLabel, formatIsoDate } from '@/lib/format'

export default function UnitPricePage({ config }: { config: DiscomPageConfig }) {
  const tariff = getTariff(config.discomCode)
  const residential =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
    tariff.connectionTypes[0]
  const firstSlabRate = residential.slabs[0].ratePerUnit
  const topSlabRate = residential.slabs[residential.slabs.length - 1].ratePerUnit
  const marginalRate = marginalRatePerUnit(config.discomCode)

  const faqs = [
    {
      q: `What is the price of 1 unit of electricity in ${tariff.state}?`,
      a: `${tariff.discomCode}'s residential tariff starts at ₹${firstSlabRate.toFixed(2)}/unit for the first slab and rises to ₹${topSlabRate.toFixed(2)}/unit at the top slab, before fuel cost adjustment and electricity duty. Your actual per-unit cost depends on your total consumption, since the tariff is telescopic.`,
    },
    {
      q: 'Why isn\'t there one single "1 unit price"?',
      a: `${tariff.discomCode} bills residential consumers on a telescopic slab structure — each unit you consume is charged at the rate of the slab it falls into, not a single flat rate. So your 50th unit and your 400th unit are priced differently.`,
    },
    {
      q: 'What does the marginal rate shown here mean?',
      a: `₹${marginalRate.toFixed(2)}/unit is what your NEXT unit of consumption costs if you're already in the top slab — this includes the top slab rate, fuel cost adjustment and electricity duty. It's the realistic cost of running one more appliance, like an AC.`,
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

  return (
    <>
      <PageHero
        hub="electricity"
        breadcrumb={[
          { label: 'Electricity', href: '/electricity' },
          { label: '1 Unit Price', href: '/electricity/unit-price' },
          { label: tariff.state, href: `/electricity/unit-price/${config.slug}` },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>⚡</span> Electricity hub
          </>
        }
        h1={`${tariff.state} — 1 Unit Electricity Price`}
        subtitle={
          <>
            What one unit (kWh) of electricity costs under {tariff.discomCode}
            &apos;s real, source-cited residential tariff.
          </>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section
        aria-labelledby="price"
        className="mb-8 rounded-xl border border-hairline border-l-4 border-l-brass bg-paper p-5"
      >
        <h2
          id="price"
          className="font-display text-sm font-semibold tracking-wide text-brass uppercase"
        >
          Marginal unit price (top slab, incl. FCA &amp; duty)
        </h2>
        <p className="font-display mt-2 text-4xl font-bold tabular-nums text-ink-navy">
          ₹{marginalRate.toFixed(2)}
          <span className="text-lg font-normal text-ash/60">
            {' '}
            /unit
          </span>
        </p>
        <p className="mt-2 text-sm text-ash/60">
          This is what your next unit costs once you&apos;re in the top
          slab — the realistic cost of running one more appliance.
        </p>
      </section>

      <section aria-labelledby="slabs" className="mb-10">
        <h2 id="slabs" className="font-display mb-4 text-2xl font-semibold">
          Full slab-wise rates
        </h2>
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline bg-mist text-ink-navy">
              <tr>
                <th className="px-4 py-2 font-semibold">Slab</th>
                <th className="px-4 py-2 text-right font-semibold">Rate/unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {residential.slabs.map((s, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 font-medium">
                    {s.minUnits}–{s.maxUnits ?? '∞'} units
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    ₹{s.ratePerUnit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-hairline bg-paper px-3 py-3 text-center">
            <dt className="text-[11px] tracking-wide text-ash/50 uppercase">
              Billing cycle
            </dt>
            <dd className="font-display mt-1 font-bold text-ink-navy">
              {cycleLabel(tariff.billingCycle)}
            </dd>
          </div>
          {tariff.fuelCostAdjustment > 0 && (
            <div className="rounded-xl border border-hairline bg-paper px-3 py-3 text-center">
              <dt className="text-[11px] tracking-wide text-ash/50 uppercase">
                FCA
              </dt>
              <dd className="font-display mt-1 font-bold text-ink-navy">
                ₹{tariff.fuelCostAdjustment}/unit
              </dd>
            </div>
          )}
          {tariff.electricityDutyPercent > 0 && (
            <div className="rounded-xl border border-hairline bg-paper px-3 py-3 text-center">
              <dt className="text-[11px] tracking-wide text-ash/50 uppercase">
                Duty
              </dt>
              <dd className="font-display mt-1 font-bold text-ink-navy">
                {tariff.electricityDutyPercent}%
              </dd>
            </div>
          )}
          <div className="rounded-xl border border-hairline bg-paper px-3 py-3 text-center">
            <dt className="text-[11px] tracking-wide text-ash/50 uppercase">
              Verified
            </dt>
            <dd className="font-display mt-1 font-bold text-seal-red">
              {formatIsoDate(tariff.lastVerified)}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="calc" className="mb-10">
        <h2 id="calc" className="font-display mb-2 text-2xl font-semibold">
          Want your full bill, not just the unit price?
        </h2>
        <Link
          href={`/electricity/${config.slug}`}
          className="inline-flex items-center gap-2 rounded-xl bg-brass px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brass/90"
        >
          <span aria-hidden>⚡</span> Open the full {tariff.discomCode} bill
          calculator →
        </Link>
      </section>

      <section aria-labelledby="faq" className="mb-10">
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
    </>
  )
}
