import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { HomeTilesLayer } from '@/components/HomeTilesLayer'
import { HomeSimpleTriptych } from '@/components/HomeSimpleTriptych'
import { SignatureScrollSequence } from '@/components/SignatureScrollSequence'
import { BlogPreviewSection } from '@/components/BlogPreviewSection'
import { BWMapSection } from '@/components/BWMapSection'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'ARQIA Studio — Furniture for refined spaces',
  description: 'ARQIA Studio: editorial furniture, lighting, decor, and rugs for interiors with quiet luxury sensibility.',
  alternates: { canonical: '/studio' },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-bone">
      <SiteHeader overlay />

      {/* Hero — Montserrat hierarchy, olive-deep ground (matches firm) */}
      <section className="relative h-[100svh] overflow-hidden bg-[color:var(--olive-deep)]">
        <div className="absolute inset-0">
          <Image
            src="/mock/furniture-1.jpg"
            alt="ARQIA Studio editorial"
            fill
            priority
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg,rgba(80,86,66,.55) 0%,rgba(80,86,66,.15) 30%,rgba(42,45,34,.85) 100%), linear-gradient(90deg,rgba(42,45,34,.4) 0%,transparent 60%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-20 pt-28 md:px-10">
          <div className="max-w-3xl">
            <div className="text-[10px] font-normal uppercase tracking-[0.32em] text-[color:var(--brass-light)]">
              ARQIA Studio
            </div>
            <h1 className="mt-5 text-[color:var(--bone)]">
              <span className="block text-[clamp(28px,4.4vw,56px)] font-extralight leading-[1.05] tracking-[-0.005em] uppercase">
                Furniture for
                <br />
                <span className="font-semibold text-[color:var(--brass-light)]">
                  refined spaces.
                </span>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[12px] font-light leading-relaxed tracking-[0.04em] text-[color:var(--bone)]/75 md:text-[13px]">
              Editorial furniture, lighting, decor, and rugs — selected with the same
              quiet luxury sensibility as our architecture practice.
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
              <h3 className="mt-4 text-4xl tracking-tight text-neutral-900 md:text-5xl">
                Materials, restraint, and proportion
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                A curated set of silhouettes, tuned for quiet luxury. Larger imagery, fewer choices per
                screen—better decisions.
              </p>
              <div className="mt-8">
                <Link
                  href="/studio/products"
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
            <div aria-hidden className="absolute inset-0 bg-gradient-to-l from-black/25 via-black/10 to-black/8" />
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
