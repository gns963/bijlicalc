import Link from 'next/link'

const BOTTOM_GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
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

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink-navy text-gazette-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-gazette-cream">
            bijli<span className="text-brass">calc</span>
          </p>
          <p className="mt-2 text-sm text-gazette-cream/60">
            Free, source-cited calculators for Indian electricity bills,
            solar, AC running cost and personal finance — verified against
            real DISCOM tariffs.
          </p>
        </div>
        {BOTTOM_GROUPS.map((g) => (
          <div key={g.heading}>
            <p className="text-sm font-semibold text-gazette-cream">
              {g.heading}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
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

      <div className="border-t border-gazette-cream/10 px-4 py-4 text-center text-xs text-gazette-cream/40">
        © 2026 bijlicalc · Estimates only — always confirm against your
        official utility bill.
      </div>
    </footer>
  )
}
