import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DiscomCalculatorPage from '@/components/calculators/DiscomCalculatorPage'
import {
  allCalculatorSlugs,
  getCalculatorPage,
} from '@/data/calculator-pages'
import { hiDiscomPageTexts } from '@/data/discom-page-texts'

const SITE = 'https://desimetrics.com'

export function generateStaticParams() {
  return allCalculatorSlugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = getCalculatorPage(slug)
  if (!config) return {}
  const path = `/electricity/${slug}`
  return {
    // Hindi-translated chrome only; the config's own metaTitle/metaDescription
    // are per-DISCOM authored English copy not yet translated (tracked
    // separately) — reuse them for now rather than leaving metadata empty.
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `${SITE}/hi${path}`,
      languages: { 'en-IN': `${SITE}${path}`, 'hi-IN': `${SITE}/hi${path}` },
    },
    openGraph: { url: `${SITE}/hi${path}`, type: 'website' },
  }
}

export default async function ElectricityCalculatorRouteHi({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getCalculatorPage(slug)
  if (!config) notFound()
  return <DiscomCalculatorPage config={config} texts={hiDiscomPageTexts} />
}
