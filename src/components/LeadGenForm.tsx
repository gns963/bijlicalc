'use client'

import { useState } from 'react'

export interface LeadGenFormProps {
  /** Tags the submission so we know which page it came from. */
  source?: string
  heading?: string
  subheading?: string
  /** 'glass' sits the form on a dark gradient (e.g. the homepage hero-style band); 'light' is the default paper card used everywhere else. */
  tone?: 'light' | 'glass'
}

type RoofType = 'concrete' | 'tin' | 'other' | ''

const PINCODE_RE = /^[1-9][0-9]{5}$/ // Indian PIN: 6 digits, not starting with 0
const PHONE_RE = /^[6-9][0-9]{9}$/ // Indian mobile: 10 digits, starts 6–9

export default function LeadGenForm({
  source = 'unknown',
  heading = 'Get 3 free installer quotes',
  subheading = 'Tell us a bit about your home and we’ll connect you with verified rooftop solar installers in your area.',
  tone = 'light',
}: LeadGenFormProps) {
  const [pincode, setPincode] = useState('')
  const [bill, setBill] = useState('')
  const [roofType, setRoofType] = useState<RoofType>('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!PINCODE_RE.test(pincode.trim()))
      e.pincode = 'Enter a valid 6-digit PIN code.'
    const billNum = Number(bill)
    if (!bill.trim() || !Number.isFinite(billNum) || billNum <= 0)
      e.bill = 'Enter your monthly bill amount in ₹.'
    if (!roofType) e.roofType = 'Select your roof type.'
    if (!PHONE_RE.test(phone.trim()))
      e.phone = 'Enter a valid 10-digit mobile number.'
    return e
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const submission = {
      source,
      pincode: pincode.trim(),
      monthlyBill: Number(bill),
      roofType,
      phone: phone.trim(),
      // NOTE: backend is a stub — nothing is stored or sent yet.
      submittedAt: new Date().toISOString(),
    }
    // TODO: replace with real lead routing/storage once installer partnerships land.
    console.log('[LeadGenForm] submission', submission)
    setSubmitted(true)
  }

  const glass = tone === 'glass'

  if (submitted) {
    return (
      <div
        className={
          glass
            ? 'rounded-2xl border border-white/15 bg-white/[0.07] p-6 text-center shadow-xl backdrop-blur-md'
            : 'rounded-2xl border border-hairline bg-paper p-6 text-center shadow-lg'
        }
        role="status"
      >
        <p className="text-3xl">✅</p>
        <p className="mt-2 text-lg font-semibold text-spark-teal">
          Thanks — we’ll connect you with 3 verified installers.
        </p>
        <p className={`mt-1 text-sm ${glass ? 'text-white/70' : 'text-ash/70'}`}>
          Keep an eye on your phone; quotes typically arrive within 2 working
          days.
        </p>
      </div>
    )
  }

  const inputCls = glass
    ? 'w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brass/40 bg-white/10 text-white placeholder:text-white/40'
    : 'w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brass/20'
  const okBorder = glass
    ? 'border-white/20 focus:border-brass'
    : 'border-hairline focus:border-brass'
  const errBorder = glass
    ? 'border-red-400/70 focus:border-red-400'
    : 'border-red-400 focus:border-red-500'
  const labelCls = glass ? 'mb-1 block text-sm font-medium text-white/90' : 'mb-1 block text-sm font-medium'

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={
        glass
          ? 'rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-xl backdrop-blur-md'
          : 'rounded-2xl border border-hairline bg-paper p-6 shadow-lg'
      }
    >
      <h3
        className={`font-display text-xl font-semibold ${glass ? 'text-white' : 'text-ink-navy'}`}
      >
        {heading}
      </h3>
      <p className={`mt-1 text-sm ${glass ? 'text-white/70' : 'text-ash/70'}`}>
        {subheading}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lg-pincode" className={labelCls}>
            PIN code
          </label>
          <input
            id="lg-pincode"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            aria-invalid={!!errors.pincode}
            className={`${inputCls} ${errors.pincode ? errBorder : okBorder}`}
            placeholder="560001"
          />
          {errors.pincode && (
            <p className="mt-1 text-xs text-red-400">{errors.pincode}</p>
          )}
        </div>

        <div>
          <label htmlFor="lg-bill" className={labelCls}>
            Monthly electricity bill (₹)
          </label>
          <input
            id="lg-bill"
            inputMode="numeric"
            value={bill}
            onChange={(e) => setBill(e.target.value.replace(/[^\d.]/g, ''))}
            aria-invalid={!!errors.bill}
            className={`${inputCls} ${errors.bill ? errBorder : okBorder}`}
            placeholder="2500"
          />
          {errors.bill && <p className="mt-1 text-xs text-red-400">{errors.bill}</p>}
        </div>

        <div>
          <label htmlFor="lg-roof" className={labelCls}>
            Roof type
          </label>
          <select
            id="lg-roof"
            value={roofType}
            onChange={(e) => setRoofType(e.target.value as RoofType)}
            aria-invalid={!!errors.roofType}
            className={`${inputCls} ${errors.roofType ? errBorder : okBorder}`}
          >
            <option value="" className={glass ? 'text-ash' : ''}>
              Select…
            </option>
            <option value="concrete" className={glass ? 'text-ash' : ''}>
              Concrete (RCC)
            </option>
            <option value="tin" className={glass ? 'text-ash' : ''}>
              Tin / metal sheet
            </option>
            <option value="other" className={glass ? 'text-ash' : ''}>
              Other
            </option>
          </select>
          {errors.roofType && (
            <p className="mt-1 text-xs text-red-400">{errors.roofType}</p>
          )}
        </div>

        <div>
          <label htmlFor="lg-phone" className={labelCls}>
            Mobile number
          </label>
          <input
            id="lg-phone"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            aria-invalid={!!errors.phone}
            className={`${inputCls} ${errors.phone ? errBorder : okBorder}`}
            placeholder="9876543210"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
        </div>
      </div>

      <button
        type="submit"
        className={`mt-5 w-full px-4 py-2.5 font-semibold text-white transition hover:bg-brass/90 sm:w-auto ${
          glass ? 'rounded-full bg-brass' : 'rounded-lg bg-brass'
        }`}
      >
        Get my free quotes →
      </button>
      <p className={`mt-2 text-xs ${glass ? 'text-white/50' : 'text-ash/50'}`}>
        No spam. We share your details only with installers you’re matched to.
      </p>
    </form>
  )
}
