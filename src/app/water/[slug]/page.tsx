import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WaterBoardPage from '@/components/calculators/WaterBoardPage'
import WaterStatePage from '@/components/calculators/WaterStatePage'
import { CALCULATOR_PAGES } from '@/data/calculator-pages'
import { getWaterBoardBySlug } from '@/data/water-boards'
import { getTariff } from '@/lib/calc/electricity'
import { slugify } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

const states = CALCULATOR_PAGES.map((p) => getTariff(p.discomCode).state)
  .filter((state, i, arr) => arr.indexOf(state) === i)
  .map((state) => ({ state, slug: slugify(state) }))

function getState(slug: string) {
  return states.find((s) => s.slug === slug)
}

export function generateStaticParams() {
  return states.map((s) => ({ slug: s.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getState(slug)
  if (!entry) return {}
  const path = `/water/${slug}`
  const board = getWaterBoardBySlug(slug)
  if (board?.hasTariffFile) {
    return {
      title: `${board.name} Water Bill Calculator 2026 — Real Tariff | DesiMetrics`,
      description: `Estimate your ${board.name} water bill using their real, dated domestic tariff — not a guessed rate.`,
      alternates: { canonical: `${SITE}${path}` },
      openGraph: { url: `${SITE}${path}`, type: 'website' },
    }
  }
  return {
    title: `${entry.state} Water Bill Calculator 2026 | DesiMetrics`,
    description: `Estimate your water bill in ${entry.state} from your own consumption and board's rate.`,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: { url: `${SITE}${path}`, type: 'website' },
  }
}

export default async function WaterStateRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getState(slug)
  if (!entry) notFound()

  const board = getWaterBoardBySlug(slug)
  if (board?.hasTariffFile) {
    // Real-tariff page renders its own breadcrumb/schema internally.
    return <WaterBoardPage boardCode={board.code} slug={slug} />
  }

  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '' },
    { name: 'Water', path: '/water' },
    { name: entry.state, path: `/water/${slug}` },
  ])

  return (
    <>
      <WaterStatePage state={entry.state} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}
