import Link from 'next/link'

const GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Trust',
    links: [
      { label: 'Methodology', href: '/methodology' },
      { label: 'Data Sources', href: '/data-sources' },
      { label: 'Editorial Policy', href: '/editorial-policy' },
      { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            bijlicalc
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Free Indian utility calculators — electricity, AC running cost and
            solar ROI.
          </p>
        </div>
        {GROUPS.map((g) => (
          <div key={g.heading}>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {g.heading}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-500 hover:text-indigo-600 dark:text-slate-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-400 dark:border-slate-800">
        © 2026 bijlicalc · Estimates only — always confirm against your official
        utility bill.
      </div>
    </footer>
  )
}
