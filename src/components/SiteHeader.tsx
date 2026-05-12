'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

const NAV = [
  { href: '/studio/indoor', label: 'Indoor' },
  { href: '/studio/outdoor', label: 'Outdoor' },
  { href: '/studio/decor', label: 'Decor' },
  { href: '/studio/rugs', label: 'Rugs' },
  { href: '/studio/lighting', label: 'Lighting' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader({
  overlay = false,
  filterMenu,
}: {
  overlay?: boolean
  filterMenu?: { label?: string; param?: string; items: string[] }
}) {
  const [solidText, setSolidText] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [hoverReveal, setHoverReveal] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const [search, setSearch] = useState('')
  const prevPathnameRef = useRef(pathname)

  const filterParam = filterMenu?.param ?? 'type'
  const currentFilter = useMemo(() => {
    if (!search) return 'All'
    return new URLSearchParams(search).get(filterParam) ?? 'All'
  }, [search, filterParam])

  useEffect(() => {
    let lastY = window.scrollY
    const hasHover = window.matchMedia?.('(hover: hover)').matches ?? true

    const onScroll = () => {
      const y = window.scrollY
      setSolidText(y > 24)

      if (hasHover) {
        // Desktop: show the header on the first screen (hero), then hide.
        // After the hero, reveal only on hover.
        setHidden(y >= window.innerHeight * 0.85)
      } else {
        // Touch devices: no hover — use scroll intent.
        const goingDown = y > lastY
        if (y < 40) {
          setHidden(false)
        } else if (goingDown && y > 120) {
          setHidden(true)
        } else if (!goingDown) {
          setHidden(false)
        }
      }

      lastY = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sync = () => setSearch(window.location.search)
    sync()

    const onPop = () => sync()
    window.addEventListener('popstate', onPop)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFilterOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  // Close dropdown when navigating using layout effect to avoid cascading renders
  useLayoutEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setFilterOpen(false)
      prevPathnameRef.current = pathname
    }
  }, [pathname])

  // RH-style: always visible, no white bar. Readability via subtle top gradient.
  const isRevealed = !hidden || hoverReveal

  // Always keep nav typography in the brass family (no gray).
  // - On hero/dark backgrounds: brass-light
  // - On scrolled/light backgrounds: brass-dark for contrast
  // - When hover-revealed over mixed imagery: brass-light
  const tone = isRevealed
    ? 'text-[color:var(--arqia-brass-light)]'
    : solidText
      ? 'text-[color:var(--arqia-brass-dark)]'
      : 'text-[color:var(--arqia-brass-light)]'

  // Make hover “light up” more: brighter brass + slight glow.
  const hoverTone =
    'hover:text-[color:var(--arqia-brass-light)] hover:drop-shadow-[0_0_10px_rgba(224,206,169,0.55)]'

  return (
    <>
      {/* Hover strip: keeps a tiny hit-area at the very top so the header can re-appear on hover (desktop). */}
      <div
        className={(overlay ? 'fixed' : 'fixed') + ' left-0 right-0 top-0 z-50 h-2'}
        onMouseEnter={() => setHoverReveal(true)}
        onMouseLeave={() => setHoverReveal(false)}
      />

      <header
        onMouseEnter={() => setHoverReveal(true)}
        onMouseLeave={() => setHoverReveal(false)}
        className={
          (overlay ? 'fixed left-0 right-0 top-0 ' : 'fixed left-0 right-0 top-0 ') +
          'z-50 bg-transparent transition-all duration-300 ' +
          (isRevealed ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none')
        }
      >
      {/* Click-away layer for filter dropdown */}
      {filterOpen ? (
        <button
          aria-label="Close filters"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setFilterOpen(false)}
        />
      ) : null}
      {/* Top fade for legibility (not a bar) */}
      <div
        aria-hidden
        className={
          'pointer-events-none absolute inset-x-0 top-0 h-32 transition-opacity duration-300 ' +
          // IMPORTANT: On hero pages we already apply full-bleed overlays inside the hero.
          // A second overlay coming from the header can create a visible “seam” where it ends.
          // So: disable the header fade while on hero (overlay=true) until the user scrolls.
          (overlay && !solidText
            ? 'opacity-0'
            : solidText
              ? // When scrolled (solidText), use a warm/brown tint so brass nav reads on light pages.
                'opacity-90 bg-gradient-to-b from-[#6b5a3a]/45 via-[#6b5a3a]/14 to-transparent'
              : // Non-hero: keep the darker fade for legibility.
                'opacity-85 bg-gradient-to-b from-black/65 via-black/25 to-transparent')
        }
      />

      {/* Full-width header */}
      <div className={'w-full px-6 md:px-14 ' + (overlay ? 'pt-6 pb-4' : 'py-4')}>
        <div className={'flex w-full items-center gap-8 ' + tone}>
          {/* Left-aligned logo */}
          <Link
            href="/"
            aria-label="ARQIA home"
            className={'flex items-center gap-3 transition ' + (solidText ? '' : 'drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]')}
          >
            <Image
              src="/arqia-mark-240.png"
              alt="ARQIA"
              width={120}
              height={40}
              className="h-10 w-auto"
              style={{ imageRendering: 'auto' }}
              priority
            />
            <span
              aria-hidden
              className="text-[10px] font-light uppercase tracking-[0.32em] opacity-80"
            >
              Studio
            </span>
          </Link>

          {/* Desktop nav (center-ish) — matches firm home: 11px tracked caps */}
          <nav className={'hidden flex-1 items-center justify-center gap-8 text-[11px] font-normal uppercase tracking-[0.22em] md:flex ' + tone}>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={
                  'group relative pb-[3px] transition duration-300 ' + hoverTone
                }
              >
                {n.label}
                <span
                  aria-hidden
                  className="absolute left-0 -bottom-0 h-px w-0 bg-[color:var(--brass-light)] transition-all duration-300 ease-out group-hover:w-full"
                />
              </Link>
            ))}

            {/* Optional: collection filters as a header dropdown */}
            {filterMenu?.items?.length ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((v) => !v)}
                  className={
                    'rounded-full border px-5 py-2 text-[13px] font-light uppercase tracking-[0.26em] transition duration-300 ' +
                    'border-[color:var(--arqia-brass-light)]/35 bg-white/0 backdrop-blur ' +
                    tone +
                    ' ' +
                    hoverTone
                  }
                >
                  {(filterMenu.label ?? 'Type') + ': ' + currentFilter}
                </button>

                {filterOpen ? (
                  <div className="absolute left-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-[0_22px_60px_rgba(0,0,0,0.20)] backdrop-blur">
                    <div className="px-2 py-2">
                      {['All', ...filterMenu.items].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            const sp = new URLSearchParams(window.location.search)
                            if (item === 'All') sp.delete(filterParam)
                            else sp.set(filterParam, item)
                            const qs = sp.toString()
                            const url = pathname + (qs ? `?${qs}` : '')
                            router.push(url)
                            setSearch(qs ? `?${qs}` : '')
                            setFilterOpen(false)
                          }}
                          className={
                            'block w-full rounded-xl px-4 py-3 text-left text-[13px] font-light uppercase tracking-[0.22em] transition ' +
                            (item === currentFilter ? 'bg-black/5 text-black' : 'text-neutral-800 hover:bg-black/5')
                          }
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </nav>

          {/* Right: cart — firm-style tracked caps with subtle brass border */}
          <Link
            href="/cart"
            className={
              'ml-auto rounded-full px-6 py-2.5 text-[11px] font-normal uppercase tracking-[0.22em] transition duration-300 ease-out ' +
              'border border-[color:var(--brass-light)]/45 ' +
              'text-[color:var(--brass-light)] backdrop-blur-md ' +
              'bg-[linear-gradient(135deg,rgba(224,206,169,0.22),rgba(255,255,255,0.08),rgba(183,149,91,0.18))] ' +
              'shadow-[0_8px_24px_rgba(0,0,0,0.16)] ' +
              'hover:border-[color:var(--brass-light)]/70 hover:text-[color:var(--brass-light)] ' +
              'hover:shadow-[0_12px_32px_rgba(0,0,0,0.22)]'
            }
          >
            View Cart
          </Link>
        </div>

        {/* Mobile nav (second row) */}
        <div
          className={
            'mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-normal uppercase tracking-[0.22em] md:hidden ' +
            tone
          }
        >
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={'transition duration-300 ' + hoverTone}>
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
    </>
  )
}
