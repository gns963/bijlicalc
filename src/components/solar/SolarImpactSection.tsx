import { estimateCarbonOffset } from '@/lib/calc/solar'

export default function SolarImpactSection({ annualGenerationKwh }: { annualGenerationKwh: number }) {
  const impact = estimateCarbonOffset({ annualGenerationKwh })

  return (
    <section aria-labelledby="impact" className="mb-10">
      <h2 id="impact" className="font-display mb-4 text-2xl font-semibold">
        Your Solar Impact
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
          <p className="text-sm text-ash/60 dark:text-gazette-cream/50">Estimated annual CO2 offset</p>
          <p className="font-display mt-1 text-3xl font-bold text-hub-solar">
            {Math.round(impact.annualCo2OffsetKg).toLocaleString('en-IN')} kg
          </p>
        </div>
        <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
          <p className="text-sm text-ash/60 dark:text-gazette-cream/50">Roughly equivalent to</p>
          <p className="font-display mt-1 text-3xl font-bold text-hub-solar">
            {impact.treeEquivalent} trees/year
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-ash/50 dark:text-gazette-cream/40">{impact.notes[0]}</p>
    </section>
  )
}
