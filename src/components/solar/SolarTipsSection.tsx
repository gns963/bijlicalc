const TIPS = [
  {
    title: 'Orient panels south-facing where possible',
    body: 'A roughly south-facing, unshaded tilt captures the most sun through the day in the northern hemisphere — ask your installer to confirm the best orientation for your specific roof.',
  },
  {
    title: 'Choose an MNRE-empanelled installer',
    body: 'Empanelled vendors are required to meet quality and component standards to qualify for the subsidy — verify empanelment on the PM Surya Ghar portal before signing a quote.',
  },
  {
    title: 'Apply early in the financial year',
    body: 'Subsidy disbursal depends on budget allocation cycles — applying earlier reduces the chance of processing delays tied to year-end demand spikes.',
  },
  {
    title: 'Clean panels roughly monthly',
    body: 'Dust and pollen buildup gradually reduces output — a simple wipe-down (or asking your installer about an auto-cleaning add-on) keeps generation closer to its rated potential.',
  },
  {
    title: 'Consider a hybrid setup if outages are frequent',
    body: 'If your area has regular power cuts, a hybrid inverter with battery backup keeps essentials running when the grid goes down — a plain on-grid system won\'t.',
  },
  {
    title: 'Register for net metering promptly',
    body: 'Delaying your net-metering application means exported units aren\'t credited in the meantime — apply as soon as installation is complete, not after the first bill arrives.',
  },
]

export default function SolarTipsSection() {
  return (
    <section aria-labelledby="tips" className="mb-10">
      <h2 id="tips" className="font-display mb-4 text-2xl font-semibold">
        6 Ways to Maximize Your Solar ROI
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {TIPS.map((t, i) => (
          <div key={t.title} className="flex gap-3 rounded-xl border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-slate-900">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass/15 font-display text-sm font-bold text-brass">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-ink-navy dark:text-gazette-cream">{t.title}</p>
              <p className="mt-0.5 text-sm text-ash/70 dark:text-gazette-cream/60">{t.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
