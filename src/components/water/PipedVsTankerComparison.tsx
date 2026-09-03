'use client'

import { useId, useMemo, useState } from 'react'
import { computeWaterBill, getWaterTariff } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorHeader, SliderField } from '../calculators/CalculatorShell'

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

/**
 * Piped (real board tariff) vs tanker vs 20L jar — a genuine ₹/litre
 * comparison, computed live via computeWaterBill(), not a static claim.
 * Tanker/jar prices are the consumer's own local input, since (like water
 * boards themselves) there's no centrally verifiable national rate.
 */
export default function PipedVsTankerComparison({ boardCode }: { boardCode: string }) {
  const tariff = getWaterTariff(boardCode)
  const id = useId()
  const [monthlyKl, setMonthlyKl] = useState(15)
  const [tankerPrice, setTankerPrice] = useState(800)
  const [tankerLitres, setTankerLitres] = useState(6000)
  const [jarPrice, setJarPrice] = useState(60)

  const result = useMemo(() => {
    const periodMonths = tariff.billingCycle === 'bimonthly' ? 2 : 1
    const cycleKl = monthlyKl * periodMonths
    const bill = computeWaterBill(tariff, { consumptionKl: cycleKl })
    const monthlyCost = bill.monthlyEquivalent?.total ?? bill.total
    const pipedPerLitre = monthlyCost / (monthlyKl * 1000)

    const tankerPerLitre = tankerPrice / tankerLitres
    const tankersNeeded = Math.ceil((monthlyKl * 1000) / tankerLitres)
    const tankerMonthlyCost = tankersNeeded * tankerPrice

    const jarPerLitre = jarPrice / 20
    const jarsNeeded = Math.ceil((monthlyKl * 1000) / 20)
    const jarMonthlyCost = jarsNeeded * jarPrice

    return {
      pipedMonthlyCost: round2(monthlyCost),
      pipedPerLitre,
      tankerPerLitre,
      tankerMonthlyCost,
      tankersNeeded,
      jarPerLitre,
      jarMonthlyCost,
      jarsNeeded,
    }
  }, [tariff, monthlyKl, tankerPrice, tankerLitres, jarPrice])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🚛"
        title="Piped Water vs Tanker vs Jar — Cost Comparison"
        subtitle={`${tariff.boardCode}'s real tariff against your own local tanker/jar prices`}
      />

      <div className="grid gap-5">
        <SliderField
          id={`${id}-kl`}
          label="Your monthly consumption"
          value={monthlyKl}
          onChange={setMonthlyKl}
          min={1}
          max={60}
          unit="KL"
          hint="1 KL = 1,000 litres."
        />
        <SliderField
          id={`${id}-tanker-price`}
          label="Tanker price per delivery"
          value={tankerPrice}
          onChange={setTankerPrice}
          min={200}
          max={3000}
          step={50}
          unit="₹"
          hint="Check your local tanker operator's rate — this varies a lot by city."
        />
        <SliderField
          id={`${id}-tanker-litres`}
          label="Tanker capacity"
          value={tankerLitres}
          onChange={setTankerLitres}
          min={1000}
          max={12000}
          step={500}
          unit="L"
        />
        <SliderField
          id={`${id}-jar-price`}
          label="20L jar price"
          value={jarPrice}
          onChange={setJarPrice}
          min={20}
          max={150}
          step={5}
          unit="₹"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-hub-water/20 bg-hub-water/5 p-4">
          <p className="text-xs font-semibold tracking-wide text-hub-water uppercase">
            Piped ({tariff.boardCode})
          </p>
          <p className="font-display mt-1 text-xl font-bold tabular-nums text-hub-water">
            {formatINR(result.pipedMonthlyCost)}
            <span className="text-xs font-normal text-ash/50">/mo</span>
          </p>
          <p className="mt-1 text-xs text-ash/60">
            ≈ ₹{result.pipedPerLitre.toFixed(3)}/litre
          </p>
        </div>
        <div className="rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-4">
          <p className="text-xs font-semibold tracking-wide text-caution-amber uppercase">
            Tanker only
          </p>
          <p className="font-display mt-1 text-xl font-bold tabular-nums text-caution-amber">
            {formatINR(result.tankerMonthlyCost)}
            <span className="text-xs font-normal text-ash/50">/mo</span>
          </p>
          <p className="mt-1 text-xs text-ash/60">
            {result.tankersNeeded} loads · ₹{result.tankerPerLitre.toFixed(3)}/litre
          </p>
        </div>
        <div className="rounded-xl border border-hairline bg-mist p-4">
          <p className="text-xs font-semibold tracking-wide text-ash/60 uppercase">
            20L jars only
          </p>
          <p className="font-display mt-1 text-xl font-bold tabular-nums text-ink-navy">
            {formatINR(result.jarMonthlyCost)}
            <span className="text-xs font-normal text-ash/50">/mo</span>
          </p>
          <p className="mt-1 text-xs text-ash/60">
            {result.jarsNeeded} jars · ₹{result.jarPerLitre.toFixed(3)}/litre
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-ash/50">
        Piped cost uses {tariff.boardCode}&apos;s real tariff via the same
        engine as the calculator above. Tanker and jar prices are your own
        local inputs — there&apos;s no centrally verifiable national rate for
        either, so enter what your area actually charges. Jars in practice
        aren&apos;t used to replace your entire monthly supply; this figure
        is a per-litre cost reference, not a realistic full-substitution
        scenario.
      </p>
    </CalculatorCard>
  )
}
