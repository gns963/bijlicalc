/** One odometer drum: a 0–9 strip that rolls to `digit`. Shared by MeterDial
 * and any other component using the analog-meter digit-roll motif. Respects
 * prefers-reduced-motion via the `.drum-strip` rule in globals.css. */
export function Drum({
  digit,
  className = 'h-11 w-7 text-xl',
}: {
  digit: string
  className?: string
}) {
  const n = Number(digit)
  const numeric = digit >= '0' && digit <= '9'
  // Every element here is a <span>, not a <div> — this markup is also used
  // inline inside a <p> (WorkedExampleTotal), and a <div> descendant of a
  // <p> is invalid HTML that breaks hydration. Absolute/flex positioning
  // works identically on inline-block spans as it does on divs.
  return (
    <span
      className={`relative inline-block overflow-hidden rounded-sm bg-mist shadow-inner ring-1 ring-black/20 ${className}`}
    >
      {numeric ? (
        <span
          className="drum-strip absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-out"
          style={{ height: '1000%', transform: `translateY(-${n * 10}%)` }}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="flex h-[10%] items-center justify-center font-display font-bold tabular-nums text-ash"
            >
              {i}
            </span>
          ))}
        </span>
      ) : (
        <span className="flex h-full items-center justify-center font-display font-bold text-ash">
          {digit}
        </span>
      )}
    </span>
  )
}
