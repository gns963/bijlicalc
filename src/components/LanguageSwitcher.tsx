'use client'

import { useState } from 'react'

const LANGS = [
  { code: 'EN', label: 'English', ready: true },
  { code: 'HI', label: 'हिन्दी', ready: false },
  { code: 'TA', label: 'தமிழ்', ready: false },
  { code: 'TE', label: 'తెలుగు', ready: false },
  { code: 'MR', label: 'मराठी', ready: false },
  { code: 'BN', label: 'বাংলা', ready: false },
  { code: 'KN', label: 'ಕನ್ನಡ', ready: false },
  { code: 'GU', label: 'ગુજરાતી', ready: false },
]

export default function LanguageSwitcher({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false)

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
        🌐 EN <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-hairline bg-paper shadow-lg"
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              role="menuitem"
              type="button"
              disabled={!l.ready}
              aria-disabled={!l.ready}
              title={l.ready ? undefined : `${l.label} — coming soon`}
              onClick={() => {
                if (l.ready) setOpen(false)
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                l.ready
                  ? 'font-semibold text-ash hover:bg-mist'
                  : 'cursor-not-allowed text-ash/35'
              }`}
            >
              {l.label}
              {l.ready ? (
                <span className="text-xs text-spark-teal">●</span>
              ) : (
                <span className="text-[10px] uppercase">soon</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
