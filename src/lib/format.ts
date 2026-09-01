/**
 * Deterministic INR formatting with Indian digit grouping (lakh/crore style).
 *
 * Intentionally NOT using Intl.NumberFormat: subtle ICU differences between the
 * Node server render and the browser can cause React hydration mismatches. A
 * pure string routine renders identically everywhere.
 */
export function formatINR(value: number): string {
  const negative = value < 0
  const [intPart, decPart] = Math.abs(value).toFixed(2).split('.')

  const last3 = intPart.slice(-3)
  const rest = intPart.slice(0, -3)
  const grouped = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3
    : last3

  return `${negative ? '-' : ''}₹${grouped}.${decPart}`
}

/** Human-friendly billing-cycle label, e.g. "bimonthly" → "bi-monthly". */
export function cycleLabel(cycle: string): string {
  if (cycle === 'bimonthly') return 'bi-monthly'
  return cycle
}

/** Formats an ISO `YYYY-MM-DD` string as e.g. "29 August 2026" (deterministic). */
export function formatIsoDate(iso: string): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${d} ${months[m - 1]} ${y}`
}

/** Kebab-case slug from a plain name, e.g. "Andaman & Nicobar Islands" → "andaman-nicobar-islands". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
