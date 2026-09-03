import Link from 'next/link'

export default function SolarAcTieIn() {
  return (
    <section aria-labelledby="ac-tiein" className="mb-10">
      <h2 id="ac-tiein" className="font-display mb-2 text-2xl font-semibold">
        How Solar Powers Your AC
      </h2>
      <p className="text-ash/80">
        Air conditioning is usually the single biggest load in an Indian
        home, and it runs mostly during daylight hours — exactly when solar
        generates the most. If AC is a major part of your bill, size your
        system with that load in mind rather than just your average monthly
        units.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/ac/bill-calculator"
          className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
        >
          <span className="text-xl" aria-hidden>❄️</span>
          <p className="font-display mt-2 font-bold text-ink-navy">
            AC running cost
          </p>
          <p className="mt-1 text-xs text-ash/60">
            See how much of your bill your AC actually adds.
          </p>
        </Link>
        <Link
          href="/solar/panel-size-calculator"
          className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
        >
          <span className="text-xl" aria-hidden>📐</span>
          <p className="font-display mt-2 font-bold text-ink-navy">
            Panel size calculator
          </p>
          <p className="mt-1 text-xs text-ash/60">
            Size a system that accounts for AC-heavy usage.
          </p>
        </Link>
      </div>
    </section>
  )
}
