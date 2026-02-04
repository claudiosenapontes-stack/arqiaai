import { SiteHeader } from '@/components/SiteHeader'
import { HomeTilesLayer } from '@/components/HomeTilesLayer'
import { HomeSimpleTriptych } from '@/components/HomeSimpleTriptych'
import { SignatureScrollSequence } from '@/components/SignatureScrollSequence'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader overlay />

      {/* Hero = full-bleed signature video moment (scroll-scrubbed). */}
      <SignatureScrollSequence />

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
