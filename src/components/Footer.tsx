import Link from 'next/link'

interface ToolColumn {
  heading: string
  icon: string
  accent: string
  links: { label: string; href: string }[]
  allLabel: string
  allHref: string
}

// Only real, live pages — no placeholder tools we haven't built yet.
const TOOL_COLUMNS: ToolColumn[] = [
  {
    heading: 'Electricity Tools',
    icon: '⚡',
    accent: 'text-brass',
    links: [
      { label: 'Tamil Nadu (TNEB)', href: '/electricity/tneb-bill-calculator' },
      { label: 'Maharashtra (MSEDCL)', href: '/electricity/msedcl-bill-calculator' },
      { label: 'Karnataka (BESCOM)', href: '/electricity/bescom-bill-calculator' },
      { label: 'Kerala (KSEB)', href: '/electricity/kseb-bill-calculator' },
      { label: 'Delhi (BRPL)', href: '/electricity/delhi-electricity-bill-calculator' },
    ],
    allLabel: 'All 36 states →',
    allHref: '/electricity',
  },
  {
    heading: 'Solar Tools',
    icon: '☀️',
    accent: 'text-spark-teal',
    links: [
      { label: 'Solar ROI Calculator', href: '/solar/roi-calculator' },
      { label: 'PM Surya Ghar Subsidy', href: '/solar/subsidy-calculator' },
    ],
    allLabel: 'All solar tools →',
    allHref: '/solar',
  },
  {
    heading: 'AC Calculators',
    icon: '❄️',
    accent: 'text-brass',
    links: [
      { label: 'AC Running Cost', href: '/ac/bill-calculator' },
      { label: 'AC Tonnage Calculator', href: '/ac/tonnage-calculator' },
      { label: '3★ vs 5★ Savings', href: '/ac/comparisons/3-star-vs-5-star-savings-guide' },
    ],
    allLabel: 'All AC tools →',
    allHref: '/ac',
  },
  {
    heading: 'Financial Calculators',
    icon: '🧮',
    accent: 'text-spark-teal',
    links: [
      { label: 'GST Calculator', href: '/financial/gst-calculator' },
      { label: 'SIP Calculator', href: '/financial/sip-calculator' },
      { label: 'New vs Old Tax Regime', href: '/financial/new-vs-old-tax-regime-calculator' },
      { label: 'Gratuity Calculator', href: '/financial/gratuity-calculator' },
    ],
    allLabel: 'All financial tools →',
    allHref: '/financial',
  },
]

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
      {/* Tool directory */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TOOL_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className={`flex items-center gap-1.5 font-display text-sm font-bold ${col.accent}`}>
                <span aria-hidden>{col.icon}</span> {col.heading}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gazette-cream/70 hover:text-gazette-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={col.allHref} className={`font-semibold ${col.accent}`}>
                    {col.allLabel}
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gazette-cream/10">
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
      </div>

      <div className="border-t border-gazette-cream/10 px-4 py-4 text-center text-xs text-gazette-cream/40">
        © 2026 bijlicalc · Estimates only — always confirm against your
        official utility bill.
      </div>
    </footer>
  )
}
