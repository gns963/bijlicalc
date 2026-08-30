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

  // --- Optional, richer sections. Only authored for states where we have
  // genuine, sourced, DISCOM-specific content — never generic filler, so
  // most of the 36 pages simply won't render these sections yet. ---

  /** DISCOM codes for the live comparison table (e.g. neighbouring states). */
  neighboringDiscoms?: string[]
  /** Specific, real mechanical facts about this tariff people commonly misread. */
  billTraps?: { title: string; body: ReactNode }[]
  /** Short, dated, fact-checked history/structure paragraphs. */
  aboutDiscom?: ReactNode[]
  /** A single direct-answer coverage question, e.g. "Does X supply city Y?" */
  coverageQA?: { q: string; a: ReactNode }
  howToPay?: {
    portalUrl: string
    portalLabel: string
    helpline: string
    steps: string[]
  }
  /** A 2-column "cliff" rule callout (subsidy boundary, duty threshold, etc). */
  thresholdCallout?: {
    title: string
    leftLabel: string
    leftValue: string
    rightLabel: string
    rightValue: string
    note: string
  }
}

export const CALCULATOR_PAGES: DiscomPageConfig[] = [
  // -------------------------------------------------------------- TNEB
  {
    slug: 'tneb-bill-calculator',
    discomCode: 'TNEB',
    h1: 'TNEB Electricity Bill Calculator 2026 — Estimate Your Tamil Nadu (TANGEDCO) Bill',
    breadcrumbLabel: 'TNEB Bill Calculator',
    metaTitle:
      'TNEB Bill Calculator 2026 — TANGEDCO Electricity Bill (Tamil Nadu)',
    metaDescription:
      'Calculate your TNEB (TANGEDCO) electricity bill for Tamil Nadu. Bi-monthly telescopic slabs, 100 free units subsidy, fuel cost adjustment and fixed charges — with a monthly-equivalent figure.',
    exampleUnits: 250,
    exampleEligible: true,
    neighboringDiscoms: ['KSEB', 'BESCOM', 'APSPDCL'],
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
        q: 'How is my TNEB electricity bill calculated?',
        a: 'TANGEDCO bills residential (LT-IA) consumers bi-monthly. Your bill is the sum of telescopic slab-wise energy charges, plus a ₹0.35/unit fuel cost adjustment (FCA) and a phase-based fixed charge, minus the 100-unit free subsidy if you qualify.',
      },
      {
        q: "What is TNEB's current tariff for domestic (LT-IA) connections?",
        a: 'Telescopic slabs of ₹2.25/unit (0–100), ₹3.50/unit (101–200), ₹4.80/unit (201–500) and ₹6.40/unit (501+), plus a fixed charge of ₹100 single-phase or ₹200 three-phase per bi-monthly cycle.',
      },
      {
        q: 'Why is my TNEB bill bi-monthly instead of monthly?',
        a: 'TANGEDCO reads domestic meters once every two months, so a bill covers roughly 60 days rather than 30. To compare against a "monthly" figure, divide the bi-monthly total by two — this calculator does that automatically as the monthly-equivalent.',
      },
      {
        q: 'Do I get free electricity units from TNEB?',
        a: 'Eligible domestic consumers get the first 100 units of each bi-monthly cycle free, valued at the ₹2.25 lowest-slab rate — a flat ₹225 reduction, not a percentage discount. It applies regardless of how many total units you use in the cycle.',
      },
      {
        q: 'What is Fuel Cost Adjustment (FCA) and why is it on my bill?',
        a: 'FCA is a per-unit surcharge, currently ₹0.35/unit, that reflects TANGEDCO’s changing power-purchase cost. It is separate from and added on top of the slab energy charge.',
      },
      {
        q: 'How can I reduce my TNEB electricity bill?',
        a: 'Confirm your 100-unit subsidy eligibility is correctly marked on your account, and keep usage below your next slab threshold where practical — the jump from ₹3.50 to ₹4.80/unit at 200 units is the most common one people cross unintentionally in summer.',
      },
      {
        q: 'Is solar worth it for a typical TNEB household?',
        a: 'Often yes — TNEB’s top domestic slab (₹6.40/unit) is high enough that a rooftop system can offset your most expensive units first. Use our solar ROI calculator, pre-filled for Tamil Nadu tariffs, to see your payback period.',
      },
      {
        q: "What's the difference between TNEB, TANGEDCO and TNPDCL?",
        a: 'TNEB (Tamil Nadu Electricity Board) was the original integrated utility until it was restructured on 1 November 2010 into TNEB Ltd (holding company), TANGEDCO (generation and distribution) and TANTRANSCO (transmission). On 27 June 2024, TANGEDCO’s distribution business was renamed Tamil Nadu Power Distribution Corporation Ltd (TNPDCL) — though “TNEB” and “TANGEDCO” both remain in everyday use for bills.',
      },
      {
        q: 'How do I check or pay my TNEB bill online?',
        a: 'Pay via the official TANGEDCO/TNEB portal at tnebnet.org, or through the TANGEDCO website’s "Pay Online" → "Quick Pay" option. For outages, billing issues or meter problems, call the 24×7 helpline 1912.',
      },
      {
        q: 'How often are TNEB tariff rates updated, and how do you keep this calculator accurate?',
        a: 'TNERC reviews domestic tariffs periodically, with CPI-linked adjustments typically each July. We record the source order URL and a last-verified date on every tariff file — visible at the bottom of this page — and update the data whenever a new order is issued.',
      },
    ],
    billTraps: [
      {
        title: 'The 100-unit "all or nothing" myth',
        body: (
          <>
            Some people assume that using more than 100 units forfeits the
            free-unit subsidy entirely. It doesn&apos;t — the first 100 units
            are deducted at the ₹2.25 rate regardless of your total
            consumption for the cycle, so a 300-unit bill still gets the same
            ₹225 reduction as a 100-unit bill.
          </>
        ),
      },
      {
        title: 'Phase mismatch on the fixed charge',
        body: (
          <>
            TNEB&apos;s fixed charge depends on your connection phase, not your
            sanctioned load: ₹100 for single-phase, ₹200 for three-phase, per
            bi-monthly cycle. If your household has a three-phase connection
            (common for homes with higher-capacity ACs or motors), your fixed
            charge is double what a single-phase neighbour pays.
          </>
        ),
      },
      {
        title: 'The summer slab jump',
        body: (
          <>
            Running an AC through summer often pushes consumption from the
            ₹3.50/unit band into the ₹4.80/unit band. Only the units above 200
            are charged at the higher rate — it&apos;s not retroactive — but
            the marginal jump surprises people comparing a summer bill to a
            winter one.
          </>
        ),
      },
      {
        title: 'Reading-date drift',
        body: (
          <>
            Because billing is bi-monthly, your meter-read date can drift by a
            few days each cycle. Comparing &ldquo;this January&apos;s
            bill&rdquo; to &ldquo;last January&apos;s bill&rdquo; isn&apos;t
            always a clean 60-day-to-60-day comparison — check the actual
            reading dates on both bills before concluding your usage changed.
          </>
        ),
      },
    ],
    aboutDiscom: [
      <>
        Tamil Nadu Electricity Board (TNEB) was formed on 1 July 1957 as a
        single, vertically integrated utility. On 1 November 2010, under the
        Electricity Act 2003, it was restructured into three entities: TNEB
        Ltd (holding company), Tamil Nadu Generation and Distribution
        Corporation Ltd (TANGEDCO) for generation and distribution, and Tamil
        Nadu Transmission Corporation Ltd (TANTRANSCO) for transmission.
      </>,
      <>
        On 27 June 2024, TANGEDCO&apos;s distribution business was renamed
        Tamil Nadu Power Distribution Corporation Ltd (TNPDCL). Both
        &quot;TANGEDCO&quot; and the older &quot;TNEB&quot; name remain in
        everyday use — on bills, signage and customer service — alongside the
        newer TNPDCL name.
      </>,
    ],
    coverageQA: {
      q: 'Does TNEB (TANGEDCO/TNPDCL) supply electricity to Chennai?',
      a: (
        <>
          Yes. Unlike cities such as Mumbai or Delhi, which have multiple
          private distribution licensees, Tamil Nadu has a single distribution
          utility covering the entire state — including Chennai, Coimbatore,
          Madurai, Tiruchirappalli, Tirunelveli, Salem and Vellore. There is no
          separate city-specific electricity board in Tamil Nadu.
        </>
      ),
    },
    howToPay: {
      portalUrl: 'https://www.tnebnet.org/awp/login?locale=en',
      portalLabel: 'tnebnet.org (official TANGEDCO payment portal)',
      helpline: '1912 (24×7) · 044-28521109',
      steps: [
        'Visit the official TANGEDCO/TNEB website and select "Pay Online" under Online Payment Services',
        'Choose "Quick Pay" and enter your Consumer/Service Connection number',
        'Verify the displayed bill amount and pay via UPI, card or net banking',
        'Save the payment receipt/reference number for your records',
      ],
    },
    thresholdCallout: {
      title: 'The 100-unit subsidy line',
      leftLabel: '0–100 units',
      leftValue: 'Free',
      rightLabel: '101+ units',
      rightValue: 'Metered from ₹2.25',
      note: 'Eligible domestic consumers get the first 100 units of every bi-monthly cycle free. Units beyond 100 are billed telescopically starting at the same ₹2.25 rate — crossing 100 units does not cancel the subsidy already applied to the first 100.',
    },
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
    neighboringDiscoms: ['MGVCL', 'BESCOM', 'MPCZ'],
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
      {
        q: 'Why does my MSEDCL bill jump so much between 100 and 101 units?',
        a: 'MSEDCL’s slab rate nearly doubles at that boundary — ₹3.25/unit up to 100 units, then ₹6.14/unit for 101–300. Only the units above 100 are charged at the higher rate (it’s telescopic, not retroactive), but the jump is one of the steepest of any Indian DISCOM.',
      },
      {
        q: 'Does MSEDCL supply electricity to Mumbai?',
        a: 'Mostly no. Most of Mumbai city is served by BEST, Tata Power and Adani Electricity Mumbai, not MSEDCL. MSEDCL does supply some Mumbai suburbs, such as Mulund and Bhandup, and the rest of Maharashtra state.',
      },
      {
        q: 'How do I check or pay my MSEDCL bill online?',
        a: 'Pay via the official MSEDCL Web Self Service portal at wss.mahadiscom.in, or the MahaVitaran app. For queries, call the 24×7 toll-free helpline 1912 or 1800-233-3435.',
      },
      {
        q: 'What is MSEDCL/Mahavitaran, and how is it different from MSEB?',
        a: 'The Maharashtra State Electricity Board (MSEB) was unbundled on 6 June 2005, under the Electricity Act 2003, into four companies: MSEB Holding Co., Mahagenco (generation), Mahatransco (transmission) and Mahavitaran/MSEDCL (distribution) — the entity that bills domestic consumers today.',
      },
    ],
    billTraps: [
      {
        title: 'The 100-unit slab cliff',
        body: (
          <>
            Crossing from 100 to 101 units doesn&apos;t just add one unit&apos;s
            cost — every unit from 101 onward is billed at ₹6.14 instead of
            ₹3.25, nearly double. It&apos;s telescopic (the first 100 units
            stay at ₹3.25 regardless), but the marginal jump is steeper than
            most states&apos;.
          </>
        ),
      },
      {
        title: "16% duty — one of India's highest",
        body: (
          <>
            Maharashtra&apos;s 16% electricity duty applies on top of energy,
            wheeling and fixed charges combined — well above the 0–5% most
            states charge. It&apos;s often the second-largest line on the bill
            after the energy charge itself.
          </>
        ),
      },
      {
        title: 'Monthly, not bi-monthly',
        body: (
          <>
            If you&apos;re used to a bi-monthly cycle (as in Tamil Nadu or
            Kerala), note MSEDCL reads meters and bills every month — the
            units you enter should be one month&apos;s consumption, not two.
          </>
        ),
      },
      {
        title: 'Wheeling charge and FAC push the real bill higher',
        body: (
          <>
            This calculator doesn&apos;t yet model MSEDCL&apos;s separate
            per-unit wheeling charge or its monthly Fuel Adjustment Charge
            (FAC). Your actual Mahavitaran bill will run somewhat higher than
            the estimate shown here.
          </>
        ),
      },
    ],
    aboutDiscom: [
      <>
        The Maharashtra State Electricity Board (MSEB) was unbundled on 6 June
        2005, under the Electricity Act 2003, into four separate companies:
        MSEB Holding Company, Maharashtra State Power Generation Co.
        (Mahagenco), Maharashtra State Electricity Transmission Co.
        (Mahatransco), and Maharashtra State Electricity Distribution Co. Ltd
        (MSEDCL) — commonly called Mahavitaran or Mahadiscom — which handles
        billing and distribution.
      </>,
      <>
        MSEDCL distributes power across almost all of Maharashtra, but not
        most of Mumbai city itself: BEST, Tata Power and Adani Electricity
        Mumbai hold the distribution licences there, while MSEDCL covers some
        Mumbai suburbs (such as Mulund and Bhandup) and the rest of the state.
      </>,
    ],
    coverageQA: {
      q: 'Does MSEDCL supply electricity to Mumbai?',
      a: (
        <>
          Not for most of the city. Mumbai proper is served by three other
          licensees — BEST, Tata Power and Adani Electricity Mumbai — while
          MSEDCL covers the rest of Maharashtra plus a few Mumbai suburbs like
          Mulund and Bhandup. If your bill doesn&apos;t say MSEDCL or
          Mahavitaran, check which of the three Mumbai licensees you&apos;re
          actually on.
        </>
      ),
    },
    howToPay: {
      portalUrl: 'https://wss.mahadiscom.in/wss/wss_view_pay_bill.aspx',
      portalLabel: 'wss.mahadiscom.in (MSEDCL Web Self Service)',
      helpline: '1912 / 1800-233-3435 (24×7)',
      steps: [
        'Visit the MSEDCL Web Self Service portal or open the MahaVitaran app',
        'Enter your Consumer Number to fetch your current bill',
        'Verify the amount and pay via UPI, card or net banking',
        'Download the receipt for your records',
      ],
    },
    thresholdCallout: {
      title: 'The 100-unit rate cliff',
      leftLabel: '0–100 units',
      leftValue: '₹3.25/unit',
      rightLabel: '101+ units',
      rightValue: '₹6.14/unit',
      note: 'Only the units above 100 are billed at the higher rate — the jump is telescopic, not retroactive — but at nearly 2×, it is one of the steepest single-slab jumps of any major Indian DISCOM.',
    },
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
    neighboringDiscoms: ['TNEB', 'KSEB', 'APSPDCL'],
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
      {
        q: 'Does BESCOM cover the whole of Bangalore?',
        a: 'BESCOM covers Bangalore Urban and Bangalore Rural districts plus six neighbouring districts (Chikkaballapura, Kolar, Davanagere, Tumkur, Chitradurga, Ramanagara) — the rest of Karnataka is served by MESCOM, HESCOM, GESCOM and CESC.',
      },
      {
        q: 'How do I check or pay my BESCOM bill online?',
        a: 'Pay via the official BESCOM website (bescom.co.in) or the BESCOM Mithra app. For outages or billing issues, call the 24×7 helpline 1912.',
      },
      {
        q: "What's the difference between BESCOM and KPTCL?",
        a: 'KPTCL (Karnataka Power Transmission Corporation) used to handle both transmission and distribution. On 1 June 2002 its distribution business was split into five regional companies, one of which is BESCOM — covering Bangalore and the surrounding districts.',
      },
      {
        q: 'How often is the BESCOM tariff updated?',
        a: 'KERC reviews rates periodically, with a notable ₹0.36/unit surcharge added from April 2025. We record the source order and a last-verified date on every tariff — visible at the bottom of this page.',
      },
    ],
    billTraps: [
      {
        title: "Gruha Jyothi isn't a flat 200 free units",
        body: (
          <>
            The free allowance is capped at your household&apos;s own average
            consumption from the previous year (plus a buffer), up to a
            maximum of 200 units — not automatically 200 for everyone. Two
            neighbours with different past usage can have different free
            allowances.
          </>
        ),
      },
      {
        title: 'Exceed your baseline, lose the whole month',
        body: (
          <>
            If you use more than your sanctioned Gruha Jyothi baseline in a
            given month, the scheme typically withdraws the subsidy for the
            entire month&apos;s bill — not just the units above the baseline.
            A one-off high-usage month can cost more than expected.
          </>
        ),
      },
      {
        title: 'Fixed charge scales with sanctioned load',
        body: (
          <>
            BESCOM&apos;s ₹110/kW fixed charge is based on your sanctioned
            load, not a flat per-connection fee. A higher sanctioned load
            (useful for running an AC or larger appliances) raises the fixed
            charge regardless of how many units you actually use.
          </>
        ),
      },
      {
        title: 'The ₹0.36 KERC surcharge is separate from the slab rate',
        body: (
          <>
            Added from April 2025, this per-unit surcharge sits on top of the
            published slab rates and applies to every consumer category — it
            won&apos;t appear as a &ldquo;slab&rdquo; on your bill but does add
            to the total.
          </>
        ),
      },
    ],
    aboutDiscom: [
      <>
        BESCOM (Bangalore Electricity Supply Company Ltd) was formed on 1 June
        2002, when the Karnataka Power Transmission Corporation Ltd
        (KPTCL)&apos;s distribution business was split into five regional
        companies — BESCOM, MESCOM, HESCOM, GESCOM and CESC — while KPTCL
        retained transmission.
      </>,
      <>
        BESCOM&apos;s territory covers Bangalore Urban and Bangalore Rural
        districts plus six neighbouring districts (Chikkaballapura, Kolar,
        Davanagere, Tumkur, Chitradurga and Ramanagara) — a wider area than
        Bangalore city alone.
      </>,
    ],
    coverageQA: {
      q: 'Does BESCOM supply all of Bangalore city?',
      a: (
        <>
          Yes for Bangalore itself, but BESCOM&apos;s territory extends well
          beyond the city — it covers eight districts in total. If your
          connection is outside Bangalore Urban/Rural (for example in
          Mangalore, Hubli or Gulbarga), you&apos;re more likely served by
          MESCOM, HESCOM or GESCOM instead.
        </>
      ),
    },
    howToPay: {
      portalUrl: 'https://bescom.co.in',
      portalLabel: 'bescom.co.in (official BESCOM website)',
      helpline: '1912 (24×7)',
      steps: [
        'Visit bescom.co.in or open the BESCOM Mithra app',
        'Enter your Account ID (RR Number) to view your current bill',
        'Verify the amount and pay via UPI, card or net banking',
        'Save the digital receipt for your records',
      ],
    },
    thresholdCallout: {
      title: 'The Gruha Jyothi baseline rule',
      leftLabel: 'Within your baseline',
      leftValue: 'Free (up to 200u)',
      rightLabel: 'Exceed your baseline',
      rightValue: 'Full bill for the month',
      note: 'Your free allowance is capped at your own past average consumption, not a flat 200 units. Cross your sanctioned baseline in any month and the subsidy is typically withdrawn for that entire month, not just the excess units.',
    },
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
    neighboringDiscoms: ['TNEB', 'BESCOM', 'APSPDCL'],
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
      {
        q: 'Does KSEB supply electricity to all of Kerala?',
        a: 'Almost all — KSEB Limited (KSEBL) covers the entire state except the Thrissur Municipal Corporation area, the Munnar (Kannan Devan Hills) area, and a handful of small industrial-park licensees, which have their own separate distribution licensees.',
      },
      {
        q: 'How do I check or pay my KSEB bill online?',
        a: 'Pay via the official KSEB Web Self Service portal at wss.kseb.in, or the KSEB Mobile App. For queries or outages, call the 24×7 helpline 1912 or 0471-2555544.',
      },
      {
        q: "What's the difference between KSEB and KSEB Limited (KSEBL)?",
        a: 'The original Kerala State Electricity Board (KSEB), formed in 1957, was converted into a company — Kerala State Electricity Board Limited (KSEBL) — incorporated in January 2011 and operational from 1 November 2013. "KSEB" is still the everyday name people use.',
      },
    ],
    billTraps: [
      {
        title: 'The 250-unit cliff is the single biggest trap',
        body: (
          <>
            Below a 250 units/month average, KSEB charges telescopically. The
            moment your average crosses 250, your{' '}
            <strong>entire</strong> bi-monthly consumption is re-billed at a
            single higher non-telescopic rate — not just the units above 250.
            This calculator only models the telescopic range and is not
            accurate above it.
          </>
        ),
      },
      {
        title: 'Bi-monthly bill, monthly-average trigger',
        body: (
          <>
            Because the 250-unit threshold is assessed on your monthly
            average (bi-monthly total ÷ 2), a 501-unit bi-monthly bill
            crosses the cliff even though &ldquo;501&rdquo; doesn&apos;t look
            close to &ldquo;250&rdquo; at first glance.
          </>
        ),
      },
      {
        title: 'Fixed charge depends on phase',
        body: (
          <>
            KSEB&apos;s fixed charge is ₹80 for single-phase and ₹220 for
            three-phase connections per bi-monthly cycle — a similar
            structure to Tamil Nadu&apos;s, but at different amounts.
          </>
        ),
      },
    ],
    aboutDiscom: [
      <>
        The Kerala State Electricity Board (KSEB) began functioning on 31
        March 1957. Under the Electricity Act 2003, it was converted into a
        company — Kerala State Electricity Board Limited (KSEBL) —
        incorporated on 14 January 2011 and operating independently from 1
        November 2013. &ldquo;KSEB&rdquo; remains the name most commonly used
        for bills and customer service.
      </>,
      <>
        KSEB distributes power across nearly all of Kerala, with a few
        exceptions: the Thrissur Municipal Corporation area, the Munnar
        (Kannan Devan Hills) area, and several small industrial-park zones
        are served by separate, smaller licensees.
      </>,
    ],
    coverageQA: {
      q: 'Does KSEB supply electricity to Kochi and Thiruvananthapuram?',
      a: (
        <>
          Yes — KSEB covers both Kochi and Thiruvananthapuram (Trivandrum)
          along with the rest of Kerala. The notable exceptions are the
          Thrissur Municipal Corporation area and Munnar (Kannan Devan
          Hills), which have their own separate distribution licensees.
        </>
      ),
    },
    howToPay: {
      portalUrl: 'https://wss.kseb.in/selfservices/quickpay',
      portalLabel: 'wss.kseb.in (KSEB Web Self Service)',
      helpline: '1912 / 0471-2555544 (24×7)',
      steps: [
        'Visit the KSEB Web Self Service portal or open the KSEB Mobile App',
        'Enter your Consumer Number to fetch your current bill',
        'Verify the amount and pay via UPI, card or net banking',
        'Save the payment confirmation for your records',
      ],
    },
    thresholdCallout: {
      title: 'The 250-unit non-telescopic cliff',
      leftLabel: '≤250 units/month avg',
      leftValue: 'Telescopic (slab-wise)',
      rightLabel: '>250 units/month avg',
      rightValue: 'Flat rate on ALL units',
      note: 'Cross a monthly average of 250 units and KSEB switches your entire bi-monthly consumption to a single higher non-telescopic rate — not just the units above 250. This is the single most misunderstood rule on a KSEB bill.',
    },
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
  {
    slug: "gujarat-electricity-bill-calculator",
    discomCode: "MGVCL",
    h1: "Gujarat Electricity Bill Calculator",
    breadcrumbLabel: "Gujarat Bill Calculator",
    metaTitle: "Gujarat Electricity Bill Calculator 2026 — MGVCL",
    metaDescription: "Calculate your Gujarat electricity bill (Madhya Gujarat Vij Company Ltd (MGVCL, GERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Gujarat bills monthly with different urban and rural (RGP-Rural) rates.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Madhya Gujarat Vij Company Ltd (MGVCL, GERC) electricity bill for Gujarat. Gujarat bills monthly with different urban and rural (RGP-Rural) rates. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Urban vs rural rates (RGP vs RGP-Rural)", body: "Gujarat sets different domestic rates for urban (RGP) and rural (RGP-Rural, inside a Gram Panchayat) premises — rural homes pay lower per-unit rates and half the electricity duty. This calculator uses the urban RGP schedule." },
      { title: "How the Gujarat bill is calculated", body: "Gujarat domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹3.05 to ₹5.2/unit, each band charged at its own rate. A fixed charge of a flat ₹90/month applies." },
    ],
    faqs: [
      { q: "Is the Gujarat electricity tariff telescopic?", a: "Yes. Gujarat charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Gujarat domestic connection?", a: "The fixed charge is a flat ₹90/month." },
      { q: "How accurate is this Gujarat bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. FPPCA (monthly fuel surcharge) and electricity duty are not modelled here. Always confirm against your official MGVCL bill." },
    ],
  },
  {
    slug: "rajasthan-electricity-bill-calculator",
    discomCode: "JVVNL",
    h1: "Rajasthan Electricity Bill Calculator",
    breadcrumbLabel: "Rajasthan Bill Calculator",
    metaTitle: "Rajasthan Electricity Bill Calculator 2026 — JVVNL",
    metaDescription: "Calculate your Rajasthan electricity bill (Jaipur Vidyut Vitran Nigam Ltd (JVVNL, RERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Rajasthan bills monthly with a high ₹275/kW fixed charge.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Jaipur Vidyut Vitran Nigam Ltd (JVVNL, RERC) electricity bill for Rajasthan. Rajasthan bills monthly with a high ₹275/kW fixed charge. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A high per-kW fixed charge", body: "Rajasthan levies one of India’s steepest domestic fixed charges at around ₹275 per kW of sanctioned load per month, so a 2 kW connection pays roughly ₹550 in fixed charges before any energy is billed. The same RERC schedule applies to JVVNL, AVVNL and JdVVNL." },
      { title: "How the Rajasthan bill is calculated", body: "Rajasthan domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹4.25 to ₹9.5/unit, each band charged at its own rate. A fixed charge of ₹275 per kW of sanctioned load applies, and a ₹0.22/unit fuel/variable-cost surcharge." },
    ],
    faqs: [
      { q: "Is the Rajasthan electricity tariff telescopic?", a: "Yes. Rajasthan charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Rajasthan domestic connection?", a: "The fixed charge is ₹275 per kW of sanctioned load." },
      { q: "How accurate is this Rajasthan bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Rajasthan’s per-unit electricity duty (~40 paise/unit) and urban cess are not modelled here. Always confirm against your official JVVNL bill." },
    ],
  },
  {
    slug: "punjab-electricity-bill-calculator",
    discomCode: "PSPCL",
    h1: "Punjab Electricity Bill Calculator",
    breadcrumbLabel: "Punjab Bill Calculator",
    metaTitle: "Punjab Electricity Bill Calculator 2026 — PSPCL",
    metaDescription: "Calculate your Punjab electricity bill (Punjab State Power Corporation Ltd (PSPCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Punjab offers up to 300 free units a month to domestic consumers.",
    exampleUnits: 250,
    exampleEligible: false,
    intro: "Estimate your Punjab State Power Corporation Ltd (PSPCL) electricity bill for Punjab. Punjab offers up to 300 free units a month to domestic consumers. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "300 free units a month", body: "Punjab gives eligible domestic households up to 300 units of free electricity every month, which zeroes out the bill for most families. Note the scheme has a threshold — exceeding it in a cycle can make the whole bill payable — and PSPCL’s per-unit rate also varies by sanctioned load band." },
      { title: "How the Punjab bill is calculated", body: "Punjab domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹3.49 to ₹7.3/unit, each band charged at its own rate. A fixed charge of a flat ₹120/month applies." },
    ],
    faqs: [
      { q: "Is the Punjab electricity tariff telescopic?", a: "Yes. Punjab charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Punjab domestic connection?", a: "The fixed charge is a flat ₹120/month." },
      { q: "How accurate is this Punjab bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. PSPCL bills bi-monthly in practice and rates vary by load band; this uses a representative monthly schedule. Always confirm against your official PSPCL bill." },
    ],
  },
  {
    slug: "delhi-electricity-bill-calculator",
    discomCode: "BRPL",
    h1: "Delhi Electricity Bill Calculator",
    breadcrumbLabel: "Delhi Bill Calculator",
    metaTitle: "Delhi Electricity Bill Calculator 2026 — BRPL",
    metaDescription: "Calculate your Delhi electricity bill (BSES Rajdhani Power Ltd (BRPL, DERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Delhi gives up to 200 free units (opt-in) across BRPL, BYPL and TPDDL.",
    exampleUnits: 400,
    exampleEligible: false,
    intro: "Estimate your BSES Rajdhani Power Ltd (BRPL, DERC) electricity bill for Delhi. Delhi gives up to 200 free units (opt-in) across BRPL, BYPL and TPDDL. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Up to 200 free units, then a PPAC surcharge", body: "Delhi gives opted-in domestic consumers up to 200 free units a month and half-price power for 201–400 units. But bills also carry a Power Purchase Adjustment Cost (PPAC) surcharge of roughly 30% on energy charges. All three discoms — BRPL, BYPL and TPDDL — follow the same DERC schedule." },
      { title: "How the Delhi bill is calculated", body: "Delhi domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹3 to ₹8/unit, each band charged at its own rate. A fixed charge of ₹100 per kW of sanctioned load applies." },
    ],
    faqs: [
      { q: "Is the Delhi electricity tariff telescopic?", a: "Yes. Delhi charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Delhi domestic connection?", a: "The fixed charge is ₹100 per kW of sanctioned load." },
      { q: "How accurate is this Delhi bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. The PPAC surcharge (~30% of energy charge) is not modelled, so real Delhi bills above the free tier run higher. Always confirm against your official BRPL bill." },
    ],
  },
  {
    slug: "telangana-electricity-bill-calculator",
    discomCode: "TSSPDCL",
    h1: "Telangana Electricity Bill Calculator",
    breadcrumbLabel: "Telangana Bill Calculator",
    metaTitle: "Telangana Electricity Bill Calculator 2026 — TSSPDCL",
    metaDescription: "Calculate your Telangana electricity bill (Telangana Southern Power Distribution Co. (TGSPDCL/TSSPDCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Telangana gives white-ration-card homes up to 200 free units under Gruha Jyothi.",
    exampleUnits: 250,
    exampleEligible: false,
    intro: "Estimate your Telangana Southern Power Distribution Co. (TGSPDCL/TSSPDCL) electricity bill for Telangana. Telangana gives white-ration-card homes up to 200 free units under Gruha Jyothi. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Gruha Jyothi free 200 units", body: "Domestic consumers with a white ration card get up to 200 units free each month under the Gruha Jyothi scheme. Above that, telescopic slabs apply, plus a 6% electricity duty. TGSPDCL and TGNPDCL share the same TSERC tariff." },
      { title: "How the Telangana bill is calculated", body: "Telangana domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹1.95 to ₹6.5/unit, each band charged at its own rate. A fixed charge of ₹10 per kW of sanctioned load applies, plus a 6% electricity duty." },
    ],
    faqs: [
      { q: "Is the Telangana electricity tariff telescopic?", a: "Yes. Telangana charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Telangana domestic connection?", a: "The fixed charge is ₹10 per kW of sanctioned load." },
      { q: "How accurate is this Telangana bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official TSSPDCL bill." },
    ],
  },
  {
    slug: "andhra-pradesh-electricity-bill-calculator",
    discomCode: "APSPDCL",
    h1: "Andhra Pradesh Electricity Bill Calculator",
    breadcrumbLabel: "Andhra Pradesh Bill Calculator",
    metaTitle: "Andhra Pradesh Electricity Bill Calculator 2026 — APSPDCL",
    metaDescription: "Calculate your Andhra Pradesh electricity bill (Southern Power Distribution Co. of AP (APSPDCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Andhra Pradesh uses a six-slab telescopic domestic tariff.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Southern Power Distribution Co. of AP (APSPDCL) electricity bill for Andhra Pradesh. Andhra Pradesh uses a six-slab telescopic domestic tariff. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A fine-grained six-slab tariff", body: "Andhra Pradesh uses an unusually detailed six-slab telescopic tariff for domestic (LT-1) connections, from ₹1.90/unit for the first 30 units up to ₹9.75 above 400. APEPDCL, APCPDCL and APSPDCL all follow the same unified APERC schedule." },
      { title: "How the Andhra Pradesh bill is calculated", body: "Andhra Pradesh domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹1.9 to ₹9.75/unit, each band charged at its own rate. A fixed charge of ₹10 per kW of sanctioned load applies." },
    ],
    faqs: [
      { q: "Is the Andhra Pradesh electricity tariff telescopic?", a: "Yes. Andhra Pradesh charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Andhra Pradesh domestic connection?", a: "The fixed charge is ₹10 per kW of sanctioned load." },
      { q: "How accurate is this Andhra Pradesh bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. A flat ₹0.06/unit electricity duty is not modelled here. Always confirm against your official APSPDCL bill." },
    ],
  },
  {
    slug: "madhya-pradesh-electricity-bill-calculator",
    discomCode: "MPCZ",
    h1: "Madhya Pradesh Electricity Bill Calculator",
    breadcrumbLabel: "Madhya Pradesh Bill Calculator",
    metaTitle: "Madhya Pradesh Electricity Bill Calculator 2026 — MPCZ",
    metaDescription: "Calculate your Madhya Pradesh electricity bill (MP Madhya Kshetra Vidyut Vitaran Co. (MPCZ)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Madhya Pradesh caps small (≤100 unit) bills at ₹100 under Atal Griha Jyoti.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your MP Madhya Kshetra Vidyut Vitaran Co. (MPCZ) electricity bill for Madhya Pradesh. Madhya Pradesh caps small (≤100 unit) bills at ₹100 under Atal Griha Jyoti. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Atal Griha Jyoti — a ₹100 bill cap", body: "Under the Atal Griha Jyoti Yojana, eligible low-load (≤1 kW) households using 100 units or less a month have their entire bill capped at a flat ₹100. Above that, normal telescopic slabs and a ₹0.30/unit VCA surcharge apply." },
      { title: "How the Madhya Pradesh bill is calculated", body: "Madhya Pradesh domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹4.25 to ₹7.25/unit, each band charged at its own rate. A fixed charge of ₹20 per kW of sanctioned load applies, and a ₹0.3/unit fuel/variable-cost surcharge." },
    ],
    faqs: [
      { q: "Is the Madhya Pradesh electricity tariff telescopic?", a: "Yes. Madhya Pradesh charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Madhya Pradesh domestic connection?", a: "The fixed charge is ₹20 per kW of sanctioned load." },
      { q: "How accurate is this Madhya Pradesh bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. The Atal Griha Jyoti ₹100 cap is not applied automatically here. Always confirm against your official MPCZ bill." },
    ],
  },
  {
    slug: "haryana-electricity-bill-calculator",
    discomCode: "UHBVN",
    h1: "Haryana Electricity Bill Calculator",
    breadcrumbLabel: "Haryana Bill Calculator",
    metaTitle: "Haryana Electricity Bill Calculator 2026 — UHBVN",
    metaDescription: "Calculate your Haryana electricity bill (Uttar Haryana Bijli Vitran Nigam (UHBVN, HERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Haryana keeps low-use slabs cheap, then rises steeply.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Uttar Haryana Bijli Vitran Nigam (UHBVN, HERC) electricity bill for Haryana. Haryana keeps low-use slabs cheap, then rises steeply. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A split low-use vs high-use structure", body: "Haryana keeps the first two slabs very cheap (₹2.20 and ₹2.70) to protect low-use households, then rises sharply for higher consumption. UHBVN and DHBVN follow the same HERC schedule." },
      { title: "How the Haryana bill is calculated", body: "Haryana domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹2.2 to ₹6.45/unit, each band charged at its own rate. A fixed charge of ₹120 per kW of sanctioned load applies." },
    ],
    faqs: [
      { q: "Is the Haryana electricity tariff telescopic?", a: "Yes. Haryana charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Haryana domestic connection?", a: "The fixed charge is ₹120 per kW of sanctioned load." },
      { q: "How accurate is this Haryana bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. FPPCA fuel surcharge and electricity duty are not modelled here. Always confirm against your official UHBVN bill." },
    ],
  },
  {
    slug: "himachal-pradesh-electricity-bill-calculator",
    discomCode: "HPSEBL",
    h1: "Himachal Pradesh Electricity Bill Calculator",
    breadcrumbLabel: "Himachal Pradesh Bill Calculator",
    metaTitle: "Himachal Pradesh Electricity Bill Calculator 2026 — HPSEBL",
    metaDescription: "Calculate your Himachal Pradesh electricity bill (Himachal Pradesh State Electricity Board Ltd (HPSEBL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Himachal Pradesh gives the first 125 units free each month.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Himachal Pradesh State Electricity Board Ltd (HPSEBL) electricity bill for Himachal Pradesh. Himachal Pradesh gives the first 125 units free each month. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "First 125 units free", body: "Himachal continues to give domestic consumers their first 125 units free of cost. From 126 units the slabs are merged into a single subsidised ₹4.17/unit, and above 300 units the full ₹5.90/unit applies with the earlier subsidy withdrawn." },
      { title: "How the Himachal Pradesh bill is calculated", body: "Himachal Pradesh domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹0 to ₹5.9/unit, each band charged at its own rate. A fixed charge of a flat ₹40/month applies." },
    ],
    faqs: [
      { q: "Is the Himachal Pradesh electricity tariff telescopic?", a: "Yes. Himachal Pradesh charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Himachal Pradesh domestic connection?", a: "The fixed charge is a flat ₹40/month." },
      { q: "How accurate is this Himachal Pradesh bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official HPSEBL bill." },
    ],
  },
  {
    slug: "uttarakhand-electricity-bill-calculator",
    discomCode: "UPCL",
    h1: "Uttarakhand Electricity Bill Calculator",
    breadcrumbLabel: "Uttarakhand Bill Calculator",
    metaTitle: "Uttarakhand Electricity Bill Calculator 2026 — UPCL",
    metaDescription: "Calculate your Uttarakhand electricity bill (Uttarakhand Power Corporation Ltd (UPCL, UERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Uttarakhand tiers its fixed charge by load and gives rural/hill rebates.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Uttarakhand Power Corporation Ltd (UPCL, UERC) electricity bill for Uttarakhand. Uttarakhand tiers its fixed charge by load and gives rural/hill rebates. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Load-tiered fixed charge and hill rebates", body: "Uttarakhand’s fixed charge is tiered by sanctioned load (₹75 up to 1 kW, ₹85 up to 4 kW, ₹100 above), and rural areas get a 5% and hill areas a 10% rebate on the bill." },
      { title: "How the Uttarakhand bill is calculated", body: "Uttarakhand domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹3.65 to ₹7.8/unit, each band charged at its own rate. A fixed charge of a flat ₹85/month applies." },
    ],
    faqs: [
      { q: "Is the Uttarakhand electricity tariff telescopic?", a: "Yes. Uttarakhand charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Uttarakhand domestic connection?", a: "The fixed charge is a flat ₹85/month." },
      { q: "How accurate is this Uttarakhand bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. A ₹0.15/unit electricity duty and the rural/hill rebates are not modelled here. Always confirm against your official UPCL bill." },
    ],
  },
  {
    slug: "goa-electricity-bill-calculator",
    discomCode: "GED",
    h1: "Goa Electricity Bill Calculator",
    breadcrumbLabel: "Goa Bill Calculator",
    metaTitle: "Goa Electricity Bill Calculator 2026 — GED",
    metaDescription: "Calculate your Goa electricity bill (Goa Electricity Department (GED, JERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Goa’s first 100 units are cheap (₹2.10) but there is no free slab.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Goa Electricity Department (GED, JERC) electricity bill for Goa. Goa’s first 100 units are cheap (₹2.10) but there is no free slab. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Cheap first slab, but no free units", body: "Goa has one of the cheapest opening slabs in India (₹2.10 for the first 100 units) but, unlike Delhi or Punjab, offers no free-unit slab — you are billed from the very first unit. A five-tier telescopic structure applies." },
      { title: "How the Goa bill is calculated", body: "Goa domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹2.1 to ₹6.6/unit, each band charged at its own rate. A fixed charge of ₹25 per kW of sanctioned load applies." },
    ],
    faqs: [
      { q: "Is the Goa electricity tariff telescopic?", a: "Yes. Goa charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Goa domestic connection?", a: "The fixed charge is ₹25 per kW of sanctioned load." },
      { q: "How accurate is this Goa bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. A ₹0.30/unit combined electricity + public-lighting duty is not modelled here. Always confirm against your official GED bill." },
    ],
  },
  {
    slug: "bihar-electricity-bill-calculator",
    discomCode: "SBPDCL",
    h1: "Bihar Electricity Bill Calculator",
    breadcrumbLabel: "Bihar Bill Calculator",
    metaTitle: "Bihar Electricity Bill Calculator 2026 — SBPDCL",
    metaDescription: "Calculate your Bihar electricity bill (South Bihar Power Distribution Co. Ltd (SBPDCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Bihar charges a near-flat domestic rate (₹7.42–₹7.96/unit).",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your South Bihar Power Distribution Co. Ltd (SBPDCL) electricity bill for Bihar. Bihar charges a near-flat domestic rate (₹7.42–₹7.96/unit). Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A near-flat, non-telescopic rate", body: "Unlike most states, Bihar’s domestic tariff is essentially flat — ₹7.42/unit up to 50 units and ₹7.96/unit beyond, among the higher base rates in the country. NBPDCL and SBPDCL charge the same, and BPL homes fall under the separate Kutir Jyoti category." },
      { title: "How the Bihar bill is calculated", body: "Bihar domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹7.42 to ₹7.96/unit, each band charged at its own rate. A fixed charge of ₹40 per kW of sanctioned load applies." },
    ],
    faqs: [
      { q: "Is the Bihar electricity tariff telescopic?", a: "Yes. Bihar charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Bihar domestic connection?", a: "The fixed charge is ₹40 per kW of sanctioned load." },
      { q: "How accurate is this Bihar bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official SBPDCL bill." },
    ],
  },
  {
    slug: "odisha-electricity-bill-calculator",
    discomCode: "TPCODL",
    h1: "Odisha Electricity Bill Calculator",
    breadcrumbLabel: "Odisha Bill Calculator",
    metaTitle: "Odisha Electricity Bill Calculator 2026 — TPCODL",
    metaDescription: "Calculate your Odisha electricity bill (TP Central Odisha Distribution Ltd (TPCODL, OERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Odisha uses telescopic slabs with a low flat ₹25 fixed charge.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your TP Central Odisha Distribution Ltd (TPCODL, OERC) electricity bill for Odisha. Odisha uses telescopic slabs with a low flat ₹25 fixed charge. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Low, flat fixed charge", body: "Odisha keeps the domestic fixed charge low and flat at about ₹25 a month regardless of load, with telescopic energy slabs. The four Tata Power distribution companies follow the same OERC schedule." },
      { title: "How the Odisha bill is calculated", body: "Odisha domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹3 to ₹6.2/unit, each band charged at its own rate. A fixed charge of a flat ₹25/month applies." },
    ],
    faqs: [
      { q: "Is the Odisha electricity tariff telescopic?", a: "Yes. Odisha charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Odisha domestic connection?", a: "The fixed charge is a flat ₹25/month." },
      { q: "How accurate is this Odisha bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. A ₹0.06/unit electricity duty is not modelled here. Always confirm against your official TPCODL bill." },
    ],
  },
  {
    slug: "assam-electricity-bill-calculator",
    discomCode: "APDCL",
    h1: "Assam Electricity Bill Calculator",
    breadcrumbLabel: "Assam Bill Calculator",
    metaTitle: "Assam Electricity Bill Calculator 2026 — APDCL",
    metaDescription: "Calculate your Assam electricity bill (Assam Power Distribution Company Ltd (APDCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Assam gives a ₹2.00/unit lifeline rate for the first 30 units.",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Assam Power Distribution Company Ltd (APDCL) electricity bill for Assam. Assam gives a ₹2.00/unit lifeline rate for the first 30 units. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A subsidised lifeline first slab", body: "Assam charges just ₹2.00/unit for the first 30 units as a lifeline rate for low-income households, then rises through a telescopic structure to ₹7.60/unit, with a 5% electricity duty on the bill." },
      { title: "How the Assam bill is calculated", body: "Assam domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹2 to ₹7.6/unit, each band charged at its own rate. A fixed charge of a flat ₹70/month applies, plus a 5% electricity duty." },
    ],
    faqs: [
      { q: "Is the Assam electricity tariff telescopic?", a: "Yes. Assam charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Assam domestic connection?", a: "The fixed charge is a flat ₹70/month." },
      { q: "How accurate is this Assam bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official APDCL bill." },
    ],
  },
  {
    slug: "jharkhand-electricity-bill-calculator",
    discomCode: "JBVNL",
    h1: "Jharkhand Electricity Bill Calculator",
    breadcrumbLabel: "Jharkhand Bill Calculator",
    metaTitle: "Jharkhand Electricity Bill Calculator 2026 — JBVNL",
    metaDescription: "Calculate your Jharkhand electricity bill (Jharkhand Bijli Vitran Nigam Ltd (JBVNL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Jharkhand charges a flat urban rate but gives up to 200 free units a month.",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Jharkhand Bijli Vitran Nigam Ltd (JBVNL) electricity bill for Jharkhand. Jharkhand charges a flat urban rate but gives up to 200 free units a month. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Flat rate, but 200 units free", body: "Jharkhand charges a flat ₹6.85/unit for urban domestic supply (₹6.70 rural), but around 40 lakh of its ~46 lakh domestic consumers pay nothing because the state provides up to 200 free units per household each month." },
      { title: "How the Jharkhand bill is calculated", body: "Jharkhand domestic supply is billed monthly. Every unit is charged at a flat ₹6.85/unit. A fixed charge of ₹100 per kW of sanctioned load applies." },
    ],
    faqs: [
      { q: "Is the Jharkhand electricity tariff telescopic?", a: "Jharkhand uses a flat domestic rate rather than telescopic slabs — every unit is billed at the same rate." },
      { q: "What is the fixed charge for a Jharkhand domestic connection?", a: "The fixed charge is ₹100 per kW of sanctioned load." },
      { q: "How accurate is this Jharkhand bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official JBVNL bill." },
    ],
  },
  {
    slug: "chhattisgarh-electricity-bill-calculator",
    discomCode: "CSPDCL",
    h1: "Chhattisgarh Electricity Bill Calculator",
    breadcrumbLabel: "Chhattisgarh Bill Calculator",
    metaTitle: "Chhattisgarh Electricity Bill Calculator 2026 — CSPDCL",
    metaDescription: "Calculate your Chhattisgarh electricity bill (Chhattisgarh State Power Distribution Co. (CSPDCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Chhattisgarh halves the energy charge for homes using ≤400 units (Bijli Bill Half).",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Chhattisgarh State Power Distribution Co. (CSPDCL) electricity bill for Chhattisgarh. Chhattisgarh halves the energy charge for homes using ≤400 units (Bijli Bill Half). Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Bijli Bill Half Yojana", body: "Chhattisgarh’s Bijli Bill Half scheme cuts the energy charge in half for domestic consumers using 400 units or less a month — a major saving. Bills also carry a ₹0.30/unit VCA surcharge and roughly 8% electricity duty." },
      { title: "How the Chhattisgarh bill is calculated", body: "Chhattisgarh domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹4.1 to ₹8.3/unit, each band charged at its own rate. A fixed charge of ₹20 per kW of sanctioned load applies, plus a 8% electricity duty, and a ₹0.3/unit fuel/variable-cost surcharge." },
    ],
    faqs: [
      { q: "Is the Chhattisgarh electricity tariff telescopic?", a: "Yes. Chhattisgarh charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Chhattisgarh domestic connection?", a: "The fixed charge is ₹20 per kW of sanctioned load." },
      { q: "How accurate is this Chhattisgarh bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. The Bijli Bill Half 50% concession is not applied automatically here. Always confirm against your official CSPDCL bill." },
    ],
  },
  {
    slug: "chandigarh-electricity-bill-calculator",
    discomCode: "CED",
    h1: "Chandigarh Electricity Bill Calculator",
    breadcrumbLabel: "Chandigarh Bill Calculator",
    metaTitle: "Chandigarh Electricity Bill Calculator 2026 — CED",
    metaDescription: "Calculate your Chandigarh electricity bill (UT Chandigarh Electricity Department (CED, JERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Chandigarh charges ₹2.75/unit for the first 150 units.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your UT Chandigarh Electricity Department (CED, JERC) electricity bill for Chandigarh. Chandigarh charges ₹2.75/unit for the first 150 units. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A cheap 150-unit first slab", body: "Chandigarh keeps the first 150 units at just ₹2.75/unit, one of the better deals for small urban households, with a 5% electricity duty charged on energy plus fixed charges and a ₹0.15/unit fuel adjustment." },
      { title: "How the Chandigarh bill is calculated", body: "Chandigarh domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹2.75 to ₹5.4/unit, each band charged at its own rate. A fixed charge of a flat ₹30/month applies, plus a 5% electricity duty, and a ₹0.15/unit fuel/variable-cost surcharge." },
    ],
    faqs: [
      { q: "Is the Chandigarh electricity tariff telescopic?", a: "Yes. Chandigarh charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Chandigarh domestic connection?", a: "The fixed charge is a flat ₹30/month." },
      { q: "How accurate is this Chandigarh bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official CED bill." },
    ],
  },
  {
    slug: "puducherry-electricity-bill-calculator",
    discomCode: "PED-PY",
    h1: "Puducherry Electricity Bill Calculator",
    breadcrumbLabel: "Puducherry Bill Calculator",
    metaTitle: "Puducherry Electricity Bill Calculator 2026 — PED-PY",
    metaDescription: "Calculate your Puducherry electricity bill (Puducherry Electricity Department (PED)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Puducherry shields the first slab from hikes and gives BPL homes 50 free units.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Puducherry Electricity Department (PED) electricity bill for Puducherry. Puducherry shields the first slab from hikes and gives BPL homes 50 free units. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Government-absorbed slab-1 hike", body: "Puducherry’s government absorbs rate increases on the first 0–100 unit slab, keeping it at ₹2.90/unit, and continues to give BPL families 50 free units a month. A 5% electricity duty applies." },
      { title: "How the Puducherry bill is calculated", body: "Puducherry domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹2.9 to ₹7.5/unit, each band charged at its own rate. A fixed charge of ₹25 single-phase / ₹75 three-phase applies, plus a 5% electricity duty." },
    ],
    faqs: [
      { q: "Is the Puducherry electricity tariff telescopic?", a: "Yes. Puducherry charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Puducherry domestic connection?", a: "The fixed charge is ₹25 single-phase / ₹75 three-phase." },
      { q: "How accurate is this Puducherry bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official PED-PY bill." },
    ],
  },
  {
    slug: "jammu-and-kashmir-electricity-bill-calculator",
    discomCode: "JPDCL",
    h1: "Jammu & Kashmir Electricity Bill Calculator",
    breadcrumbLabel: "Jammu & Kashmir Bill Calculator",
    metaTitle: "Jammu & Kashmir Electricity Bill Calculator 2026 — JPDCL",
    metaDescription: "Calculate your Jammu & Kashmir electricity bill (Jammu Power Distribution Corporation Ltd (JPDCL, JERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. J&K charges a heavily subsidised ₹2.45/unit up to 200 units.",
    exampleUnits: 200,
    exampleEligible: false,
    intro: "Estimate your Jammu Power Distribution Corporation Ltd (JPDCL, JERC) electricity bill for Jammu & Kashmir. J&K charges a heavily subsidised ₹2.45/unit up to 200 units. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Heavily subsidised low tariffs", body: "Jammu & Kashmir runs some of India’s most subsidised domestic tariffs — ₹2.45/unit up to 200 units — even though the UT buys power far dearer than it sells it. JPDCL (Jammu) and KPDCL (Kashmir) share the JERC schedule." },
      { title: "How the Jammu & Kashmir bill is calculated", body: "Jammu & Kashmir domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹2.45 to ₹4.6/unit, each band charged at its own rate. A fixed charge of ₹10 per kW of sanctioned load applies." },
    ],
    faqs: [
      { q: "Is the Jammu & Kashmir electricity tariff telescopic?", a: "Yes. Jammu & Kashmir charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Jammu & Kashmir domestic connection?", a: "The fixed charge is ₹10 per kW of sanctioned load." },
      { q: "How accurate is this Jammu & Kashmir bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official JPDCL bill." },
    ],
  },
  {
    slug: "tripura-electricity-bill-calculator",
    discomCode: "TSECL",
    h1: "Tripura Electricity Bill Calculator",
    breadcrumbLabel: "Tripura Bill Calculator",
    metaTitle: "Tripura Electricity Bill Calculator 2026 — TSECL",
    metaDescription: "Calculate your Tripura electricity bill (Tripura State Electricity Corporation Ltd (TSECL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Tripura makes the first 100 domestic units free.",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Tripura State Electricity Corporation Ltd (TSECL) electricity bill for Tripura. Tripura makes the first 100 domestic units free. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "First 100 units free", body: "Tripura’s revised TSERC tariff makes the first 100 units completely free for domestic consumers, then charges ₹4.00 and ₹6.00/unit, with a low ₹16/kW fixed charge and a ₹0.20/unit fuel adjustment." },
      { title: "How the Tripura bill is calculated", body: "Tripura domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹0 to ₹6/unit, each band charged at its own rate. A fixed charge of ₹16 per kW of sanctioned load applies, plus a 5% electricity duty, and a ₹0.2/unit fuel/variable-cost surcharge." },
    ],
    faqs: [
      { q: "Is the Tripura electricity tariff telescopic?", a: "Yes. Tripura charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Tripura domestic connection?", a: "The fixed charge is ₹16 per kW of sanctioned load." },
      { q: "How accurate is this Tripura bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official TSECL bill." },
    ],
  },
  {
    slug: "sikkim-electricity-bill-calculator",
    discomCode: "EPD-SK",
    h1: "Sikkim Electricity Bill Calculator",
    breadcrumbLabel: "Sikkim Bill Calculator",
    metaTitle: "Sikkim Electricity Bill Calculator 2026 — EPD-SK",
    metaDescription: "Calculate your Sikkim electricity bill (Energy & Power Department, Sikkim (SERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Sikkim has among India’s lowest domestic tariffs (from ₹1.10/unit).",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Energy & Power Department, Sikkim (SERC) electricity bill for Sikkim. Sikkim has among India’s lowest domestic tariffs (from ₹1.10/unit). Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Among the lowest tariffs in India", body: "Sikkim has some of the cheapest domestic power in the country — a ₹1.10/unit lifeline for the first 50 units, rising only to ₹4.10 above 200 — with a phase-based fixed charge of ₹50 (single) or ₹200 (three-phase)." },
      { title: "How the Sikkim bill is calculated", body: "Sikkim domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹1.1 to ₹4.1/unit, each band charged at its own rate. A fixed charge of ₹50 single-phase / ₹200 three-phase applies, plus a 5% electricity duty." },
    ],
    faqs: [
      { q: "Is the Sikkim electricity tariff telescopic?", a: "Yes. Sikkim charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Sikkim domestic connection?", a: "The fixed charge is ₹50 single-phase / ₹200 three-phase." },
      { q: "How accurate is this Sikkim bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official EPD-SK bill." },
    ],
  },
  {
    slug: "meghalaya-electricity-bill-calculator",
    discomCode: "MePDCL",
    h1: "Meghalaya Electricity Bill Calculator",
    breadcrumbLabel: "Meghalaya Bill Calculator",
    metaTitle: "Meghalaya Electricity Bill Calculator 2026 — MePDCL",
    metaDescription: "Calculate your Meghalaya electricity bill (Meghalaya Power Distribution Corporation Ltd (MePDCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Meghalaya uses a three-slab tariff with an ₹80/kW fixed charge.",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Meghalaya Power Distribution Corporation Ltd (MePDCL) electricity bill for Meghalaya. Meghalaya uses a three-slab tariff with an ₹80/kW fixed charge. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A flat-ish three-slab tariff", body: "Meghalaya uses a compact three-slab telescopic tariff (₹4.50 / ₹5.00 / ₹6.50) with a relatively high ₹80/kW fixed charge and a 5% electricity duty. BPL homes get a concessional ₹3.65/unit for the first 30 units." },
      { title: "How the Meghalaya bill is calculated", body: "Meghalaya domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹4.5 to ₹6.5/unit, each band charged at its own rate. A fixed charge of ₹80 per kW of sanctioned load applies, plus a 5% electricity duty." },
    ],
    faqs: [
      { q: "Is the Meghalaya electricity tariff telescopic?", a: "Yes. Meghalaya charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Meghalaya domestic connection?", a: "The fixed charge is ₹80 per kW of sanctioned load." },
      { q: "How accurate is this Meghalaya bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official MePDCL bill." },
    ],
  },
  {
    slug: "manipur-electricity-bill-calculator",
    discomCode: "MSPDCL",
    h1: "Manipur Electricity Bill Calculator",
    breadcrumbLabel: "Manipur Bill Calculator",
    metaTitle: "Manipur Electricity Bill Calculator 2026 — MSPDCL",
    metaDescription: "Calculate your Manipur electricity bill (Manipur State Power Distribution Co. Ltd (MSPDCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Manipur uses a simple three-tier domestic tariff.",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Manipur State Power Distribution Co. Ltd (MSPDCL) electricity bill for Manipur. Manipur uses a simple three-tier domestic tariff. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A simple three-tier structure", body: "Manipur charges domestic consumers on a three-tier telescopic basis (₹4.50 / ₹5.50 / ₹6.50) with a ₹70/kW monthly fixed charge and a 5% electricity duty." },
      { title: "How the Manipur bill is calculated", body: "Manipur domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹4.5 to ₹6.5/unit, each band charged at its own rate. A fixed charge of ₹70 per kW of sanctioned load applies, plus a 5% electricity duty." },
    ],
    faqs: [
      { q: "Is the Manipur electricity tariff telescopic?", a: "Yes. Manipur charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Manipur domestic connection?", a: "The fixed charge is ₹70 per kW of sanctioned load." },
      { q: "How accurate is this Manipur bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official MSPDCL bill." },
    ],
  },
  {
    slug: "arunachal-pradesh-electricity-bill-calculator",
    discomCode: "APDOP",
    h1: "Arunachal Pradesh Electricity Bill Calculator",
    breadcrumbLabel: "Arunachal Pradesh Bill Calculator",
    metaTitle: "Arunachal Pradesh Electricity Bill Calculator 2026 — APDOP",
    metaDescription: "Calculate your Arunachal Pradesh electricity bill (Department of Power, Arunachal Pradesh). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Arunachal Pradesh charges a flat ₹4.40/unit with no slabs.",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Department of Power, Arunachal Pradesh electricity bill for Arunachal Pradesh. Arunachal Pradesh charges a flat ₹4.40/unit with no slabs. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A single flat rate", body: "Arunachal Pradesh uses a flat domestic tariff of about ₹4.40 per unit with no telescopic slabs — every unit is billed at the same rate. Power is run by the state Department of Power." },
      { title: "How the Arunachal Pradesh bill is calculated", body: "Arunachal Pradesh domestic supply is billed monthly. Every unit is charged at a flat ₹4.4/unit. A fixed charge of a flat ₹30/month applies." },
    ],
    faqs: [
      { q: "Is the Arunachal Pradesh electricity tariff telescopic?", a: "Arunachal Pradesh uses a flat domestic rate rather than telescopic slabs — every unit is billed at the same rate." },
      { q: "What is the fixed charge for a Arunachal Pradesh domestic connection?", a: "The fixed charge is a flat ₹30/month." },
      { q: "How accurate is this Arunachal Pradesh bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Slab detail is limited; this uses the published flat domestic rate. Always confirm against your official APDOP bill." },
    ],
  },
  {
    slug: "mizoram-electricity-bill-calculator",
    discomCode: "PED-MZ",
    h1: "Mizoram Electricity Bill Calculator",
    breadcrumbLabel: "Mizoram Bill Calculator",
    metaTitle: "Mizoram Electricity Bill Calculator 2026 — PED-MZ",
    metaDescription: "Calculate your Mizoram electricity bill (Power & Electricity Department, Mizoram). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Mizoram has a comparatively high domestic tariff (from ~₹4.20/unit).",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Power & Electricity Department, Mizoram electricity bill for Mizoram. Mizoram has a comparatively high domestic tariff (from ~₹4.20/unit). Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A high north-eastern tariff", body: "Mizoram’s domestic power is relatively expensive by Indian standards, starting around ₹4.20/unit. Detailed public slab data is limited, so this uses an indicative two-slab structure." },
      { title: "How the Mizoram bill is calculated", body: "Mizoram domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹4.2 to ₹6/unit, each band charged at its own rate. A fixed charge of a flat ₹30/month applies." },
    ],
    faqs: [
      { q: "Is the Mizoram electricity tariff telescopic?", a: "Yes. Mizoram charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Mizoram domestic connection?", a: "The fixed charge is a flat ₹30/month." },
      { q: "How accurate is this Mizoram bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Public slab detail is limited; the structure here is indicative and needs verification. Always confirm against your official PED-MZ bill." },
    ],
  },
  {
    slug: "nagaland-electricity-bill-calculator",
    discomCode: "DOPN",
    h1: "Nagaland Electricity Bill Calculator",
    breadcrumbLabel: "Nagaland Bill Calculator",
    metaTitle: "Nagaland Electricity Bill Calculator 2026 — DOPN",
    metaDescription: "Calculate your Nagaland electricity bill (Department of Power, Nagaland). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Nagaland has one of India’s highest domestic tariffs.",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Department of Power, Nagaland electricity bill for Nagaland. Nagaland has one of India’s highest domestic tariffs. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Among the highest tariffs in India", body: "Nagaland’s domestic electricity is among the most expensive in the country. Reliable public slab data is scarce, so this uses an indicative structure starting near ₹3.80/unit." },
      { title: "How the Nagaland bill is calculated", body: "Nagaland domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹3.8 to ₹6.5/unit, each band charged at its own rate. A fixed charge of a flat ₹30/month applies." },
    ],
    faqs: [
      { q: "Is the Nagaland electricity tariff telescopic?", a: "Yes. Nagaland charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Nagaland domestic connection?", a: "The fixed charge is a flat ₹30/month." },
      { q: "How accurate is this Nagaland bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Public slab detail is limited; the structure here is indicative and needs verification. Always confirm against your official DOPN bill." },
    ],
  },
  {
    slug: "andaman-and-nicobar-islands-electricity-bill-calculator",
    discomCode: "ANED",
    h1: "Andaman & Nicobar Islands Electricity Bill Calculator",
    breadcrumbLabel: "Andaman & Nicobar Islands Bill Calculator",
    metaTitle: "Andaman & Nicobar Islands Electricity Bill Calculator 2026 — ANED",
    metaDescription: "Calculate your Andaman & Nicobar Islands electricity bill (Electricity Department, Andaman & Nicobar). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. The Andaman & Nicobar islands keep domestic tariffs subsidised (from ~₹2.75/unit).",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Electricity Department, Andaman & Nicobar electricity bill for Andaman & Nicobar Islands. The Andaman & Nicobar islands keep domestic tariffs subsidised (from ~₹2.75/unit). Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "A subsidised island grid", body: "The Andaman & Nicobar islands run a largely diesel-backed grid but keep domestic tariffs subsidised, starting around ₹2.75/unit. Detailed slab data is limited, so this uses an indicative structure." },
      { title: "How the Andaman & Nicobar Islands bill is calculated", body: "Andaman & Nicobar Islands domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹2.75 to ₹5/unit, each band charged at its own rate. A fixed charge of a flat ₹30/month applies." },
    ],
    faqs: [
      { q: "Is the Andaman & Nicobar Islands electricity tariff telescopic?", a: "Yes. Andaman & Nicobar Islands charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Andaman & Nicobar Islands domestic connection?", a: "The fixed charge is a flat ₹30/month." },
      { q: "How accurate is this Andaman & Nicobar Islands bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Public slab detail is limited; the structure here is indicative and needs verification. Always confirm against your official ANED bill." },
    ],
  },
  {
    slug: "dadra-and-nagar-haveli-and-daman-and-diu-electricity-bill-calculator",
    discomCode: "DNHPDCL",
    h1: "Dadra & Nagar Haveli and Daman & Diu Electricity Bill Calculator",
    breadcrumbLabel: "Dadra & Nagar Haveli and Daman & Diu Bill Calculator",
    metaTitle: "Dadra & Nagar Haveli and Daman & Diu Electricity Bill Calculator 2026 — DNHPDCL",
    metaDescription: "Calculate your Dadra & Nagar Haveli and Daman & Diu electricity bill (DNH & DD Power Distribution Corporation Ltd (DNHPDCL)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. DNH & DD uses a simple two-slab domestic tariff (₹4.00 / ₹6.50).",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your DNH & DD Power Distribution Corporation Ltd (DNHPDCL) electricity bill for Dadra & Nagar Haveli and Daman & Diu. DNH & DD uses a simple two-slab domestic tariff (₹4.00 / ₹6.50). Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Low-cost power in an industrial UT", body: "The Dadra & Nagar Haveli and Daman & Diu UT is heavily industrial and offers some of India’s cheapest power to industry; domestic supply uses a simple two-slab structure of about ₹4.00 and ₹6.50/unit." },
      { title: "How the Dadra & Nagar Haveli and Daman & Diu bill is calculated", body: "Dadra & Nagar Haveli and Daman & Diu domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹4 to ₹6.5/unit, each band charged at its own rate. A fixed charge of a flat ₹30/month applies." },
    ],
    faqs: [
      { q: "Is the Dadra & Nagar Haveli and Daman & Diu electricity tariff telescopic?", a: "Yes. Dadra & Nagar Haveli and Daman & Diu charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Dadra & Nagar Haveli and Daman & Diu domestic connection?", a: "The fixed charge is a flat ₹30/month." },
      { q: "How accurate is this Dadra & Nagar Haveli and Daman & Diu bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Always confirm against your official DNHPDCL bill." },
    ],
  },
  {
    slug: "lakshadweep-electricity-bill-calculator",
    discomCode: "LED",
    h1: "Lakshadweep Electricity Bill Calculator",
    breadcrumbLabel: "Lakshadweep Bill Calculator",
    metaTitle: "Lakshadweep Electricity Bill Calculator 2026 — LED",
    metaDescription: "Calculate your Lakshadweep electricity bill (Electricity Department, Lakshadweep). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Lakshadweep charges a heavily subsidised flat ~₹1.50/unit.",
    exampleUnits: 100,
    exampleEligible: false,
    intro: "Estimate your Electricity Department, Lakshadweep electricity bill for Lakshadweep. Lakshadweep charges a heavily subsidised flat ~₹1.50/unit. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Heavily subsidised island power", body: "Lakshadweep’s power is diesel-generated but heavily subsidised, with domestic tariffs among the lowest in India at around ₹1.50/unit on a flat basis." },
      { title: "How the Lakshadweep bill is calculated", body: "Lakshadweep domestic supply is billed monthly. Every unit is charged at a flat ₹1.5/unit. A fixed charge of a flat ₹20/month applies." },
    ],
    faqs: [
      { q: "Is the Lakshadweep electricity tariff telescopic?", a: "Lakshadweep uses a flat domestic rate rather than telescopic slabs — every unit is billed at the same rate." },
      { q: "What is the fixed charge for a Lakshadweep domestic connection?", a: "The fixed charge is a flat ₹20/month." },
      { q: "How accurate is this Lakshadweep bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. Public slab detail is limited; this uses the indicative flat domestic rate. Always confirm against your official LED bill." },
    ],
  },
  {
    slug: "ladakh-electricity-bill-calculator",
    discomCode: "LPDD",
    h1: "Ladakh Electricity Bill Calculator",
    breadcrumbLabel: "Ladakh Bill Calculator",
    metaTitle: "Ladakh Electricity Bill Calculator 2026 — LPDD",
    metaDescription: "Calculate your Ladakh electricity bill (Power Development Department, Ladakh (JERC)). Real domestic slab rates, fixed charge and subsidies, with a clear breakdown. Ladakh is approximated from the JERC J&K subsidised schedule.",
    exampleUnits: 150,
    exampleEligible: false,
    intro: "Estimate your Power Development Department, Ladakh (JERC) electricity bill for Ladakh. Ladakh is approximated from the JERC J&K subsidised schedule. Enter your units below for an itemised, slab-by-slab estimate.",
    explainer: [
      { title: "Approximated from the JERC schedule", body: "A specific published Ladakh domestic tariff order was not available at the time of writing, so this calculator approximates Ladakh using the heavily-subsidised JERC (Jammu & Kashmir/Ladakh) domestic pattern. Treat every figure as indicative until confirmed." },
      { title: "How the Ladakh bill is calculated", body: "Ladakh domestic supply is billed monthly. Consumption is split across telescopic slabs from ₹2 to ₹3/unit, each band charged at its own rate. A fixed charge of a flat ₹20/month applies." },
    ],
    faqs: [
      { q: "Is the Ladakh electricity tariff telescopic?", a: "Yes. Ladakh charges telescopically: each slab is billed at its own rate, so moving up a slab does not re-price your cheaper units." },
      { q: "What is the fixed charge for a Ladakh domestic connection?", a: "The fixed charge is a flat ₹20/month." },
      { q: "How accurate is this Ladakh bill estimate?", a: "It uses the published domestic slab rates and is a close estimate, not a billing-grade figure. No specific Ladakh tariff order was found; the entire schedule here is an approximation pending verification. Always confirm against your official LPDD bill." },
    ],
  },
]

export function getCalculatorPage(slug: string): DiscomPageConfig | undefined {
  return CALCULATOR_PAGES.find((p) => p.slug === slug)
}

export const allCalculatorSlugs = CALCULATOR_PAGES.map((p) => p.slug)
