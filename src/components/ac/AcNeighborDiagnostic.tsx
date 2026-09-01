import Link from 'next/link'

const CAUSES = [
  {
    title: 'Dirty filters or coils',
    body: 'A clogged filter or dusty condenser coil restricts airflow, forcing the compressor to run longer for the same cooling — get it serviced before every summer.',
  },
  {
    title: 'Wrong fan speed or temperature setting',
    body: 'Running at the lowest temperature setting or a low fan speed makes the compressor work harder and cycle less efficiently than a moderate 24–26°C setting on auto fan.',
  },
  {
    title: 'Poor room insulation',
    body: 'Unsealed gaps, single-glazed windows, or a west-facing room with no shading let heat back in constantly, so the AC never gets to idle.',
  },
  {
    title: 'An older or degraded compressor',
    body: 'Compressor efficiency drops with age and wear — a 6-8 year old unit can use noticeably more power than its original ISEER rating implied when new.',
  },
  {
    title: 'Wrong tonnage for the room',
    body: (
      <>
        An undersized AC runs constantly at full load; check whether yours is
        actually sized correctly with our{' '}
        <Link href="/ac/tonnage-calculator" className="underline hover:text-hub-ac">
          tonnage calculator
        </Link>
        .
      </>
    ),
  },
  {
    title: 'A different — or higher — tariff slab than your neighbor',
    body: (
      <>
        Even identical usage can cost differently: Indian tariffs are
        telescopic, so if your base household consumption is already higher
        than your neighbor&apos;s, your AC&apos;s units land on a steeper
        slab than theirs. This is the one cause a DISCOM-aware calculator can
        actually show you — compare your state&apos;s slabs on our{' '}
        <Link href="/electricity" className="underline hover:text-hub-ac">
          electricity bill calculators
        </Link>
        .
      </>
    ),
  },
]

export default function AcNeighborDiagnostic() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CAUSES.map((c) => (
        <div
          key={c.title}
          className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900"
        >
          <p className="font-display font-bold text-ink-navy dark:text-gazette-cream">
            {c.title}
          </p>
          <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">{c.body}</p>
        </div>
      ))}
    </div>
  )
}
