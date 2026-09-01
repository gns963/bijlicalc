export const PM_SURYA_GHAR_STEPS = [
  {
    title: 'Register on the national portal',
    body: "Create an account at pmsuryaghar.gov.in with your electricity consumer number, mobile number and state/DISCOM.",
    timeframe: 'Same day',
  },
  {
    title: 'Choose an empanelled vendor',
    body: "Pick a DISCOM-empanelled installer from the portal's vendor list and get a feasibility-approved quote for your roof.",
    timeframe: '1–2 weeks',
  },
  {
    title: 'Installation & net-meter application',
    body: 'The vendor installs the system to your approved specification; you then apply for a net meter through the portal.',
    timeframe: '2–4 weeks',
  },
  {
    title: 'Inspection & subsidy disbursal',
    body: 'After DISCOM inspection and net-meter commissioning, the subsidy is credited directly to your registered bank account.',
    timeframe: '4–8 weeks',
  },
]

export default function HowToApplyPMSuryaGhar() {
  return (
    <section aria-labelledby="how-to-apply" className="mb-10">
      <h2 id="how-to-apply" className="font-display mb-4 text-2xl font-semibold">
        How to Apply for PM Surya Ghar
      </h2>
      <ol className="space-y-4">
        {PM_SURYA_GHAR_STEPS.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-hub-solar font-display text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-ink-navy dark:text-gazette-cream">
                {s.title}{' '}
                <span className="ml-1 text-xs font-normal text-ash/50 dark:text-gazette-cream/40">
                  ~{s.timeframe}
                </span>
              </p>
              <p className="mt-0.5 text-sm text-ash/70 dark:text-gazette-cream/60">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-4">
        <p className="text-sm font-semibold text-caution-amber">Eligibility</p>
        <ul className="mt-2 space-y-1 text-sm text-ash/80 dark:text-gazette-cream/70">
          <li>• You must own the roof/property, or have the owner&apos;s consent</li>
          <li>• A valid, active residential electricity connection</li>
          <li>• Haven&apos;t previously availed a rooftop solar subsidy on this connection</li>
          <li>• System must use Made-in-India (DCR) solar panels and MNRE-approved components</li>
        </ul>
      </div>
    </section>
  )
}
