import { SiteHeader } from '@/components/SiteHeader'
import { HomeTilesLayer } from '@/components/HomeTilesLayer'
import { HomeSimpleTriptych } from '@/components/HomeSimpleTriptych'
import { SignatureScrollSequence } from '@/components/SignatureScrollSequence'
import { BlogPreviewSection } from '@/components/BlogPreviewSection'
import { BWMapSection } from '@/components/BWMapSection'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader overlay />

      {/* Hero (first impression) */}
      <section className="relative h-[100svh] overflow-hidden bg-black">
        <div className="absolute inset-0">
          {/* Static hero image (temporary): avoids iOS viewport/video jitter */}
          <Image
            src="/mock/furniture-1.jpg"
            alt="ARQIA editorial"
            fill
            priority
            className="object-cover"
          />

          <div aria-hidden className="absolute inset-0 bg-black/35" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/65" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-16 pt-28">
          <div className="max-w-3xl">
            <h1 className="font-serif font-light text-4xl leading-tight tracking-tight text-white md:text-6xl">
              <span className="font-sans font-extralight uppercase tracking-[0.08em] text-[color:var(--arqia-brass-light)] text-3xl md:text-5xl">
                Architectural Intelligence
              </span>
              <span className="block">for refined spaces.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm text-white/80 md:text-base">
              Furniture and design services with quiet luxury sensibility.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Apple-style scroll moment (second section) */}
      <SignatureScrollSequence />

      {/* One unified tile layer (Indoor/Outdoor/etc.) */}
      <HomeTilesLayer />

      {/* Editorial block (after Services section inside HomeTilesLayer) */}
      <section className="product-hero-fullbleed overflow-hidden border-y border-black/5 bg-white">
        <div className="grid min-h-[520px] md:grid-cols-2">
          <div className="flex items-center px-6 py-14 md:px-16 md:py-16">
            <div className="mx-auto w-full max-w-xl">
              <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Editorial</div>
              <h3 className="mt-4 font-serif text-4xl tracking-tight text-neutral-900 md:text-5xl">
                Materials, restraint, and proportion
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                A curated set of silhouettes, tuned for quiet luxury. Larger imagery, fewer choices per
                screen—better decisions.
              </p>
              <div className="mt-8">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-neutral-800"
                >
                  Browse the shop <span className="transition">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[320px] md:min-h-[520px]">
            <Image src="/mock/furniture-2.jpg" alt="Materials and restraint" fill className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-black/10" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-l from-black/25 via-black/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* Blog */}
      <BlogPreviewSection />

      {/* Map */}
      <BWMapSection address="2900 High Ridge Road, Boynton Beach, FL" />

      {/* Back to the simple Materials/Craft/Delivery triptych */}
      <HomeSimpleTriptych />

    </main>
  )
}
