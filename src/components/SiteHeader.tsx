'use client'

import Link from 'next/link'

const NAV = [
  { href: '/indoor', label: 'Indoor' },
  { href: '/outdoor', label: 'Outdoor' },
  { href: '/decor', label: 'Decor' },
  { href: '/rugs', label: 'Rugs' },
  { href: '/lighting', label: 'Lighting' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center">
            <img src="/arqia-logo.jpg" alt="ARQIA" className="h-7 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-light tracking-[0.22em] uppercase text-neutral-700 md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="transition hover:text-arqia-olive">
                {n.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            className="rounded-full border border-black/15 bg-white px-4 py-1.5 text-sm transition hover:border-arqia-olive/60 hover:text-arqia-olive"
          >
            Cart
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="mt-3 flex gap-4 overflow-x-auto text-[13px] font-light tracking-[0.2em] uppercase text-neutral-700 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap transition hover:text-arqia-olive">
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
