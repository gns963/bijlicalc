import type { RealWaterBillBreakdown } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'

type Tag = 'reducible' | 'fixed' | 'board-set' | 'check'

/**
 * Same badge system as the electricity BillComponentAudit: brass means "you
 * can influence this," ash/grey means "fixed, can't change."
 */
const TAG_STYLE: Record<Tag, { label: string; cls: string }> = {
  reducible: { label: 'Reducible', cls: 'bg-brass/15 text-brass' },
  fixed: { label: 'Fixed', cls: 'bg-ash/10 text-ash' },
  'board-set': { label: 'Set by board', cls: 'bg-ash/10 text-ash' },
  check: { label: 'Worth checking', cls: 'bg-brass/15 text-brass' },
}

/** Expandable, per-component breakdown of a real water bill — mirrors the
 *  electricity BillComponentAudit's exact pattern and tagging philosophy. */
/** Stable IDs shared with WaterBoardBillCalculator's cost-composition bar —
 *  clicking a bar segment there scrolls to and opens the matching item here.
 *  Keep these in sync if either component's line items change. */
export const AUDIT_ITEM_IDS = {
  water: 'audit-water',
  sewerage: 'audit-sewerage',
  fixed: 'audit-fixed',
} as const

export default function WaterBillComponentAudit({ bill }: { bill: RealWaterBillBreakdown }) {
  const items: { id: string; title: string; amount: number; tag: Tag; body: string }[] = [
    {
      id: AUDIT_ITEM_IDS.water,
      title: 'Water charge',
      amount: bill.waterCharge,
      tag: 'reducible',
      body: bill.freeAllowanceApplied
        ? `Waived entirely — your consumption is within the board's free threshold. Staying under it is the single biggest lever you have.`
        : `Priced across telescopic slabs — the more you use, the higher the marginal rate. Cutting usage below your next slab threshold lowers this line directly. This example totals ${formatINR(bill.waterCharge)}.`,
    },
    {
      id: AUDIT_ITEM_IDS.sewerage,
      title: 'Sewerage charge',
      amount: bill.sewerageCharge,
      tag: 'board-set',
      body: `A wastewater treatment and disposal fee, calculated as a fixed percentage of your water charge — it falls automatically whenever your water charge does, but the percentage itself is set by the board, not something you can change directly.`,
    },
    {
      id: AUDIT_ITEM_IDS.fixed,
      title: 'Fixed charge',
      amount: bill.fixedCharge,
      tag: 'fixed',
      body: `Charged regardless of how much water you use, based on your connection's meter size (${bill.meterSize}). The only way to change this line is to change your connection's meter size or category.`,
    },
  ]

  if (bill.additionalFeesTotal > 0) {
    items.push({
      id: 'audit-additional-fees',
      title: 'Additional fees',
      amount: bill.additionalFeesTotal,
      tag: 'check',
      body: 'One or more board-specific fees apply on top of the standard charges — worth checking against your paper bill to confirm which one and why.',
    })
  }

  return (
    <div className="divide-y divide-hairline rounded-xl border border-hairline bg-paper">
      {items.map((item) => (
        <details key={item.title} id={item.id} className="group scroll-mt-24 p-4 transition-colors duration-700">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="font-semibold text-ink-navy">{item.title}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TAG_STYLE[item.tag].cls}`}
              >
                {TAG_STYLE[item.tag].label}
              </span>
            </span>
            <span className="flex items-center gap-2 tabular-nums text-ash">
              {formatINR(item.amount)}
              <span className="text-brass transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-2 text-sm text-ash/70">{item.body}</p>
        </details>
      ))}
    </div>
  )
}
