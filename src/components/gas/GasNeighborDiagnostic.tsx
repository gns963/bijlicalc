import Link from 'next/link'

const CAUSES = [
  {
    title: 'A different CGD — or a different zone of the same one',
    body: (
      <>
        Even a nearby address can be served by a different CGD, and some
        providers (like Gujarat Gas) price different zones of the same city
        differently. See the CGD comparison above — a few kilometres can
        genuinely mean a 10%+ difference in your per-SCM rate.
      </>
    ),
  },
  {
    title: 'More winter cooking and geyser use',
    body: 'Colder months bring longer stovetop cooking sessions and, in homes that have one, heavier use of a gas geyser for hot water — both add real SCM consumption, not a billing error.',
  },
  {
    title: 'A larger household or more frequent cooking',
    body: 'More people, more meals cooked at home, or dishes that need longer flame time (slow-cooked dals, tandoor-style items) all add up — SCM consumption scales with actual usage, unlike a flat per-head estimate.',
  },
  {
    title: 'A possible meter or connection issue',
    body: 'If your bill jumps sharply with no real change in usage, it is worth having the connection checked for a leak downstream of the meter, or confirming your last submitted/estimated reading against the meter\'s actual digit display.',
  },
  {
    title: 'Missed the bi-monthly billing period',
    body: (
      <>
        If you are comparing your bill against someone on a monthly-billed
        connection, remember most PNG bills cover ~60 days, not 30 — see the
        monthly-equivalent figure above for a fair, like-for-like comparison.
      </>
    ),
  },
  {
    title: 'Your household consumption pushes you into a costlier slab elsewhere',
    body: (
      <>
        If your neighbor also uses electricity or gas for water heating
        differently, their whole-household energy mix — not just their gas
        bill — may differ. Compare your full electricity bill too on our{' '}
        <Link href="/electricity" className="underline hover:text-hub-gas">
          electricity bill calculators
        </Link>
        .
      </>
    ),
  },
]

export default function GasNeighborDiagnostic() {
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
