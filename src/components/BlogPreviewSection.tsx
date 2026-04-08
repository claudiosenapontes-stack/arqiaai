import Image from 'next/image'
import Link from 'next/link'
import { MOCK_BLOG_POSTS } from '@/lib/mockBlog'

export function BlogPreviewSection() {
  const posts = MOCK_BLOG_POSTS.slice(0, 3)

  return (
    <section className="product-hero-fullbleed border-y border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Journal</div>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-neutral-900 md:text-5xl">
              ARQIA Notes
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-neutral-600 md:text-base">
              Short essays on materials, proportion, and building rooms with restraint.
            </p>
          </div>
          <Link
            href="/blog"
            className="rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-neutral-800"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
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
                <div className="mt-3 font-serif text-2xl tracking-tight text-neutral-900">
                  {p.title}
                </div>
                <div className="mt-3 text-sm leading-relaxed text-neutral-600">{p.excerpt}</div>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-light uppercase tracking-[0.25em] text-neutral-800">
                  Read <span className="transition group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
