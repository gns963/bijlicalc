/**
 * Small decorative motif icons for specific hubs — plain SVG, inherit color
 * via currentColor from the parent's text-hub-* class. Not interactive, not
 * a data visualization — just a visual signature next to a hero H1.
 */

export function FuelGaugeIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M4 24a12 12 0 1 1 24 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M16 24 22 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="24" r="1.8" fill="currentColor" />
      <path d="M6.5 21.5h1.2M25.5 21.5h-1.2M10 13l.9.9M22 13l-.9.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function DropletIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 4c5 6.5 9 11.6 9 16.2A9 9 0 1 1 7 20.2C7 15.6 11 10.5 16 4Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 21.5a4.5 4.5 0 0 0 4.5 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

export function FlameIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 4c1 4-4 6-4 10.5A6.5 6.5 0 0 0 16 27a6.5 6.5 0 0 0 6.5-6.5c0-2-1-3-2-4 .3 2-1 3-1.5 2.5C20 16 18 13.5 16 4Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
