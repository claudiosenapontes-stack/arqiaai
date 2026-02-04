import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { HomeTilesLayer } from '@/components/HomeTilesLayer'
import { HomeSimpleTriptych } from '@/components/HomeSimpleTriptych'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[72vh] w-full overflow-hidden bg-neutral-100">
          <div className="absolute inset-0">
            <img
              alt="ARQIA editorial"
              src="/mock/furniture-1.jpg"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Overlays to keep type readable + add luxury mood (text-on-image) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(224,206,169,0.18),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(80,86,66,0.18),transparent_50%)]" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-16">
            <div className="max-w-2xl">
              <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight text-white md:text-6xl">
                Architectural Intelligence for refined spaces.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-white/80 md:text-base">
                Furniture and design services with quiet luxury sensibility.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {/* Light framed CTAs with ARQIA olive hover accents */}
                <Link
                  href="/indoor"
                  className="rounded-full border border-white/35 bg-white/5 px-6 py-3 text-sm font-light text-white backdrop-blur transition hover:border-[color:var(--arqia-brass-light)] hover:bg-white/10 hover:text-[color:var(--arqia-brass-light)]"
                >
                  Explore Indoor
                </Link>
                <Link
                  href="/outdoor"
                  className="rounded-full border border-white/35 bg-white/5 px-6 py-3 text-sm font-light text-white backdrop-blur transition hover:border-[color:var(--arqia-brass-light)] hover:bg-white/10 hover:text-[color:var(--arqia-brass-light)]"
                >
                  Explore Outdoor
                </Link>
                <Link
                  href="/services"
                  className="rounded-full border border-white/35 bg-white/5 px-6 py-3 text-sm font-light text-white backdrop-blur transition hover:border-[color:var(--arqia-brass-light)] hover:bg-white/10 hover:text-[color:var(--arqia-brass-light)]"
                >
                  Schedule a Call
                </Link>
                <a
                  href="#collections"
                  className="rounded-full border border-white/35 bg-white/5 px-6 py-3 text-sm font-light text-white backdrop-blur transition hover:border-[color:var(--arqia-brass-light)] hover:bg-white/10 hover:text-[color:var(--arqia-brass-light)]"
                >
                  Explore Collections
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* One unified tile layer (Indoor/Outdoor/etc.) */}
      <HomeTilesLayer />

      {/* Back to the simple Materials/Craft/Delivery triptych */}
      <HomeSimpleTriptych />

      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-10 text-xs text-neutral-500">
          <div>© {new Date().getFullYear()} ARQIA</div>
          <div>Design@arqiaai.com</div>
        </div>
      </footer>
    </main>
  )
}
