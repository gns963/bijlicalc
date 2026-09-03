'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

// Only the homepage has a real translation so far in each language (see
// src/app/{hi,ta,te,mr,bn,kn,gu}/). Every ready language links to its
// nearest translated page — today that's always the homepage, not a
// per-page equivalent, since only Phase 1 of the i18n rollout is built.
const LANGS = [
  { code: 'EN', label: 'English', ready: true, href: '/' },
  { code: 'HI', label: 'हिन्दी', ready: true, href: '/hi' },
  { code: 'TA', label: 'தமிழ்', ready: true, href: '/ta' },
  { code: 'TE', label: 'తెలుగు', ready: true, href: '/te' },
  { code: 'MR', label: 'मराठी', ready: true, href: '/mr' },
  { code: 'BN', label: 'বাংলা', ready: true, href: '/bn' },
  { code: 'KN', label: 'ಕನ್ನಡ', ready: true, href: '/kn' },
  { code: 'GU', label: 'ગુજરાતી', ready: true, href: '/gu' },
]

const LOCALE_CODES = ['hi', 'ta', 'te', 'mr', 'bn', 'kn', 'gu']

export default function LanguageSwitcher({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const currentLocale = LOCALE_CODES.find((c) => pathname?.startsWith(`/${c}`))
  const currentCode = currentLocale?.toUpperCase() ?? 'EN'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${
          transparent
            ? 'border-white/30 text-white hover:border-white/60'
            : 'border-hairline text-ash hover:border-brass'
        }`}
      >
        🌐 {currentCode} <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-hairline bg-paper shadow-lg"
        >
          {LANGS.map((l) =>
            l.ready && l.href ? (
              <Link
                key={l.code}
                href={l.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-mist ${
                  l.code === currentCode ? 'font-semibold text-brass' : 'text-ash'
                }`}
              >
                {l.label}
                <span className="text-xs text-spark-teal">●</span>
              </Link>
            ) : (
              <button
                key={l.code}
                role="menuitem"
                type="button"
                disabled
                aria-disabled="true"
                title={`${l.label} — coming soon`}
                className="flex w-full cursor-not-allowed items-center justify-between px-3 py-2 text-left text-sm text-ash/35"
              >
                {l.label}
                <span className="text-[10px] uppercase">soon</span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
