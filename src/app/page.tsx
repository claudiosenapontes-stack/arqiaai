import { SiteHeader } from '@/components/SiteHeader'
import { HomeTilesLayer } from '@/components/HomeTilesLayer'
import { HomeSimpleTriptych } from '@/components/HomeSimpleTriptych'
import { SignatureScrollSequence } from '@/components/SignatureScrollSequence'
import { SiteFooter } from '@/components/SiteFooter'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader overlay />

      {/* Hero (first impression) */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0">
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

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-end px-6 pb-16 pt-28">
          <div className="max-w-3xl">
            <h1 className="font-serif font-light text-5xl leading-tight tracking-tight text-white md:text-7xl">
              Architectural Intelligence
              <br />
              for refined spaces.
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

      {/* Back to the simple Materials/Craft/Delivery triptych */}
      <HomeSimpleTriptych />

    </main>
  )
}
