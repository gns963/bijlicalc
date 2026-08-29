import type { ReactNode } from 'react'

/**
 * Per-DISCOM page content. The page template (DiscomCalculatorPage) is shared;
 * everything that makes a page genuinely state-specific — intro, explainer,
 * FAQs, worked-example inputs — lives here, authored per DISCOM. This is
 * deliberately NOT a find-replace of the state name.
 */
export interface DiscomPageConfig {
  slug: string
  discomCode: string
  h1: string
  breadcrumbLabel: string
  metaTitle: string
  metaDescription: string
  /** Units for the worked example (in the DISCOM's own billing period). */
  exampleUnits: number
  /** Whether the worked example should apply the first subsidy scheme. */
  exampleEligible: boolean
  intro: ReactNode
  explainer: { title: string; body: ReactNode }[]
  faqs: { q: string; a: string }[]
}

export const CALCULATOR_PAGES: DiscomPageConfig[] = [
  // -------------------------------------------------------------- TNEB
  {
    slug: 'tneb-bill-calculator',
    discomCode: 'TNEB',
    h1: 'TNEB Bill Calculator (TANGEDCO, Tamil Nadu)',
    breadcrumbLabel: 'TNEB Bill Calculator',
    metaTitle:
      'TNEB Bill Calculator 2026 — TANGEDCO Electricity Bill (Tamil Nadu)',
    metaDescription:
      'Calculate your TNEB (TANGEDCO) electricity bill for Tamil Nadu. Bi-monthly telescopic slabs, 100 free units subsidy, fuel cost adjustment and fixed charges — with a monthly-equivalent figure.',
    exampleUnits: 250,
    exampleEligible: true,
    intro: (
      <>
        Estimate your TANGEDCO electricity bill for Tamil Nadu. TNEB bills
        domestic consumers <strong>bi-monthly</strong> (once every two months)
        using telescopic slabs, with the first 100 units free for eligible
        consumers. Enter your units below for an itemised estimate plus a
        monthly-equivalent figure.
      </>
    ),
    explainer: [
      {
        title: 'Bi-monthly cycle',
        body: (
          <>
            TANGEDCO reads domestic meters once every two months, so a TNEB bill
            covers roughly 60 days. All slab limits and the free-unit allowance
            apply to that two-month total — the single biggest source of
            confusion when comparing to a monthly bill.
          </>
        ),
      },
      {
        title: 'Free-unit subsidy',
        body: (
          <>
            Eligible domestic consumers receive the first 100 units of each cycle
            free, deducted at the lowest slab rate (₹2.25/unit).
          </>
        ),
      },
      {
        title: 'Fuel cost adjustment (FCA)',
        body: (
          <>
            A ₹0.35/unit surcharge reflects TANGEDCO&apos;s power-purchase costs,
            added on top of the slab energy charge along with a phase-based fixed
            charge.
          </>
        ),
      },
    ],
    faqs: [
      {
        q: 'Is the TNEB bill calculated monthly or bi-monthly?',
        a: 'TANGEDCO bills domestic consumers once every two months. Enter the units for the ~60-day cycle; the calculator also shows a monthly-equivalent (total ÷ 2).',
      },
      {
        q: 'How are the 100 free units applied?',
        a: 'Eligible domestic consumers get the first 100 units of the bi-monthly cycle free, valued at the ₹2.25 lowest-slab rate.',
      },
      {
        q: 'What is the fuel cost adjustment on my TNEB bill?',
        a: 'FCA is a per-unit surcharge reflecting TANGEDCO’s power-purchase costs, currently ₹0.35/unit.',
      },
      {
        q: 'Does this calculator give an exact bill?',
        a: 'It is a close estimate based on the published LT-IA domestic tariff. Your actual bill can vary with rounding, meter rent and FCA revisions.',
      },
    ],
  },

  // -------------------------------------------------------------- MSEDCL
  {
    slug: 'msedcl-bill-calculator',
    discomCode: 'MSEDCL',
    h1: 'MSEDCL Bill Calculator (Mahavitaran, Maharashtra)',
    breadcrumbLabel: 'MSEDCL Bill Calculator',
    metaTitle:
      'MSEDCL Bill Calculator 2026 — Mahavitaran Electricity Bill (Maharashtra)',
    metaDescription:
      'Estimate your MSEDCL (Mahavitaran) electricity bill for Maharashtra. Monthly telescopic slabs, 16% electricity duty and fixed charge — with clear caveats on wheeling charge and FAC.',
    exampleUnits: 200,
    exampleEligible: false,
    intro: (
      <>
        Estimate your MSEDCL (Mahavitaran) electricity bill for Maharashtra.
        Unlike Tamil Nadu, MSEDCL bills domestic consumers{' '}
        <strong>every month</strong>, and Maharashtra layers one of India&apos;s
        highest <strong>electricity duties (16%)</strong> on top of the energy,
        wheeling and fixed charges.
      </>
    ),
    explainer: [
      {
        title: 'Monthly billing, four telescopic slabs',
        body: (
          <>
            MSEDCL reads meters monthly. Consumption is split across four bands —
            ₹3.25 for the first 100 units, then ₹6.14, ₹8.45 and ₹9.56 — with
            each band charged at its own rate.
          </>
        ),
      },
      {
        title: '16% electricity duty — a Maharashtra quirk',
        body: (
          <>
            Maharashtra charges a 16% electricity duty on the sum of energy,
            wheeling and fixed charges — far higher than the 0–5% most states
            levy on domestic supply. It is often the second-largest line on a
            Mahavitaran bill after energy charges.
          </>
        ),
      },
      {
        title: 'What this estimate leaves out',
        body: (
          <>
            MSEDCL bills also carry a separate per-unit <strong>wheeling
            charge</strong> and a monthly <strong>Fuel Adjustment Charge
            (FAC)</strong> that this calculator does not yet model, so the real
            bill runs a little higher than the estimate shown here.
          </>
        ),
      },
    ],
    faqs: [
      {
        q: 'Does MSEDCL bill monthly or bi-monthly?',
        a: 'MSEDCL (Mahavitaran) bills domestic consumers every month, unlike Tamil Nadu’s TNEB which bills every two months.',
      },
      {
        q: 'Why is electricity duty so high in Maharashtra?',
        a: 'The Maharashtra government levies a 16% electricity duty on domestic supply — applied on energy, wheeling and fixed charges combined — which is among the highest in India.',
      },
      {
        q: 'Does this include the wheeling charge and FAC?',
        a: 'Not yet. The per-unit wheeling charge and the monthly Fuel Adjustment Charge are not modelled, so your actual Mahavitaran bill will be somewhat higher than this estimate.',
      },
      {
        q: 'Is there a free-units subsidy like Tamil Nadu?',
        a: 'No standing free-units scheme applies to general MSEDCL domestic consumers. A separate relief of up to 10% for households under 100 units/month is being phased in from FY 2026.',
      },
    ],
  },

  // -------------------------------------------------------------- UPPCL
  {
    slug: 'uppcl-bill-calculator',
    discomCode: 'UPPCL',
    h1: 'UPPCL Bill Calculator (Uttar Pradesh)',
    breadcrumbLabel: 'UPPCL Bill Calculator',
    metaTitle:
      'UPPCL Bill Calculator 2026 — UP Bijli Bill (Urban Domestic LMV-1)',
    metaDescription:
      'Estimate your UPPCL electricity bill for urban Uttar Pradesh. Monthly LMV-1 slabs, ₹110/kW fixed charge, meter rent and 5% duty. Works for PuVVNL, MVVNL, PVVNL, DVVNL and KESCO.',
    exampleUnits: 250,
    exampleEligible: false,
    intro: (
      <>
        Estimate your UPPCL electricity bill for urban Uttar Pradesh. UP&apos;s
        five distribution companies —{' '}
        <strong>PuVVNL, MVVNL, PVVNL, DVVNL and KESCO</strong> — all follow the
        same UPERC LMV-1 schedule, billed <strong>monthly</strong>, with a fixed
        charge tied to your sanctioned load.
      </>
    ),
    explainer: [
      {
        title: 'One state, five DISCOMs, one tariff',
        body: (
          <>
            Uttar Pradesh distributes power through five companies, but they
            share a single UPERC rate schedule, so these urban LMV-1 rates apply
            statewide. Rural domestic tariffs differ and are not covered here.
          </>
        ),
      },
      {
        title: 'Fixed charge is per kilowatt of load',
        body: (
          <>
            Unlike Tamil Nadu&apos;s flat phase-based charge, UPPCL levies its
            fixed charge at <strong>₹110 per kW of sanctioned load</strong> per
            month — so a 3 kW connection pays ₹330 fixed before a single unit is
            billed. A ₹20 meter rent and a ₹0.15/unit regulatory true-up also
            apply.
          </>
        ),
      },
      {
        title: 'Telescopic energy slabs',
        body: (
          <>
            Energy is charged telescopically: ₹5.50 for the first 150 units, then
            ₹6.00, ₹6.50 and ₹7.00, plus 5% electricity duty on the energy
            charge.
          </>
        ),
      },
    ],
    faqs: [
      {
        q: 'Do PuVVNL, PVVNL, MVVNL, DVVNL and KESCO have different rates?',
        a: 'No. All five UP DISCOMs follow the same UPERC-approved LMV-1 schedule, so the urban domestic rates are identical statewide.',
      },
      {
        q: 'How is the UPPCL fixed charge calculated?',
        a: 'It is ₹110 per kW of sanctioned load per month in urban areas. Enter your sanctioned load in the calculator to include it.',
      },
      {
        q: 'Does this cover rural connections?',
        a: 'No. These are urban LMV-1 domestic rates. Rural/BPL schedules differ and are not modelled here yet.',
      },
      {
        q: 'What extra charges appear on a UP bill?',
        a: 'Besides energy and the per-kW fixed charge, expect a ₹20 meter rent, a ₹0.15/unit regulatory true-up and 5% electricity duty.',
      },
    ],
  },

  // -------------------------------------------------------------- BESCOM
  {
    slug: 'bescom-bill-calculator',
    discomCode: 'BESCOM',
    h1: 'BESCOM Bill Calculator (Karnataka)',
    breadcrumbLabel: 'BESCOM Bill Calculator',
    metaTitle:
      'BESCOM Bill Calculator 2026 — Karnataka Electricity Bill & Gruha Jyothi',
    metaDescription:
      'Estimate your BESCOM electricity bill for Karnataka. Monthly LT-2a slabs, ₹110/kW fixed charge, ₹0.36/unit surcharge, and the Gruha Jyothi up-to-200-free scheme explained.',
    exampleUnits: 250,
    exampleEligible: false,
    intro: (
      <>
        Estimate your BESCOM electricity bill for Karnataka. BESCOM bills{' '}
        <strong>monthly</strong>, and most domestic consumers fall under the{' '}
        <strong>Gruha Jyothi</strong> scheme, which can make up to 200 units free
        — but only within each household&apos;s own baseline average.
      </>
    ),
    explainer: [
      {
        title: 'Gruha Jyothi — free, but conditional',
        body: (
          <>
            Gruha Jyothi gives eligible households up to 200 free units a month,
            capped at their previous year&apos;s average consumption plus a
            buffer. Crucially, if you exceed the threshold in a month, you pay the{' '}
            <strong>entire</strong> bill for that month — not just the excess.
            This calculator models the simple &quot;first 200 units free&quot;
            case; your actual Gruha Jyothi benefit depends on your sanctioned
            baseline.
          </>
        ),
      },
      {
        title: 'Monthly LT-2a slabs plus a KERC surcharge',
        body: (
          <>
            Urban domestic (LT-2a) energy is charged at ₹5.90 for the first 100
            units, ₹7.25 for 101–200, and ₹8.60 above 200. Since April 2025 a
            ₹0.36/unit KERC surcharge applies on top, along with a ₹110/kW fixed
            charge.
          </>
        ),
      },
    ],
    faqs: [
      {
        q: 'How does Gruha Jyothi decide if my power is free?',
        a: 'Your free allowance is your previous year’s average monthly consumption plus a 10% buffer, capped at 200 units. If you stay within it, those units are free; if you exceed it in a month, the full bill for that month is payable.',
      },
      {
        q: 'I used 250 units — is any of it free under Gruha Jyothi?',
        a: 'If 250 units is above your sanctioned baseline, you typically lose the benefit for that month and pay the full telescopic bill. The calculator’s subsidy toggle shows the simplified first-200-free case for comparison.',
      },
      {
        q: 'What is the ₹0.36 surcharge on Karnataka bills?',
        a: 'It is an additional per-unit surcharge KERC introduced from April 2025, applied to all consumer categories on top of the base slab rates.',
      },
      {
        q: 'Does BESCOM bill monthly?',
        a: 'Yes, BESCOM issues domestic bills every month, and the Gruha Jyothi eligibility is assessed on each month’s consumption.',
      },
    ],
  },

  // -------------------------------------------------------------- KSEB
  {
    slug: 'kseb-bill-calculator',
    discomCode: 'KSEB',
    h1: 'KSEB Bill Calculator (Kerala)',
    breadcrumbLabel: 'KSEB Bill Calculator',
    metaTitle:
      'KSEB Bill Calculator 2026 — Kerala Electricity Bill (Telescopic Slabs)',
    metaDescription:
      'Estimate your KSEB electricity bill for Kerala. Bi-monthly billing, telescopic slabs up to 250 units/month, and a clear explanation of the non-telescopic cliff above 250 units.',
    exampleUnits: 300,
    exampleEligible: false,
    intro: (
      <>
        Estimate your KSEB electricity bill for Kerala. KSEB bills domestic
        consumers <strong>bi-monthly</strong> but assesses slabs on the{' '}
        <strong>monthly average</strong> (units ÷ 2). Below 250 units/month the
        tariff is telescopic; cross 250 and Kerala&apos;s well-known{' '}
        <strong>non-telescopic cliff</strong> kicks in.
      </>
    ),
    explainer: [
      {
        title: 'The 250-unit non-telescopic cliff',
        body: (
          <>
            Up to 250 units a month, each slab is charged at its own rate
            (telescopic). The moment your monthly average crosses 250 units, KSEB
            re-bills your <strong>entire</strong> consumption at a single higher
            non-telescopic rate — so 251 units can cost noticeably more than 250.
            This calculator models the telescopic range only and is{' '}
            <strong>not accurate above 250 units/month</strong>.
          </>
        ),
      },
      {
        title: 'Bi-monthly billing, monthly assessment',
        body: (
          <>
            Bills arrive every two months, but the slab thresholds are applied to
            the monthly average. Enter your two-month units here; the calculator
            uses bi-monthly slab widths (twice the monthly figures) and shows a
            monthly-equivalent total.
          </>
        ),
      },
      {
        title: 'Telescopic slabs and fixed charge',
        body: (
          <>
            Monthly telescopic rates run ₹3.35 (0–50), ₹4.25 (51–100), ₹5.35
            (101–150), ₹7.20 (151–200) and ₹8.50 (201–250), plus a fixed charge
            of ₹40/month single-phase and 5% electricity duty.
          </>
        ),
      },
    ],
    faqs: [
      {
        q: 'What is the 250-unit rule in Kerala?',
        a: 'Below 250 units/month KSEB charges telescopically (each slab at its own rate). Above 250 units/month it switches to non-telescopic — your whole consumption is billed at one higher rate, which this calculator does not model.',
      },
      {
        q: 'KSEB bills me every two months — how do slabs work?',
        a: 'Slabs are assessed on the monthly average, i.e. your two-month units ÷ 2. The calculator uses bi-monthly slab widths and shows a monthly-equivalent figure.',
      },
      {
        q: 'Why might my real KSEB bill differ above 250 units?',
        a: 'Because the non-telescopic regime above 250 units/month re-prices your entire usage at a single higher rate. Treat estimates above 500 bi-monthly units as indicative only.',
      },
      {
        q: 'Is there an electricity duty in Kerala?',
        a: 'Yes, a 5% electricity duty applies on the energy charge, along with a per-month fixed charge billed bi-monthly.',
      },
    ],
  },

  // -------------------------------------------------------------- WBSEDCL
  {
    slug: 'wbsedcl-bill-calculator',
    discomCode: 'WBSEDCL',
    h1: 'WBSEDCL Bill Calculator (West Bengal)',
    breadcrumbLabel: 'WBSEDCL Bill Calculator',
    metaTitle:
      'WBSEDCL Bill Calculator 2026 — West Bengal Electricity Bill (Quarterly)',
    metaDescription:
      'Estimate your WBSEDCL electricity bill for West Bengal. Quarterly billing, telescopic slabs, ₹30/kVA fixed charge and the MVCA surcharge explained.',
    exampleUnits: 300,
    exampleEligible: false,
    intro: (
      <>
        Estimate your WBSEDCL electricity bill for West Bengal. WBSEDCL is
        unusual in billing many domestic consumers{' '}
        <strong>quarterly</strong> (every three months) rather than monthly, with
        a monthly variable surcharge (MVCA) layered on top.
      </>
    ),
    explainer: [
      {
        title: 'Quarterly billing — a Bengal quirk',
        body: (
          <>
            Most Indian DISCOMs bill monthly or bi-monthly; WBSEDCL&apos;s
            domestic schedule is written for a <strong>quarterly</strong> (~90
            day) cycle, so the slab thresholds are large. Enter your three-month
            units here; the calculator shows a monthly-equivalent (total ÷ 3).
            Smart prepaid meters use monthly slabs equal to one-third of these.
          </>
        ),
      },
      {
        title: 'MVCA — the moving surcharge',
        body: (
          <>
            West Bengal adds a <strong>Monthly Variable Cost Adjustment
            (MVCA)</strong> that changes every billing month to track fuel costs.
            Because it moves, this calculator does not include it, so your actual
            bill will differ by the prevailing MVCA.
          </>
        ),
      },
      {
        title: 'Telescopic slabs and fixed charge',
        body: (
          <>
            Quarterly energy rates run ₹4.10 (0–102), ₹5.34 (103–180), ₹6.15
            (181–300), ₹6.65 (301–600) and ₹6.81 above 600 units, with a fixed
            charge of ₹30 per kVA per month (₹90 per kW per quarter here).
          </>
        ),
      },
    ],
    faqs: [
      {
        q: 'Does WBSEDCL really bill every three months?',
        a: 'Yes. WBSEDCL’s domestic tariff schedule is written for a quarterly cycle, which is why the slab limits are large. The calculator converts your quarterly total to a monthly-equivalent.',
      },
      {
        q: 'What is MVCA on my West Bengal bill?',
        a: 'MVCA is a Monthly Variable Cost Adjustment surcharge that changes each month to reflect fuel costs. It is not included in this estimate because it varies.',
      },
      {
        q: 'How is the WBSEDCL fixed charge calculated?',
        a: 'It is ₹30 per kVA per month based on your connected load, modelled here as ₹90 per kW per quarter.',
      },
      {
        q: 'What about prepaid smart meters?',
        a: 'For monthly-billed prepaid meters, the slab limits are one-third of the quarterly figures shown here, but the per-unit rates are the same.',
      },
    ],
  },
]

export function getCalculatorPage(slug: string): DiscomPageConfig | undefined {
  return CALCULATOR_PAGES.find((p) => p.slug === slug)
}

export const allCalculatorSlugs = CALCULATOR_PAGES.map((p) => p.slug)
