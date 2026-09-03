import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Methodology — How DesiMetrics Sources & Verifies Data',
  description:
    'Exactly how DesiMetrics sources tariff data from SERC orders, validates it, and calculates bills — including the sourceUrl, lastVerified and verifiedBy fields behind every calculator.',
  alternates: { canonical: 'https://desimetrics.com/methodology' },
}

export default function MethodologyPage() {
  return (
    <LegalPageShell
      title="Methodology"
      intro="This page explains exactly how our calculators work — where the numbers come from, how they are verified, and where the known limits are. Nothing here is hand-waving; each mechanism is how the site is actually built."
      stub={false}
      path="/methodology"
    >
      <h2 className="font-display text-xl font-semibold text-ash">
        1. One data file per DISCOM
      </h2>
      <p>
        Each distribution company&apos;s tariff lives in its own structured JSON
        file (for example <code>src/data/tariffs/tneb.json</code>). Every file
        records the slab rates, fixed charge, fuel cost adjustment, electricity
        duty and subsidy schemes, plus four provenance fields:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <code>sourceUrl</code> — a link to the State Electricity Regulatory
          Commission (SERC) tariff order or notification the numbers came from.
          You can see and click this on every calculator page.
        </li>
        <li>
          <code>effectiveFrom</code> — the date the tariff took effect.
        </li>
        <li>
          <code>lastVerified</code> — the date we last checked the file against
          its source. This is the &quot;Tariff last verified&quot; date shown in
          each calculator&apos;s footer.
        </li>
        <li>
          <code>verifiedBy</code> — a plain-language verification status. Where a
          tariff has been sourced from secondary references but not yet
          cross-checked against the primary order, this field says so, and we
          treat it as provisional.
        </li>
      </ul>

      <h2 className="font-display text-xl font-semibold text-ash">
        2. Every file is schema-validated
      </h2>
      <p>
        Before a tariff can be used, it is validated against a strict{' '}
        <a
          href="https://zod.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brass underline"
        >
          Zod
        </a>{' '}
        schema. The schema enforces that slabs are continuous and correctly
        ordered, that only the top slab is open-ended, that a fixed charge matches
        its declared basis, and that the provenance fields are present. A
        malformed or half-finished tariff simply cannot reach a calculator.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash">
        3. A single, tested calculation engine
      </h2>
      <p>
        All bills are computed by one framework-agnostic engine using telescopic
        slab logic: each slab is charged only for the units that fall inside it,
        then fuel cost adjustment, fixed charge, electricity duty and any subsidy
        are applied. The engine is covered by automated unit tests, and the same
        engine powers the solar and AC calculators so the electricity maths is
        consistent everywhere.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash">
        4. We disclose what we don&apos;t model
      </h2>
      <p>
        Some tariff components change every month or follow rules our slab engine
        cannot represent. Rather than approximate them silently, we state the
        limitation on the relevant page — for example Maharashtra&apos;s wheeling
        charge and fuel adjustment, West Bengal&apos;s monthly MVCA surcharge, or
        Kerala&apos;s switch to a non-telescopic rate above 250 units a month.
        Estimates are close, not billing-grade, and we say so.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash">
        5. Update cadence
      </h2>
      <p>
        Tariffs change when a SERC issues a new order. When that happens we update
        the DISCOM&apos;s data file and its <code>lastVerified</code> date, which
        automatically flows through to every page and worked example that uses
        it. See the{' '}
        <Link href="/data-sources" className="text-brass underline">
          data sources
        </Link>{' '}
        page for the current source order behind each DISCOM.
      </p>
    </LegalPageShell>
  )
}
