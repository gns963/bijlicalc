/** Anchor-linked table of contents. Real <nav> + section IDs, not decorative. */
export default function TableOfContents({
  items,
}: {
  items: { id: string; label: string }[]
}) {
  return (
    <nav aria-label="Table of contents" className="mb-8">
      <details className="group rounded-xl border border-hairline bg-paper p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between font-display font-bold text-ink-navy">
          Table of contents
          <span className="text-brass transition group-open:rotate-45">+</span>
        </summary>
        <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-ash/70 hover:text-brass"
              >
                {i + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  )
}
