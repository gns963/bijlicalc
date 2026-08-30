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
    <main className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-brass">
          Home
        </Link>{' '}
        / <Link href="/about" className="hover:text-brass">About</Link> /{' '}
        <span className="text-slate-700 dark:text-slate-300">{author.name}</span>
      </nav>

      <header className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brass/10 text-2xl font-bold text-brass dark:bg-brass/15 dark:text-brass">
          {author.name.slice(0, 1)}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {author.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{author.role}</p>
        </div>
      </header>

      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        {author.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-semibold text-slate-800 dark:text-slate-100">
        Areas of focus
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
        {author.expertise.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
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
  )
}
