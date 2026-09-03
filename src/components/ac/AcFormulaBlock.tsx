import { COOLING_KW_PER_TON, ISEER_BY_STAR, LOAD_FACTOR } from '@/lib/calc/ac'

/**
 * Renders the ISEER cost formula straight from the exported constants in
 * src/lib/calc/ac.ts — never restate the numbers here, import them, so the
 * displayed methodology can never drift from what the calculator actually
 * computes.
 */
export default function AcFormulaBlock() {
  const stars = Object.entries(ISEER_BY_STAR).sort(([a], [b]) => Number(a) - Number(b))

  return (
    <div className="rounded-xl border border-hairline bg-paper p-5">
      <p className="font-display text-sm font-semibold tracking-wide text-hub-ac uppercase">
        The formula, in full
      </p>
      <div className="mt-3 space-y-2 font-mono text-sm">
        <p className="rounded-lg bg-mist px-3 py-2">
          Input kW = (Tonnage × {COOLING_KW_PER_TON}) ÷ ISEER
        </p>
        <p className="rounded-lg bg-mist px-3 py-2">
          Daily units = Input kW × Daily hours × {LOAD_FACTOR} (duty factor)
        </p>
        <p className="rounded-lg bg-mist px-3 py-2">
          Cost = Daily units × your DISCOM&apos;s top-slab rate (+ FCA + duty)
        </p>
      </div>
      <p className="mt-3 text-sm text-ash/70">
        <strong>{COOLING_KW_PER_TON} kW/ton</strong> is the standard
        refrigeration-ton conversion. The <strong>{LOAD_FACTOR * 100}% duty
        factor</strong> accounts for the compressor cycling on and off rather
        than running flat out for every minute it&apos;s switched on. ISEER
        (Indian Seasonal Energy Efficiency Ratio) is BEE&apos;s efficiency
        metric — the higher it is, the less electrical input the same
        cooling output needs:
      </p>
      <div className="mt-3 grid grid-cols-5 gap-2 text-center">
        {stars.map(([star, iseer]) => (
          <div
            key={star}
            className="rounded-lg border border-hairline bg-mist px-2 py-2"
          >
            <p className="font-display text-sm font-bold text-hub-ac">{star}★</p>
            <p className="text-xs text-ash/60">
              ISEER {iseer}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ash/50">
        These are the exact constants and formula our calculator uses — not a
        simplified restatement.
      </p>
    </div>
  )
}
