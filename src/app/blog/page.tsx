import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/blog'

export const metadata: Metadata = {
  title: 'Blog — Explainers on Electricity, Solar & Finance | DesiMetrics',
  description:
    'Plain-English explainers on Indian electricity billing, rooftop solar and personal finance — from the team behind our calculators.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const posts = [
  {
    title: 'How Telescopic Electricity Slabs Actually Work',
    tag: 'Explainer',
    href: '/blog/how-telescopic-electricity-slabs-work',
    live: true,
  },
  {
    title: 'Is rooftop solar worth it in India in 2026?',
    tag: 'Solar',
    href: '/blog/is-rooftop-solar-worth-it-in-india-2026',
    live: true,
  },
  {
    title: 'New vs old tax regime: who actually saves?',
    tag: 'Finance',
    href: '/blog/new-vs-old-tax-regime-who-actually-saves',
    live: true,
  },
]

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Blog', path: PATH },
])
const itemList = itemListLd(
  posts.filter((p) => p.live).map((p) => ({ name: p.title, path: p.href })),
)

export default function BlogIndexPage() {
  return (
    <>
      <section className="relative overflow-hidden py-14 hero-gradient sm:py-16">
        <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
            <Link href="/" className="hover:text-brass">
              Home
            </Link>{' '}
            / <span className="text-white/80">Blog</span>
          </nav>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From the blog
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/70">
            Plain-English explainers on Indian electricity billing, rooftop solar and
            personal finance — grounded in the same real tariffs and formulas that
            power our calculators.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="flex flex-col rounded-2xl border border-hairline bg-paper p-6 transition hover:border-brass hover:shadow-sm"
            >
              <span className="w-fit rounded-full bg-brass/10 px-2.5 py-0.5 text-xs font-semibold text-brass">
                {p.tag}
              </span>
              <h2 className="mt-3 flex-1 font-display text-lg font-bold text-ink-navy">
                {p.title}
              </h2>
              <span className="mt-4 text-sm font-semibold text-brass">
                {p.live ? 'Read →' : 'Coming soon'}
              </span>
            </Link>
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />
      </main>
    </>
  )
}
