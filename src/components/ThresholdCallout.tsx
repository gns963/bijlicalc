/**
 * A 2-column visual callout for a "cliff" rule in a tariff — a duty threshold,
 * a subsidy boundary, a non-telescopic switch, etc. Generic and reusable; the
 * calling page supplies the real left/right values from its own tariff data.
 */
export default function ThresholdCallout({
  title,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  note,
}: {
  title: string
  leftLabel: string
  leftValue: string
  rightLabel: string
  rightValue: string
  note: string
}) {
  return (
    <div className="rounded-xl border border-caution-amber/30 bg-caution-amber/5 p-5">
      <h3 className="font-display text-lg font-bold text-ink-navy">
        {title}
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-spark-teal/10 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-spark-teal">
            {leftLabel}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-spark-teal">
            {leftValue}
          </p>
        </div>
        <div className="rounded-xl bg-caution-amber/15 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-caution-amber">
            {rightLabel}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-caution-amber">
            {rightValue}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ash/70">{note}</p>
    </div>
  )
}
