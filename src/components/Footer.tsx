import Link from 'next/link'

const BOTTOM_GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Editorial Team', href: '/author/editorial-team' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Trust',
    links: [
      { label: 'Methodology', href: '/methodology' },
      { label: 'Data Sources', href: '/data-sources' },
      { label: 'Editorial Policy', href: '/editorial-policy' },
      { label: 'Sitemap (XML)', href: '/sitemap.xml' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
    ],
  },
]

const CATEGORIES = [
  { emoji: '⚡', label: 'Electricity', href: '/electricity' },
  { emoji: '☀️', label: 'Solar', href: '/solar' },
  { emoji: '❄️', label: 'Air Conditioning', href: '/ac' },
  { emoji: '💧', label: 'Water', href: '/water' },
  { emoji: '🔥', label: 'Gas', href: '/gas' },
  { emoji: '🔌', label: 'Appliances', href: '/appliances' },
  { emoji: '⛽', label: 'Fuel Cost', href: '/fuel-cost' },
  { emoji: '🧮', label: 'Finance', href: '/financial' },
]

const TRUST_STATS = [
  ['36', 'States & UTs'],
  ['200+', 'Calculators'],
  ['100%', 'Free, no login'],
  ['SERC', 'Source-verified'],
]

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t-4 border-brass hero-gradient text-gazette-cream/80">
      <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-10">
        <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
          We calculate it <span className="text-brass">precisely.</span>
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_1fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-extrabold text-brass">
              DesiMetrics
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gazette-cream/60">
              Free calculators for Indian electricity bills, rooftop solar, AC
              running cost and everyday finance — every tariff
              schema-validated against the source SERC order, not
              approximated from a national average.
            </p>
            <div className="mt-6 grid max-w-xs grid-cols-2 gap-2.5">
              {TRUST_STATS.map(([big, small]) => (
                <div
                  key={small}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-center"
                >
                  <p className="font-display text-lg font-extrabold text-brass">{big}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-gazette-cream/50">{small}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-white uppercase">
              Categories
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="flex items-center gap-2 text-gazette-cream/60 hover:text-brass"
                  >
                    <span aria-hidden>{c.emoji}</span>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {BOTTOM_GROUPS.map((g) => (
            <div key={g.heading}>
              <p className="text-sm font-semibold tracking-wide text-white uppercase">
                {g.heading}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gazette-cream/60 hover:text-brass">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-gazette-cream/10 px-4 py-4 text-center text-xs text-gazette-cream/40">
        © 2026 DesiMetrics · Estimates only — always confirm against your
        official utility bill.
      </div>
    </footer>
  )
}
