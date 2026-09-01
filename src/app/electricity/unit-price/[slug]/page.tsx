import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UnitPricePage from '@/components/calculators/UnitPricePage'
import { allDiscomCodeSlugs, getCalculatorPageByDiscomSlug } from '@/data/calculator-pages'
import { marginalRatePerUnit } from '@/lib/calc/ac'
import { getTariff } from '@/lib/calc/electricity'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'

export function generateStaticParams() {
  return allDiscomCodeSlugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = getCalculatorPageByDiscomSlug(slug)
  if (!config) return {}
  const tariff = getTariff(config.discomCode)
  const rate = marginalRatePerUnit(config.discomCode)
  const path = `/electricity/unit-price/${slug}`
  return {
    title: `${tariff.state} 1 Unit Electricity Price 2026 — ₹${rate.toFixed(2)}/unit`,
    description: `What 1 unit of electricity costs in ${tariff.state} under ${tariff.discomCode}'s real tariff — full slab-wise rates, FCA and duty.`,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: { url: `${SITE}${path}`, type: 'website' },
  }
}

export default async function UnitPriceRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getCalculatorPageByDiscomSlug(slug)
  if (!config) notFound()

  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '' },
    { name: 'Electricity', path: '/electricity' },
    { name: '1 Unit Price', path: '/electricity/unit-price' },
    { name: config.breadcrumbLabel, path: `/electricity/unit-price/${slug}` },
  ])

  return (
    <>
      <UnitPricePage config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}
