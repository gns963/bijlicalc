'use client'

import { useState } from 'react'

export interface LeadGenFormProps {
  /** Tags the submission so we know which page it came from. */
  source?: string
  heading?: string
  subheading?: string
}

type RoofType = 'concrete' | 'tin' | 'other' | ''

const PINCODE_RE = /^[1-9][0-9]{5}$/ // Indian PIN: 6 digits, not starting with 0
const PHONE_RE = /^[6-9][0-9]{9}$/ // Indian mobile: 10 digits, starts 6–9

export default function LeadGenForm({
  source = 'unknown',
  heading = 'Get 3 free installer quotes',
  subheading = 'Tell us a bit about your home and we’ll connect you with verified rooftop solar installers in your area.',
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

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-spark-teal/20 bg-spark-teal/5 p-6 text-center dark:border-spark-teal/20 dark:bg-spark-teal/15/40"
        role="status"
      >
        <p className="text-3xl">✅</p>
        <p className="mt-2 text-lg font-semibold text-spark-teal dark:text-spark-teal/20">
          Thanks — we’ll connect you with 3 verified installers.
        </p>
        <p className="mt-1 text-sm text-spark-teal dark:text-spark-teal">
          Keep an eye on your phone; quotes typically arrive within 2 working
          days.
        </p>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brass/20 dark:bg-slate-800 dark:text-slate-100'
  const okBorder = 'border-slate-300 focus:border-brass dark:border-slate-600'
  const errBorder = 'border-red-400 focus:border-red-500'

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-brass/20 bg-brass/5 p-6 dark:border-brass/20 dark:bg-brass/15/30"
    >
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        {heading}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {subheading}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lg-pincode" className="mb-1 block text-sm font-medium">
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
            <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>
          )}
        </div>

        <div>
          <label htmlFor="lg-bill" className="mb-1 block text-sm font-medium">
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
          {errors.bill && (
            <p className="mt-1 text-xs text-red-600">{errors.bill}</p>
          )}
        </div>

        <div>
          <label htmlFor="lg-roof" className="mb-1 block text-sm font-medium">
            Roof type
          </label>
          <select
            id="lg-roof"
            value={roofType}
            onChange={(e) => setRoofType(e.target.value as RoofType)}
            aria-invalid={!!errors.roofType}
            className={`${inputCls} ${errors.roofType ? errBorder : okBorder}`}
          >
            <option value="">Select…</option>
            <option value="concrete">Concrete (RCC)</option>
            <option value="tin">Tin / metal sheet</option>
            <option value="other">Other</option>
          </select>
          {errors.roofType && (
            <p className="mt-1 text-xs text-red-600">{errors.roofType}</p>
          )}
        </div>

        <div>
          <label htmlFor="lg-phone" className="mb-1 block text-sm font-medium">
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
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-lg bg-brass px-4 py-2.5 font-semibold text-white hover:bg-brass sm:w-auto"
      >
        Get my free quotes →
      </button>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        No spam. We share your details only with installers you’re matched to.
      </p>
    </form>
  )
}
