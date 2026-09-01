import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { allAuthorSlugs, getAuthor } from '@/data/authors'

const SITE = 'https://bijlicalc.com'

export function generateStaticParams() {
  return allAuthorSlugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) return {}
  return {
    title: `${author.name} — ${author.role} | bijlicalc`,
    description: author.bio[0]?.slice(0, 155),
    alternates: { canonical: `${SITE}/author/${slug}` },
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) notFound()

  const personLd = {
    '@context': 'https://schema.org',
    '@type': author.slug === 'editorial-team' ? 'Organization' : 'Person',
    name: author.name,
    url: `${SITE}/author/${slug}`,
    email: author.email,
    knowsAbout: author.expertise,
  }

  return (
    <>
      <section className="relative overflow-hidden py-14 hero-gradient sm:py-16">
        <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
            <Link href="/" className="hover:text-brass">
              Home
            </Link>{' '}
            / <Link href="/about" className="hover:text-brass">About</Link> /{' '}
            <span className="text-white/80">{author.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl font-bold text-brass">
              {author.name.slice(0, 1)}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {author.name}
              </h1>
              <p className="text-white/60">{author.role}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="space-y-4 text-ash/80 dark:text-gazette-cream/70">
        {author.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h2 className="font-display mt-8 text-xl font-semibold text-ash dark:text-gazette-cream">
        Areas of focus
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-ash/80 dark:text-gazette-cream/70">
        {author.expertise.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-ash/60 dark:text-ash/40">
        Contact:{' '}
        <a
          href={`mailto:${author.email}`}
          className="text-brass underline hover:text-brass"
        >
          {author.email}
        </a>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      </main>
    </>
  )
}
