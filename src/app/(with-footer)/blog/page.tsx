import Image from 'next/image'
import Link from 'next/link'
import { MOCK_BLOG_POSTS } from '@/lib/mockBlog'

export const metadata = {
  title: 'Journal · ARQIA',
}

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Journal</div>
          <h1 className="mt-3 text-[clamp(28px,4vw,52px)] font-extralight uppercase leading-[1.05] tracking-[-0.005em] text-[color:var(--ink)]">ARQIA Notes</h1>
          <p className="mt-4 max-w-2xl text-sm text-neutral-600 md:text-base">
            Essays on materials, proportion, and building rooms with restraint.
          </p>
        </div>
        <Link
          href="/studio/products"
          className="rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-neutral-800"
        >
          Shop
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {MOCK_BLOG_POSTS.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group overflow-hidden rounded-3xl border border-black/10 bg-white"
          >
            <div className="relative aspect-[4/3] bg-neutral-100">
              <Image
                src={p.cover}
                alt={p.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div aria-hidden className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                {p.date} · {p.readingTime}
              </div>
              <div className="mt-3 text-2xl tracking-tight text-neutral-900">{p.title}</div>
              <div className="mt-3 text-sm leading-relaxed text-neutral-600">{p.excerpt}</div>
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-light uppercase tracking-[0.25em] text-neutral-800">
                Read <span className="transition group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
