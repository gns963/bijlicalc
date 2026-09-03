'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { MEGA_MENU } from '@/data/megamenu'

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [openHub, setOpenHub] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // On the homepage the header rides transparently over the hero's green
  // gradient (no white bar) until the page scrolls past the hero, then it
  // solidifies like on every other page.
  const transparent = isHome && !scrolled

  useEffect(() => {
    if (!isHome) return
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  function openNow(key: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenHub(key)
  }

  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    // Small grace period so a quick/imprecise mouse move from the button
    // down into the panel doesn't get read as "left the menu" and close it
    // before the click on a submenu link registers.
    closeTimer.current = setTimeout(() => setOpenHub(null), 200)
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenHub(null)
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenHub(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  // Close the mega menu on route change away from the header (best-effort:
  // any nav link click also closes it via onClick handlers below).

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors ${
        transparent
          ? 'border-transparent bg-transparent'
          : 'border-hairline/70 bg-paper/85 backdrop-blur'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="font-display text-xl font-bold tracking-tight text-brass">
            DesiMetrics
          </span>
        </Link>

        {/* Desktop mega menu */}
        <div ref={navRef} className="hidden items-center gap-1 lg:flex">
          {MEGA_MENU.map((hub) => {
            const isOpen = openHub === hub.key
            return (
              <div
                key={hub.key}
                className="relative"
                onMouseEnter={() => openNow(hub.key)}
                onMouseLeave={closeSoon}
              >
                <button
                  type="button"
                  onClick={() => openNow(hub.key)}
                  onFocus={() => openNow(hub.key)}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                    transparent
                      ? isOpen
                        ? 'bg-white/10 text-spark-teal'
                        : 'text-white/80 hover:text-spark-teal'
                      : isOpen
                        ? 'bg-mist text-brass'
                        : 'text-ash hover:text-brass'
                  }`}
                >
                  {hub.label}
                  <span
                    aria-hidden
                    className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  >
                    ▾
                  </span>
                </button>

                {isOpen && (
                  // No margin-top here on purpose: the panel sits flush
                  // against the button (top-full, zero gap) with padding
                  // INSIDE the hoverable box instead, so the mouse never
                  // exits the hub's relative container while moving from
                  // the button down into the panel.
                  <div className="absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2">
                  <div
                    role="menu"
                    className="flex gap-8 rounded-xl border border-hairline bg-paper p-6 shadow-xl"
                    style={{ minWidth: 'max-content' }}
                  >
                    {hub.columns.map((col) => (
                      <div key={col.heading} className="w-56">
                        <p className="mb-3 text-[11px] font-semibold tracking-wide text-ash/50 uppercase">
                          {col.heading}
                        </p>
                        <ul className="space-y-2.5">
                          {col.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={() => setOpenHub(null)}
                                className="group flex items-start gap-2 rounded-lg px-1.5 py-1 -mx-1.5 hover:bg-mist"
                              >
                                {link.icon && (
                                  <span className="mt-0.5 text-base" aria-hidden>
                                    {link.icon}
                                  </span>
                                )}
                                <span>
                                  <span className="block text-sm font-semibold text-ink-navy group-hover:text-brass">
                                    {link.label}
                                  </span>
                                  {link.sub && (
                                    <span className="block text-xs text-ash/50">
                                      {link.sub}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {col.viewAllHref && (
                          <Link
                            href={col.viewAllHref}
                            onClick={() => setOpenHub(null)}
                            className="mt-3 flex items-center gap-1 border-t border-hairline pt-3 text-sm font-semibold text-brass hover:underline"
                          >
                            {col.viewAllLabel ?? 'View all'} <span aria-hidden>→</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <LanguageSwitcher transparent={transparent} />
          </div>
          <Link
            href="/electricity"
            className="hidden rounded-full bg-brass px-3.5 py-2 text-sm font-semibold text-gazette-cream transition hover:bg-brass/90 sm:block"
          >
            Calculate Now
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border lg:hidden ${
              transparent
                ? 'border-white/30 text-white'
                : 'border-hairline text-ash'
            }`}
          >
            <span aria-hidden className="text-lg">
              {mobileOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile accordion menu */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-57px)] overflow-y-auto border-t border-hairline bg-paper px-4 py-3 lg:hidden">
          {MEGA_MENU.map((hub) => {
            const isExpanded = mobileExpanded === hub.key
            return (
              <div key={hub.key} className="border-b border-hairline last:border-b-0">
                <button
                  type="button"
                  onClick={() => setMobileExpanded((cur) => (cur === hub.key ? null : hub.key))}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-ink-navy"
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden>{hub.emoji}</span>
                    {hub.label}
                  </span>
                  <span aria-hidden className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>
                {isExpanded && (
                  <div className="pb-3 pl-6">
                    {hub.columns.map((col) => (
                      <div key={col.heading} className="mb-3">
                        <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-ash/50 uppercase">
                          {col.heading}
                        </p>
                        <ul className="space-y-2">
                          {col.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm text-ash hover:text-brass"
                              >
                                {link.label}
                                {link.sub && (
                                  <span className="text-ash/40"> — {link.sub}</span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {col.viewAllHref && (
                          <Link
                            href={col.viewAllHref}
                            onClick={() => setMobileOpen(false)}
                            className="mt-2 inline-block text-sm font-semibold text-brass"
                          >
                            {col.viewAllLabel ?? 'View all'} →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <div className="flex items-center justify-between py-3">
            <LanguageSwitcher />
            <Link
              href="/electricity"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-brass px-3.5 py-2 text-sm font-semibold text-gazette-cream"
            >
              Calculate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
