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

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  // Hard reset: keep header stable to eliminate mobile jitter.
  // No scroll listeners, no fixed+translate animations.
  const tone = overlay ? 'text-white' : 'text-neutral-900'
  const hoverTone = overlay ? 'hover:text-[color:var(--arqia-brass-light)]' : 'hover:text-[color:var(--arqia-brass-dark)]'

  return (
    <header
      className={
        (overlay ? 'absolute' : 'sticky') +
        ' left-0 right-0 top-0 z-50 ' +
        (overlay
          ? 'border-b border-white/10 bg-black/25 backdrop-blur-md'
          : 'border-b border-black/10 bg-white/85 backdrop-blur-md')
      }
    >
      <div className={'mx-auto max-w-6xl px-6 ' + (overlay ? 'pt-4 pb-3' : 'py-4')}>
        <div className={'flex items-center gap-6 ' + tone}>
          {/* Left-aligned logo */}
          <Link href="/" aria-label="ARQIA home" className="flex items-center">
            <img
              src="/arqia-mark-240.png"
              srcSet="/arqia-mark-120.png 120w, /arqia-mark-180.png 180w, /arqia-mark-240.png 240w, /arqia-mark-360.png 360w, /arqia-mark-520.png 520w"
              sizes="(min-width: 768px) 56px, 48px"
              alt="ARQIA"
              className="h-9 w-auto"
              style={{ imageRendering: 'auto' }}
            />
          </Link>

          {/* Desktop nav (center-ish) */}
          <nav
            className={
              'hidden flex-1 items-center justify-center gap-8 text-[16px] font-light uppercase tracking-[0.22em] md:flex ' +
              tone
            }
          >
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={'transition ' + hoverTone}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right: cart */}
          <Link
            href="/cart"
            className={
              'ml-auto rounded-full px-6 py-2 text-sm transition duration-300 ease-out ' +
              // Brass-gold + glass feel gradient (more premium than a flat fill)
              'border border-[color:var(--arqia-brass-light)]/45 ' +
              'text-white/90 backdrop-blur-md ' +
              'bg-[linear-gradient(135deg,rgba(224,206,169,0.38),rgba(255,255,255,0.12),rgba(183,149,91,0.28))] ' +
              'shadow-[0_10px_30px_rgba(0,0,0,0.20)] ' +
              'hover:border-[color:var(--arqia-brass-light)]/70 hover:text-[color:var(--arqia-brass-light)] ' +
              'hover:shadow-[0_14px_38px_rgba(0,0,0,0.28)] hover:scale-[1.02]'
            }
          >
            View Cart
          </Link>
        </div>

        {/* Mobile nav (second row) */}
        <div
          className={
            'mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-light uppercase tracking-[0.18em] md:hidden ' +
            tone
          }
        >
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={'transition ' + hoverTone}>
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
