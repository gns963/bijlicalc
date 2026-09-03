import Link from 'next/link'
import { getTariff } from '@/lib/calc/electricity'
import { cycleLabel } from '@/lib/format'

// Categorical color rotation for telling DISCOM cards apart at a glance —
// not semantic (unlike brass/spark-teal/seal-red/caution-amber elsewhere),
// same pattern as an avatar-color rotation. Classes are written out in full
// (not interpolated) so Tailwind's static scanner can find and generate them.
const CARD_COLOR_CLASSES = [
  { badge: 'bg-brass', text: 'text-brass', bar: 'bg-brass' },
  { badge: 'bg-hub-ac', text: 'text-hub-ac', bar: 'bg-hub-ac' },
  { badge: 'bg-spark-teal', text: 'text-spark-teal', bar: 'bg-spark-teal' },
  { badge: 'bg-hub-financial', text: 'text-hub-financial', bar: 'bg-hub-financial' },
  { badge: 'bg-hub-solar', text: 'text-hub-solar', bar: 'bg-hub-solar' },
  { badge: 'bg-caution-amber', text: 'text-caution-amber', bar: 'bg-caution-amber' },
] as const

function topRate(discomCode: string): number {
  const tariff = getTariff(discomCode)
  const res =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
    tariff.connectionTypes[0]
  return res.slabs[res.slabs.length - 1].ratePerUnit
}

function baseRate(discomCode: string): number {
  const tariff = getTariff(discomCode)
  const res =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
    tariff.connectionTypes[0]
  return res.slabs[0].ratePerUnit
}

function slabCount(discomCode: string): number {
  const tariff = getTariff(discomCode)
  const res =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
    tariff.connectionTypes[0]
  return res.slabs.length
}

/** Structured, live comparison against neighbouring/similarly-sized DISCOMs —
 * colored per-DISCOM cards with a rank-based cost tier, plus a bar chart. */
export default function DiscomComparisonTable({
  currentDiscomCode,
  compareDiscomCodes,
  discomHrefs,
}: {
  currentDiscomCode: string
  compareDiscomCodes: string[]
  discomHrefs: Record<string, string>
}) {
  const codes = [currentDiscomCode, ...compareDiscomCodes]
  const rates = codes.map((c) => ({ code: c, rate: topRate(c) }))
  const minRate = Math.min(...rates.map((r) => r.rate))
  const maxRate = Math.max(...rates.map((r) => r.rate))
  const currentRate = topRate(currentDiscomCode)
  const chartMax = Math.max(...rates.map((r) => r.rate), 0.01)

  function statusFor(rate: number): { label: string; tone: 'cheap' | 'mid' | 'costly' } {
    if (rate === minRate && minRate !== maxRate) return { label: 'Cheapest Here', tone: 'cheap' }
    if (rate === maxRate && minRate !== maxRate) return { label: 'Most Expensive', tone: 'costly' }
    return { label: 'Moderate', tone: 'mid' }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {codes.map((code, i) => {
          const t = getTariff(code)
          const isCurrent = code === currentDiscomCode
          const rate = topRate(code)
          const color = CARD_COLOR_CLASSES[i % CARD_COLOR_CLASSES.length]
          const status = statusFor(rate)
          const diffPct = isCurrent ? null : Math.round(((rate - currentRate) / currentRate) * 100)
          const href = discomHrefs[code]

          return (
            <div
              key={code}
              className={`relative rounded-2xl border bg-paper p-5 ${
                isCurrent
                  ? 'border-2 border-brass'
                  : 'border border-hairline'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-3 right-3 rounded-full bg-brass/15 px-2 py-0.5 text-[10px] font-semibold text-brass uppercase">
                  Your DISCOM
                </span>
              )}
              <div className="flex items-center gap-3 pr-2">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${color.badge}`}
                >
                  {code.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display font-bold text-ink-navy">
                    {t.discomCode}
                  </p>
                  <p className="truncate text-xs text-ash/50">
                    {t.state}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[11px] font-semibold tracking-wide text-ash/50 uppercase">
                Top slab rate
              </p>
              <p className={`font-display text-2xl font-extrabold ${color.text}`}>
                ₹{rate.toFixed(2)}
                <span className="text-sm font-medium text-ash/50">
                  /unit
                </span>
              </p>
              {diffPct != null && (
                <p
                  className={`text-xs font-medium ${diffPct < 0 ? 'text-spark-teal' : diffPct > 0 ? 'text-caution-amber' : 'text-ash/50'}`}
                >
                  {diffPct === 0
                    ? 'Same as your DISCOM'
                    : `${diffPct < 0 ? '↓' : '↑'} ${Math.abs(diffPct)}% ${diffPct < 0 ? 'cheaper' : 'costlier'} than ${currentDiscomCode}`}
                </p>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-mist p-2">
                  <p className="text-ash/50">Base slab</p>
                  <p className="font-semibold text-ink-navy">
                    ₹{baseRate(code).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-mist p-2">
                  <p className="text-ash/50">Slabs</p>
                  <p className="font-semibold text-ink-navy">
                    {slabCount(code)}
                  </p>
                </div>
                <div className="rounded-lg bg-mist p-2">
                  <p className="text-ash/50">Billing</p>
                  <p className="font-semibold text-ink-navy capitalize">
                    {cycleLabel(t.billingCycle)}
                  </p>
                </div>
                <div className="rounded-lg bg-mist p-2">
                  <p className="text-ash/50">Duty</p>
                  <p className="font-semibold text-ink-navy">
                    {t.electricityDutyPercent}%
                  </p>
                </div>
              </div>

              <span
                className={`mt-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                  status.tone === 'cheap'
                    ? 'bg-spark-teal/15 text-spark-teal'
                    : status.tone === 'costly'
                      ? 'bg-caution-amber/15 text-caution-amber'
                      : 'bg-ash/10 text-ash'
                }`}
              >
                {status.label}
              </span>

              {href && (
                <Link
                  href={href}
                  className={`mt-4 block rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${
                    isCurrent
                      ? 'bg-brass text-white hover:bg-brass/90'
                      : 'border border-hairline text-ink-navy hover:border-brass/50'
                  }`}
                >
                  {isCurrent ? 'View Full Calculator →' : `${t.discomCode} Calculator →`}
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Bar chart — same rates, sorted cheapest to costliest */}
      <div className="rounded-2xl border border-hairline bg-paper p-5">
        <p className="mb-4 text-sm font-semibold text-ink-navy">
          Top Slab Rate Comparison
        </p>
        <div className="grid gap-3">
          {[...rates]
            .sort((a, b) => a.rate - b.rate)
            .map(({ code, rate }) => {
              const i = codes.indexOf(code)
              const color = CARD_COLOR_CLASSES[i % CARD_COLOR_CLASSES.length]
              const t = getTariff(code)
              const pct = Math.max((rate / chartMax) * 100, 10)
              return (
                <div key={code} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs font-semibold text-ink-navy">
                    {code}
                  </span>
                  <div className="h-6 flex-1 rounded-full bg-mist">
                    <div
                      className={`flex h-6 items-center justify-end rounded-full px-2 text-[11px] font-semibold text-white ${color.bar}`}
                      style={{ width: `${pct}%` }}
                    >
                      ₹{rate.toFixed(2)}
                    </div>
                  </div>
                  <span className="w-24 shrink-0 truncate text-xs text-ash/50">
                    {t.state}
                  </span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
