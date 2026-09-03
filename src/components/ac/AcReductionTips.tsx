const TIPS = [
  'Set the thermostat to 24–26°C rather than the coldest setting — each degree lower adds meaningfully to compressor runtime.',
  'Use the "auto" fan mode instead of forcing the lowest fan speed, which makes the compressor work harder for the same cooling.',
  'Get filters and coils cleaned every season — restricted airflow is one of the most common hidden causes of a rising bill.',
  'Seal window and door gaps and use curtains on sun-facing windows to cut the heat load the AC has to fight.',
  'Use a ceiling fan alongside the AC — it lets you raise the thermostat a degree or two without losing comfort.',
  'If you\'re buying new, choose a correctly-sized 5-star inverter model rather than an oversized unit — check our tonnage calculator first.',
]

export default function AcReductionTips() {
  return (
    <ol className="space-y-3">
      {TIPS.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hub-ac font-display text-xs font-bold text-white">
            {i + 1}
          </span>
          <span className="text-ash/80">{t}</span>
        </li>
      ))}
    </ol>
  )
}
