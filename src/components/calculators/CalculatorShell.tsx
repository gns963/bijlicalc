import type { ReactNode } from 'react'

/** Shared header block used at the top of every calculator card — icon, title, subtitle. */
export function CalculatorHeader({
  icon,
  title,
  subtitle,
}: {
  icon: string
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-6 text-center">
      <span aria-hidden className="text-3xl">
        {icon}
      </span>
      <h3 className="mt-1 font-display text-2xl font-bold text-ink-navy">
        {title}
      </h3>
      <p className="mt-1 text-sm text-ash/70">
        {subtitle}
      </p>
    </div>
  )
}

/** A row of icon+label option cards — e.g. connection type, roof type. */
export function OptionCardGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns = 4,
}: {
  legend: string
  options: { value: T; label: string; icon: string }[]
  value: T
  onChange: (v: T) => void
  columns?: 2 | 3 | 4
}) {
  // A single option has nothing to toggle between — show it as a compact
  // status chip instead of a grid card flanked by empty cells.
  if (options.length === 1) {
    const only = options[0]
    return (
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ash">
          {legend}
        </span>
        <div className="inline-flex items-center gap-2 rounded-xl border-2 border-brass bg-brass/10 px-4 py-2 text-ink-navy">
          <span aria-hidden className="text-xl">
            {only.icon}
          </span>
          <span className="text-sm font-semibold">{only.label}</span>
          <span className="text-[10px] font-medium tracking-wide text-brass uppercase">
            only option
          </span>
        </div>
      </div>
    )
  }

  const effectiveColumns = Math.min(columns, options.length) as 2 | 3 | 4
  const cols =
    effectiveColumns === 2
      ? 'grid-cols-2'
      : effectiveColumns === 3
        ? 'grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-4'
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-ash">
        {legend}
      </legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition ${
                active
                  ? 'border-brass bg-brass/10 text-ink-navy'
                  : 'border-hairline text-ash/70 hover:border-brass/40'
              }`}
            >
              <span aria-hidden className="text-2xl">
                {o.icon}
              </span>
              <span className="text-xs font-semibold">{o.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** A slider synced with a compact number field — e.g. sanctioned load, hours/day. */
export function SliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  hint,
}: {
  id: string
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit: string
  hint?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-ash"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-brass"
        />
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-hairline bg-mist px-2.5 py-1.5">
          <span className="w-10 text-right font-display text-sm font-bold tabular-nums text-ink-navy">
            {value}
          </span>
          <span className="text-xs text-ash/60">
            {unit}
          </span>
        </div>
      </div>
      {hint && (
        <p className="mt-1 text-xs text-ash/50">
          {hint}
        </p>
      )}
    </div>
  )
}

/**
 * Prominent submit-style CTA + disclaimer, matching the "Calculate My Bill"
 * pattern. This is the primary button tier — brass fill — used sitewide for
 * the one main action on a calculator card. The financial hub is deliberately
 * the quietest hub, so it swaps the fill for ledger-indigo instead of brass.
 */
const CTA_TONE_CLASS: Record<string, string> = {
  brass: 'bg-brass hover:bg-brass/90',
  financial: 'bg-hub-financial hover:bg-hub-financial/90',
  appliance: 'bg-hub-appliance hover:bg-hub-appliance/90',
  fuel: 'bg-hub-fuel hover:bg-hub-fuel/90',
  water: 'bg-hub-water hover:bg-hub-water/90',
  gas: 'bg-hub-gas hover:bg-hub-gas/90',
}
const CTA_TONE_ICON: Record<string, string> = {
  brass: '⚡',
  financial: '📒',
  appliance: '🔌',
  fuel: '⛽',
  water: '💧',
  gas: '🔥',
}

export function CalculatorCta({
  label,
  onClick,
  tone = 'brass',
}: {
  label: string
  onClick?: () => void
  tone?: 'brass' | 'financial' | 'appliance' | 'fuel' | 'water' | 'gas'
}) {
  return (
    <div className="mt-1">
      <button
        type={onClick ? 'button' : 'submit'}
        onClick={onClick}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-semibold text-white shadow-sm transition ${CTA_TONE_CLASS[tone]}`}
      >
        <span aria-hidden>{CTA_TONE_ICON[tone]}</span>
        {label}
      </button>
      <p className="mt-2 text-center text-xs text-ash/50">
        Results are approximate estimates. Your actual bill may vary.
      </p>
    </div>
  )
}

export function CalculatorCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-hairline bg-paper p-6 shadow-sm">
      {children}
    </div>
  )
}
