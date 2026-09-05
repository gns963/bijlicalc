'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LANGS = [
  { code: 'EN', label: 'English', ready: true },
  { code: 'HI', label: 'हिन्दी', ready: true },
  { code: 'TA', label: 'தமிழ்', ready: true },
  { code: 'TE', label: 'తెలుగు', ready: true },
  { code: 'MR', label: 'मराठी', ready: true },
  { code: 'BN', label: 'বাংলা', ready: true },
  { code: 'KN', label: 'ಕನ್ನಡ', ready: true },
  { code: 'GU', label: 'ગુજરાતી', ready: true },
]

const LOCALE_CODES = ['hi', 'ta', 'te', 'mr', 'bn', 'kn', 'gu']

/**
 * Route patterns with a real per-page translation, beyond the homepage.
 * `locales` lists which of LOCALE_CODES actually have that route built —
 * add one entry here per template as it gets translated (see
 * src/data/discom-page-texts.ts for the electricity pattern to follow).
 * Everything not matched here, and not on a homepage, falls back to the
 * "home only" disabled state rather than silently navigating away.
 */
const TRANSLATED_ROUTES: { pattern: RegExp; locales: string[] }[] = [
  { pattern: /^\/electricity\/[^/]+$/, locales: ['hi'] },
]

/** Strips a leading locale segment (if any) to get the canonical,
 *  locale-agnostic path — e.g. "/hi/electricity/x" -> "/electricity/x". */
function canonicalPath(pathname: string): string {
  const match = LOCALE_CODES.find((c) => pathname === `/${c}` || pathname.startsWith(`/${c}/`))
  return match ? pathname.slice(match.length + 1) || '/' : pathname
}

/** Resolves the real translated URL for a given target locale code (lowercase,
 *  e.g. "hi") from the current pathname, or null if no such page exists. */
function resolveTranslatedHref(pathname: string, targetLocale: string): string | null {
  const canonical = canonicalPath(pathname)
  if (targetLocale === 'en') return canonical
  const route = TRANSLATED_ROUTES.find((r) => r.pattern.test(canonical))
  if (!route || !route.locales.includes(targetLocale)) return null
  return `/${targetLocale}${canonical}`
}

export default function LanguageSwitcher({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() ?? '/'
  const currentLocale = LOCALE_CODES.find((c) => pathname.startsWith(`/${c}`))
  const currentCode = currentLocale?.toUpperCase() ?? 'EN'
  const onHomepage = pathname === '/' || LOCALE_CODES.some((c) => pathname === `/${c}`)

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
          {LANGS.map((l) => {
            const targetLocale = l.code.toLowerCase()
            // On a homepage, every ready language has always had a real
            // translated homepage to go to. Off the homepage, only routes
            // explicitly listed in TRANSLATED_ROUTES have a real page —
            // everything else would silently carry the visitor away.
            const href = onHomepage
              ? targetLocale === 'en'
                ? '/'
                : `/${targetLocale}`
              : resolveTranslatedHref(pathname, targetLocale)
            const canNavigate = l.ready && href !== null
            if (canNavigate && href) {
              return (
                <Link
                  key={l.code}
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-mist ${
                    l.code === currentCode ? 'font-semibold text-brass' : 'text-ash'
                  }`}
                >
                  {l.label}
                  <span className="text-xs text-spark-teal">●</span>
                </Link>
              )
            }
            const homepageOnly = l.ready && !onHomepage
            return (
              <button
                key={l.code}
                role="menuitem"
                type="button"
                disabled
                aria-disabled="true"
                title={
                  homepageOnly
                    ? `${l.label} — not translated for this page yet`
                    : `${l.label} — coming soon`
                }
                className="flex w-full cursor-not-allowed items-center justify-between px-3 py-2 text-left text-sm text-ash/35"
              >
                {l.label}
                <span className="text-[10px] uppercase">
                  {homepageOnly ? 'not yet' : 'soon'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
