const MYTHS = [
  {
    myth: 'Solar panels don\'t generate anything on a cloudy or rainy day.',
    fact: 'Panels still generate power from diffuse sunlight on overcast days — typically 10–25% of clear-sky output, not zero. Monsoon months do lower your monthly total, which is exactly why generation estimates use a full-year average, not a sunny-day best case.',
  },
  {
    myth: 'Hailstorms and monsoon weather will damage the panels.',
    fact: 'Standard rooftop panels are tested to withstand hail impact and heavy rain under the IEC 61215 certification most reputable brands carry. Physical damage from severe weather is uncommon and is typically covered under the manufacturer\'s product warranty.',
  },
  {
    myth: 'Solar panels need constant cleaning and maintenance.',
    fact: 'A rooftop system is largely low-maintenance — occasional cleaning (roughly monthly in dusty areas, less elsewhere) to clear dust buildup is the main upkeep. There are no moving parts in the panels themselves to service.',
  },
  {
    myth: 'Installing solar will hurt my property\'s resale value.',
    fact: 'A paid-off or subsidised rooftop system is generally viewed as a value-add by buyers, since it lowers the running cost of the home — the opposite of a liability, provided the installation is done to code with proper documentation.',
  },
  {
    myth: 'Panels stop working properly in India\'s summer heat.',
    fact: 'Panel output does derate slightly as cell temperature rises — a real, well-documented effect of the semiconductor physics — but this is already factored into standard generation estimates. It reduces efficiency somewhat; it doesn\'t stop the system from working.',
  },
]

export default function SolarMythsSection() {
  return (
    <section aria-labelledby="myths" className="mb-10">
      <h2 id="myths" className="font-display mb-4 text-2xl font-semibold">
        Common Myths About Rooftop Solar — Debunked
      </h2>
      <div className="grid gap-4">
        {MYTHS.map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-seal-red">
              Myth: <span className="font-normal text-ash/80 dark:text-gazette-cream/70">{m.myth}</span>
            </p>
            <p className="mt-2 text-sm font-semibold text-spark-teal">
              Fact: <span className="font-normal text-ash/80 dark:text-gazette-cream/70">{m.fact}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
