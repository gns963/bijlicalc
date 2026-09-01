import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import GasCgdPage from '@/components/calculators/GasCgdPage'
import GasCompanyPage from '@/components/calculators/GasCompanyPage'
import { allGasCompanySlugs, getGasCompany } from '@/data/gas-companies'
import { getGasCgdBySlug } from '@/data/gas-cgds'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'

export function generateStaticParams() {
  return allGasCompanySlugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = getGasCompany(slug)
  if (!company) return {}
  const path = `/gas/${slug}`
  const cgd = getGasCgdBySlug(slug)
  if (cgd?.hasTariffFile) {
    return {
      title: `${company.name} PNG Bill Calculator 2026 — Real Tariff | bijlicalc`,
      description: `Estimate your ${company.name} piped natural gas (PNG) bill using their real, dated domestic tariff — not a guessed rate.`,
      alternates: { canonical: `${SITE}${path}` },
      openGraph: { url: `${SITE}${path}`, type: 'website' },
    }
  }
  const titleSuffix = /\bgas\b/i.test(company.name) ? 'Bill Calculator' : 'Gas Bill Calculator'
  return {
    title: `${company.name} ${titleSuffix} 2026 | bijlicalc`,
    description: `Estimate your ${company.name} piped natural gas (PNG) bill from your own consumption and rate.`,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: { url: `${SITE}${path}`, type: 'website' },
  }
}

export default async function GasCompanyRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const company = getGasCompany(slug)
  if (!company) notFound()

  const cgd = getGasCgdBySlug(slug)
  if (cgd?.hasTariffFile) {
    // Real-tariff page renders its own breadcrumb/schema internally.
    return <GasCgdPage cgdCode={cgd.code} slug={slug} />
  }

  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '' },
    { name: 'Gas', path: '/gas' },
    { name: company.name, path: `/gas/${slug}` },
  ])

  return (
    <>
      <GasCompanyPage companyName={company.name} slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}
