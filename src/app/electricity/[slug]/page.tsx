import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DiscomCalculatorPage from '@/components/calculators/DiscomCalculatorPage'
import {
  allCalculatorSlugs,
  getCalculatorPage,
} from '@/data/calculator-pages'

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
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: { url: `${SITE}${path}`, type: 'website' },
  }
}

export default async function ElectricityCalculatorRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getCalculatorPage(slug)
  if (!config) notFound()
  return <DiscomCalculatorPage config={config} />
}
