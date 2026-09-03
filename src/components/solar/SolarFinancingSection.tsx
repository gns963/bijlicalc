const OPTIONS = [
  {
    name: 'PM Surya Ghar subsidised loan',
    body: 'Several public-sector banks offer a collateral-free loan scheme tied to the PM Surya Ghar programme, typically at a lower rate than an unsecured personal loan, for the net cost after subsidy.',
    tenure: 'Up to ~10 years',
  },
  {
    name: 'General solar/green loans',
    body: 'Many banks and NBFCs offer dedicated solar-purchase loans outside the government scheme, usually priced a little higher than the subsidised option but with fewer eligibility restrictions.',
    tenure: 'Typically 3–7 years',
  },
  {
    name: 'Personal loan',
    body: 'A regular unsecured personal loan works for any system size, but carries a higher interest rate than a purpose-built solar loan since it isn\'t backed by any scheme or asset.',
    tenure: 'Typically 1–5 years',
  },
  {
    name: 'RESCO / solar lease model',
    body: 'A third-party developer owns and maintains the system on your roof; you pay a fixed monthly amount for the power it generates, with no upfront cost — less common for small residential rooftops than for larger installations.',
    tenure: 'Usually 10–25 year contracts',
  },
]

export default function SolarFinancingSection() {
  return (
    <section aria-labelledby="financing" className="mb-10">
      <h2 id="financing" className="font-display mb-2 text-2xl font-semibold">
        Solar Financing Options
      </h2>
      <p className="mb-4 text-ash/70">
        Interest rates and terms vary by lender and change over time — treat
        these as a starting point for comparison, not quoted rates.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="rounded-xl border border-hairline bg-paper p-5">
            <p className="font-display font-bold text-ink-navy">{o.name}</p>
            <p className="mt-1 text-sm text-ash/70">{o.body}</p>
            <p className="mt-2 text-xs font-semibold tracking-wide text-hub-solar uppercase">
              {o.tenure}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
