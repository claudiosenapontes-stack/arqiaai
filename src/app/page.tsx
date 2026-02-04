import { SiteHeader } from '@/components/SiteHeader'
import { HomeTilesLayer } from '@/components/HomeTilesLayer'
import { HomeSimpleTriptych } from '@/components/HomeSimpleTriptych'
import { SignatureScrollSequence } from '@/components/SignatureScrollSequence'
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

      <footer className="relative overflow-hidden border-t border-black/10 bg-white">
        {/* subtle watermark */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-28 opacity-[0.035]">
          <img src="/arqia-mark-520.png" alt="" className="h-72 w-auto" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            {/* Full logo */}
            <div className="opacity-90">
              <img
                src="/arqia-full-780.png"
                srcSet="/arqia-full-520.png 520w, /arqia-full-780.png 780w, /arqia-full-1040.png 1040w, /arqia-full-1400.png 1400w"
                sizes="(min-width: 768px) 340px, 260px"
                alt="ARQIA"
                className="h-10 w-auto"
              />
            </div>

            <div className="flex w-full flex-col gap-2 text-xs text-neutral-500 md:w-auto md:items-end">
              <div>© {new Date().getFullYear()} ARQIA</div>
              <div>Design@arqiaai.com</div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
