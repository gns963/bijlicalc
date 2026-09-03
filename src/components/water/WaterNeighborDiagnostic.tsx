import Link from 'next/link'

const CAUSES = [
  {
    title: 'A different board — or a different meter size',
    body: 'Even a nearby address can be served by a different water board, and within the same board a larger meter size (used for bigger properties or bulk connections) carries a higher fixed charge. See the comparison above — the board and connection size both move the bill.',
  },
  {
    title: 'Crossed an all-or-nothing free threshold',
    body: 'Where a board offers a free-consumption scheme, it can be a cliff-edge, not a true allowance — using even 1 KL more than the threshold can make your ENTIRE consumption billable, not just the excess. See the free-rule section above if this applies to your board.',
  },
  {
    title: 'A larger household or more residents',
    body: 'More people at home directly means more KL consumed — showers, laundry cycles and dishwashing all scale with headcount, unlike a flat per-property estimate.',
  },
  {
    title: 'A possible leak or running fixture',
    body: 'A running toilet cistern or a slow tap leak can waste hundreds of litres a month without being obvious — if your bill jumps with no real change in usage, check fixtures and consider comparing two consecutive meter readings with all taps off.',
  },
  {
    title: 'Billing-cycle timing',
    body: 'If you\'re comparing your bill against someone on a different billing cycle (monthly vs bi-monthly), remember a bi-monthly bill covers roughly double the period — use the monthly-equivalent figure above for a fair comparison.',
  },
  {
    title: 'A different property type or connection category',
    body: (
      <>
        Commercial, institutional or bulk (apartment) connections are often
        billed on a different tariff altogether from single-family domestic
        connections. If your household&apos;s overall utility spend feels
        high, it&apos;s also worth checking your{' '}
        <Link href="/electricity" className="underline hover:text-hub-water">
          electricity bill
        </Link>{' '}
        for the same kind of connection-category mismatch.
      </>
    ),
  },
]

export default function WaterNeighborDiagnostic() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CAUSES.map((c) => (
        <div
          key={c.title}
          className="rounded-xl border border-hairline bg-paper p-5"
        >
          <p className="font-display font-bold text-ink-navy">
            {c.title}
          </p>
          <p className="mt-1 text-sm text-ash/70">{c.body}</p>
        </div>
      ))}
    </div>
  )
}
