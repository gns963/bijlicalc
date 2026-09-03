import { estimateAcRatedCurrentAmps, recommendAcCircuit } from '@/lib/calc/ac'

const TONNAGES = [0.8, 1, 1.5, 2]
/** 3-star used as the "typical" reference star rating for this table — higher
 *  star ratings draw somewhat less current for the same tonnage. */
const REFERENCE_STAR = 3

export default function AcCircuitSafetyTable() {
  const rows = TONNAGES.map((tonnage) => {
    const ratedCurrentAmps = estimateAcRatedCurrentAmps(tonnage, REFERENCE_STAR)
    const circuit = recommendAcCircuit({ ratedCurrentAmps })
    return { tonnage, ratedCurrentAmps, ...circuit }
  })

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-hairline">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline bg-mist text-ink-navy">
            <tr>
              <th className="px-4 py-2 font-semibold">Tonnage</th>
              <th className="px-4 py-2 text-right font-semibold">Typical rated current</th>
              <th className="px-4 py-2 text-right font-semibold">Recommended MCB</th>
              <th className="px-4 py-2 text-right font-semibold">Recommended wire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rows.map((r) => (
              <tr key={r.tonnage}>
                <td className="px-4 py-2 font-medium">{r.tonnage} Ton</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  ~{r.ratedCurrentAmps}A
                </td>
                <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-ac">
                  {r.recommendedMcbAmps}A
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {r.recommendedWireSqmm} sq mm
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ash/50">
        Rated current is estimated from a {REFERENCE_STAR}-star unit&apos;s
        typical full-load draw at each tonnage — your specific model&apos;s
        nameplate current may differ. This is general planning guidance;
        always have the final MCB and wire specification confirmed by a
        licensed electrician for your actual installation.
      </p>
    </div>
  )
}
