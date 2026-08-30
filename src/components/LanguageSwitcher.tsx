'use client'

import { useState } from 'react'

const LANGS = [
  { code: 'EN', label: 'English', ready: true },
  { code: 'HI', label: 'हिन्दी', ready: false },
  { code: 'TA', label: 'தமிழ்', ready: false },
]

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-ash hover:border-brass dark:border-slate-700 dark:text-gazette-cream"
      >
        🌐 EN <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              role="menuitem"
              type="button"
              onClick={() => {
                if (l.ready) {
                  setNote('')
                  setOpen(false)
                } else {
                  setNote(`${l.label} coming soon`)
                }
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gazette-cream dark:hover:bg-slate-800 ${
                l.ready
                  ? 'font-semibold text-ash dark:text-gazette-cream'
                  : 'text-slate-400'
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
          {note && (
            <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500 dark:border-slate-800">
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
