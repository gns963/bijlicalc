import Link from 'next/link'
import type { AcProduct } from '@/data/ac-products'
import { formatINR } from '@/lib/format'

/**
 * Amazon Associates affiliate tag — PLACEHOLDER.
 * Replace with the real tag once the Associates account is approved.
 */
const AFFILIATE_TAG = 'desimetrics-21' // TODO(affiliate): real Amazon Associates tag

function amazonSearchUrl(name: string): string {
  // Search links (not /dp/<asin>) so placeholder products never 404.
  return `https://www.amazon.in/s?k=${encodeURIComponent(name)}&tag=${AFFILIATE_TAG}`
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <span className="text-brass" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      <span className="text-slate-300">
        {'★'.repeat(5 - full)}
      </span>
    </span>
  )
}

export default function AffiliateProductCard({
  product,
  highlight,
}: {
  product: AcProduct
  highlight?: string
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-hairline bg-paper p-4 shadow-sm">
      {highlight && (
        <span className="mb-2 inline-block w-fit rounded-full bg-brass/10 px-2 py-0.5 text-xs font-semibold text-brass">
          {highlight}
        </span>
      )}
      <div className="flex h-28 items-center justify-center rounded-xl bg-mist text-5xl">
        {product.emoji}
      </div>
      <h3 className="font-display mt-3 text-sm font-semibold text-ink-navy">
        {product.name}
      </h3>
      <div className="mt-1 flex items-center gap-2 text-xs text-ash/60">
        <Stars rating={product.rating} />
        <span>
          {product.rating} ({product.reviews.toLocaleString('en-IN')})
        </span>
      </div>
      <p className="mt-2 text-lg font-bold tabular-nums text-ink-navy">
        {formatINR(product.price)}
      </p>
      <a
        href={amazonSearchUrl(product.name)}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="mt-3 rounded-lg bg-brass px-4 py-2 text-center text-sm font-semibold text-ink-navy hover:bg-brass/50"
      >
        View on Amazon
      </a>
      <p className="mt-1 text-center text-[11px] text-ash/40">
        Affiliate link ·{' '}
        <Link href="/affiliate-disclosure" className="underline">
          disclosure
        </Link>
      </p>
    </div>
  )
}
