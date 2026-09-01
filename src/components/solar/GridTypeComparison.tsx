const TYPES = [
  {
    name: 'On-Grid (Grid-Tied)',
    bestFor: 'Most urban and suburban homes with reasonably reliable grid supply',
    pros: [
      'Lowest upfront cost of the three',
      'Eligible for the PM Surya Ghar subsidy',
      'Net metering exports surplus generation for a bill credit',
    ],
    cons: [
      'No power during a grid outage (the inverter shuts down for safety)',
      'No battery backup included by default',
    ],
  },
  {
    name: 'Off-Grid (Standalone)',
    bestFor: 'Remote homes with no reliable grid connection at all',
    pros: ['Fully independent of the grid', 'Keeps working during a grid outage'],
    cons: [
      'Not eligible for the PM Surya Ghar subsidy',
      'Needs a large battery bank — significantly higher cost',
      'Must be sized for worst-case usage, not average, since there\'s no grid to fall back on',
    ],
  },
  {
    name: 'Hybrid',
    bestFor: 'Homes that want backup power during outages plus subsidy/net-metering benefits',
    pros: [
      'Battery backup during outages',
      'Still eligible for net metering and subsidy in most states',
      'Automatically switches between grid, battery and solar',
    ],
    cons: [
      'Higher upfront cost than a plain on-grid system',
      'Hybrid inverter and battery add ongoing maintenance',
    ],
  },
]

export default function GridTypeComparison() {
  return (
    <section aria-labelledby="grid-type" className="mb-10">
      <h2 id="grid-type" className="font-display mb-4 text-2xl font-semibold">
        On-Grid vs Off-Grid vs Hybrid — Which Fits Your Home
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {TYPES.map((t) => (
          <div
            key={t.name}
            className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900"
          >
            <p className="font-display font-bold text-ink-navy dark:text-gazette-cream">{t.name}</p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Best for: {t.bestFor}
            </p>
            <div className="mt-3">
              <p className="text-xs font-semibold tracking-wide text-spark-teal uppercase">Pros</p>
              <ul className="mt-1 space-y-1 text-sm text-ash/80 dark:text-gazette-cream/70">
                {t.pros.map((p) => (
                  <li key={p}>+ {p}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold tracking-wide text-caution-amber uppercase">Cons</p>
              <ul className="mt-1 space-y-1 text-sm text-ash/80 dark:text-gazette-cream/70">
                {t.cons.map((c) => (
                  <li key={c}>− {c}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
