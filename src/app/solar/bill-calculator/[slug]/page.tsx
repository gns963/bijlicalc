import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SolarStatePage from '@/components/calculators/SolarStatePage'
import { allDiscomCodeSlugs, getCalculatorPageByDiscomSlug } from '@/data/calculator-pages'
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
  const path = `/solar/bill-calculator/${slug}`
  return {
    title: `${tariff.state} Solar Bill Calculator 2026 — Rooftop Payback & Subsidy`,
    description: `Estimate your rooftop solar payback and savings in ${tariff.state}, using ${config.discomCode}'s real tariff and the PM Surya Ghar subsidy.`,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: { url: `${SITE}${path}`, type: 'website' },
  }
}

export default async function SolarStateRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getCalculatorPageByDiscomSlug(slug)
  if (!config) notFound()
  const tariff = getTariff(config.discomCode)

  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '' },
    { name: 'Solar', path: '/solar' },
    { name: 'Bill Calculator', path: '/solar/bill-calculator' },
    { name: tariff.state, path: `/solar/bill-calculator/${slug}` },
  ])

  return (
    <>
      <SolarStatePage state={tariff.state} discomCode={config.discomCode} slug={config.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}
