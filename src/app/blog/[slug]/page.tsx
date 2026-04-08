import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOCK_BLOG_POSTS } from '@/lib/mockBlog'

export function generateStaticParams() {
  return MOCK_BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Not found' }
  return { title: `${post.title} · ARQIA` }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug)
  if (!post) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Journal</div>
      <h1 className="mt-4 font-serif text-5xl tracking-tight">{post.title}</h1>
      <div className="mt-4 text-sm text-neutral-600">
        {post.date} · {post.readingTime}
      </div>

      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-neutral-100">
        <Image src={post.cover} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
        <div aria-hidden className="absolute inset-0 bg-black/10" />
      </div>

      <article className="prose prose-neutral mt-10 max-w-none">
        <p>{post.excerpt}</p>
        <p>
          This is a starter template for the ARQIA Journal. Next, we can plug this into a real CMS or
          a database, and support categories like Indoor / Outdoor / Materials.
        </p>
      </article>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/blog"
          className="rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-neutral-800"
        >
          Back to Journal
        </Link>
        <Link
          href="/products"
          className="rounded-full bg-black px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-white"
        >
          Shop
        </Link>
      </div>
    </main>
  )
}
