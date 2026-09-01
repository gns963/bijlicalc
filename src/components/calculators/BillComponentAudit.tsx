import type { BillBreakdown } from '@/lib/calc/electricity'
import { formatINR } from '@/lib/format'

type Tag = 'reducible' | 'fixed' | 'discom-set' | 'check' | 'statutory'

/**
 * Exactly one badge system, two colors: brass means "you can influence this,"
 * ash/grey means "fixed, can't change" — nothing else. Reducible spend and
 * things worth double-checking are both actionable, so both read brass;
 * DISCOM-set, statutorily fixed and flat charges are all equally out of your
 * control, so all three read neutral ash.
 */
const TAG_STYLE: Record<Tag, { label: string; cls: string }> = {
  reducible: { label: 'Reducible', cls: 'bg-brass/15 text-brass' },
  fixed: { label: 'Fixed', cls: 'bg-ash/10 text-ash dark:text-gazette-cream/70' },
  'discom-set': { label: 'Set by DISCOM', cls: 'bg-ash/10 text-ash dark:text-gazette-cream/70' },
  check: { label: 'Worth checking', cls: 'bg-brass/15 text-brass' },
  statutory: { label: 'Statutory', cls: 'bg-ash/10 text-ash dark:text-gazette-cream/70' },
}

/**
 * Expandable, per-component breakdown of a representative bill. Uses native
 * <details>/<summary> — content is in the DOM without JS, matching the rest
 * of the site's accessible-disclosure pattern.
 *
 * Tags are our own product guidance (not claims about DISCOM error rates) —
 * framed as "worth checking" rather than asserting the DISCOM gets it wrong.
 */
export default function BillComponentAudit({ bill }: { bill: BillBreakdown }) {
  const items: { title: string; amount: number; tag: Tag; body: string }[] = [
    {
      title: 'Energy charge',
      amount: bill.energyChargeGross,
      tag: 'reducible',
      body: `Priced across telescopic slabs — the more you use, the higher the marginal rate. Shifting usage below your next slab threshold lowers this line directly. This example totals ${formatINR(bill.energyChargeGross)}.`,
    },
  ]

  if (bill.subsidy.subsidyAmount > 0 || bill.subsidy.appliedSchemes.length > 0) {
    items.push({
      title: 'Subsidy',
      amount: bill.subsidy.subsidyAmount,
      tag: 'check',
      body: `${bill.subsidy.appliedSchemes.join(', ') || 'A subsidy scheme'} reduced this bill by ${formatINR(bill.subsidy.subsidyAmount)}. This is the one line worth double-checking against your paper bill — confirm your eligibility status is correctly marked.`,
    })
  }

  items.push({
    title: 'Fuel cost adjustment (FCA)',
    amount: bill.fuelCostAdjustment.amount,
    tag: 'discom-set',
    body: `A ₹${bill.fuelCostAdjustment.ratePerUnit}/unit pass-through surcharge that tracks the DISCOM's power-purchase cost. It applies equally to every consumer on this tariff and isn't something you can reduce by changing usage.`,
  })

  items.push({
    title: 'Fixed charge',
    amount: bill.fixedCharge.amount,
    tag: 'fixed',
    body: `Charged regardless of how many units you use (${bill.fixedCharge.detail}). The only way to change this line is to change your phase, sanctioned load, or connection type.`,
  })

  if (bill.electricityDuty.amount > 0) {
    items.push({
      title: 'Electricity duty',
      amount: bill.electricityDuty.amount,
      tag: 'statutory',
      body: `A ${bill.electricityDuty.percent}% state government levy on the energy charge — set by statute, not by the DISCOM, and not reducible by usage pattern.`,
    })
  }

  if (bill.meterRent > 0) {
    items.push({
      title: 'Meter rent',
      amount: bill.meterRent,
      tag: 'fixed',
      body: 'A small fixed monthly charge for the meter itself, independent of usage.',
    })
  }

  return (
    <div className="divide-y divide-hairline rounded-xl border border-hairline bg-paper dark:divide-white/10 dark:border-white/10 dark:bg-slate-900">
      {items.map((item) => (
        <details key={item.title} className="group p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="font-semibold text-ink-navy dark:text-gazette-cream">
                {item.title}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TAG_STYLE[item.tag].cls}`}
              >
                {TAG_STYLE[item.tag].label}
              </span>
            </span>
            <span className="flex items-center gap-2 tabular-nums text-ash dark:text-gazette-cream/80">
              {formatINR(item.amount)}
              <span className="text-brass transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-2 text-sm text-ash/70 dark:text-gazette-cream/60">
            {item.body}
          </p>
        </details>
      ))}
    </div>
  )
}
