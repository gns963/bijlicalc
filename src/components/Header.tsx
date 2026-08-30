import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const NAV = [
  { label: 'Electricity', href: '/electricity' },
  { label: 'Solar', href: '/solar' },
  { label: 'AC', href: '/ac' },
  { label: 'Financial', href: '/financial' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-[#0f1420]/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-navy text-brass"
          >
            ⚡
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink-navy dark:text-gazette-cream">
            bijli<span className="text-brass">calc</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ash md:flex dark:text-gazette-cream/80">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brass">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/electricity"
            className="rounded-lg bg-brass px-3.5 py-2 text-sm font-semibold text-ink-navy transition hover:bg-brass/90"
          >
            Calculate Now
          </Link>
        </div>
      </div>
    </header>
  )
}
