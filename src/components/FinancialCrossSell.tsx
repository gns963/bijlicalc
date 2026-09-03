import Link from 'next/link'

const TOOLS = [
  {
    slug: 'gst-calculator',
    emoji: '🧾',
    title: 'GST Calculator',
    body: 'Add or remove GST for any slab, with CGST/SGST split.',
  },
  {
    slug: 'sip-calculator',
    emoji: '📈',
    title: 'SIP Calculator',
    body: 'Project mutual fund SIP maturity value and gains.',
  },
  {
    slug: 'new-vs-old-tax-regime-calculator',
    emoji: '🏦',
    title: 'New vs Old Tax Regime',
    body: 'Compare income tax under both regimes for FY 2026-27.',
  },
  {
    slug: 'gratuity-calculator',
    emoji: '💼',
    title: 'Gratuity Calculator',
    body: 'Compute gratuity from salary and years of service.',
  },
] as const

export default function FinancialCrossSell({ current }: { current: string }) {
  const others = TOOLS.filter((t) => t.slug !== current)
  return (
    <section aria-labelledby="related" className="mb-10">
      <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
        Other financial calculators
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {others.map((t) => (
          <Link
            key={t.slug}
            href={`/financial/${t.slug}`}
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-financial/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>
              {t.emoji}
            </span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              {t.title}
            </p>
            <p className="mt-1 text-xs text-ash/60">
              {t.body}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
