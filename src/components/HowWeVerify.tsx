/**
 * Shared "how we verify" 3-step methodology block. Extracted from the
 * homepage's inline pattern (source the order → cross-check the figures →
 * publish with a date-stamp) so other hubs can reuse the exact same
 * component instead of re-describing the same idea in a different shape.
 */
export default function HowWeVerify({
  eyebrow = 'Built on the record, not guesswork',
  title = 'How we verify every tariff',
  sourceStepBody,
  crossCheckStepBody = 'Every slab, fixed charge and fee is encoded into a schema-validated file so the maths is reproducible and auditable.',
  verifiedDate,
  methodologyHref = '/methodology',
}: {
  eyebrow?: string
  title?: string
  /** Board/DISCOM-specific description of the primary source document. */
  sourceStepBody: string
  crossCheckStepBody?: string
  verifiedDate: string
  methodologyHref?: string
}) {
  const steps = [
    { n: '1', title: 'Source the order', body: sourceStepBody },
    { n: '2', title: 'Cross-check the figures', body: crossCheckStepBody },
    {
      n: '3',
      title: 'Publish with a date-stamp',
      body: 'Each calculator carries a verification status and last-checked date, linked back to its source order.',
      seal: true,
    },
  ]

  return (
    <div>
      <div className="text-center">
        <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
          {eyebrow}
        </span>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink-navy sm:text-3xl">
          {title}
        </h2>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl border border-hairline bg-paper p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass font-display text-lg font-bold text-white">
                {s.n}
              </span>
              {s.seal && (
                <span className="ml-auto flex items-center gap-1.5 rounded-full border border-seal-red/40 px-2.5 py-1 text-xs font-semibold text-seal-red">
                  <span aria-hidden>⦿</span> Verified {verifiedDate}
                </span>
              )}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink-navy">{s.title}</h3>
            <p className="mt-1 text-sm text-ash/80">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a href={methodologyHref} className="text-sm font-semibold text-brass hover:underline">
          Read the full methodology →
        </a>
      </div>
    </div>
  )
}
