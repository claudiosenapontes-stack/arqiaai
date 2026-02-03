import { SiteHeader } from '@/components/SiteHeader'
import Link from 'next/link'

export default function RugsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">Coming soon</div>
          <h1 className="mt-4 font-serif text-5xl tracking-tight">Rugs</h1>
          <p className="mt-4 text-neutral-600">Texture, warmth, and scale. We’ll launch rugs after the core furniture catalog.</p>
          <div className="mt-10 flex gap-3">
            <Link href="/indoor" className="rounded-full bg-black px-6 py-3 text-sm text-white">Explore Indoor</Link>
            <Link href="/outdoor" className="rounded-full border border-black/15 px-6 py-3 text-sm">Explore Outdoor</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
