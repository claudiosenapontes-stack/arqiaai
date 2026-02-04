import type { Metadata } from 'next'
import Link from 'next/link'
import { MOCK_PRODUCTS, formatUsd } from '@/lib/mockCatalog'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Furniture curated for refined spaces.',
  alternates: { canonical: '/products' },
}

export default function ProductsPage() {
  const products = MOCK_PRODUCTS

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-5xl tracking-tight">Shop</h1>
          <p className="mt-3 text-sm text-neutral-600">Furniture curated for refined spaces.</p>
        </div>
        <Link
          href="/cart"
          className="rounded-full border border-black/10 bg-white px-6 py-2 text-sm text-neutral-800 backdrop-blur hover:border-black/20"
        >
          View Cart
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="group overflow-hidden rounded-3xl border border-black/10 bg-white transition hover:shadow-sm"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
              <img
                alt={p.title}
                src={p.img}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">{p.categoryLabel}</div>
              <div className="mt-2 font-serif text-2xl tracking-tight text-neutral-900">{p.title}</div>
              {p.subtitle ? <div className="mt-2 text-sm text-neutral-600">{p.subtitle}</div> : null}
              <div className="mt-5 text-sm text-neutral-800">
                <span className="text-neutral-500">Member</span> {formatUsd(p.memberPriceCents)}
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                <span className="text-neutral-500">Retail</span> {formatUsd(p.retailPriceCents)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
