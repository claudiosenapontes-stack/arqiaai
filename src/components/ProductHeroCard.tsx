'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toggleSaved, loadSaved } from '@/lib/saved'

export function ProductHeroCard({
  category,
  title,
  member,
  retail,
  img,
  inquiryEmail,
  href,
}: {
  category: string
  title: string
  member: string
  retail: string
  img: string
  inquiryEmail: string
  href?: string
}) {
  const slug = href?.split('/').pop() ?? ''
  // slug is stable for a given card; initialize from localStorage once.
  const [saved, setSaved] = useState(() => (slug ? loadSaved().includes(slug) : false))

  return (
    <div className="product-hero-fullbleed group overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        <img
          alt={title}
          src={img}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />

        {/* overlay (bigger type, vertically centered, left aligned) */}
        <div className="absolute inset-0">
          <div className="flex h-full items-center">
            <div className="w-full bg-[linear-gradient(to_top,rgba(0,0,0,0.68),rgba(0,0,0,0.30)_42%,rgba(0,0,0,0.10)_72%,rgba(0,0,0,0)_100%)] px-6 py-10 md:px-10 md:py-14">
              <div className="max-w-2xl">
                <div className="text-xs uppercase tracking-[0.34em] text-white/75 md:text-sm">{category}</div>
                <div className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
                  {title}
                </div>
                <div className="mt-4 space-y-1">
                  <div className="text-base text-white md:text-lg">
                    <span className="text-white/70">Member</span> {member}
                  </div>
                  <div className="text-sm text-white/75 md:text-base">
                    <span className="text-white/70">Retail</span> {retail}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {href ? (
                    <Link
                      href={href}
                      className="rounded-full bg-white/92 px-7 py-3 text-base text-black backdrop-blur md:text-lg"
                    >
                      View
                    </Link>
                  ) : (
                    <button className="rounded-full bg-white/92 px-7 py-3 text-base text-black backdrop-blur md:text-lg">
                      View
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      if (!slug) return
                      const res = toggleSaved(slug)
                      setSaved(res.saved)
                    }}
                    className={
                      'rounded-full border px-7 py-3 text-base backdrop-blur md:text-lg ' +
                      (saved
                        ? 'border-[color:var(--arqia-brass-light)]/70 bg-[color:var(--arqia-brass-light)]/15 text-[color:var(--arqia-brass-light)]'
                        : 'border-white/30 bg-white/10 text-white')
                    }
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

                <div className="mt-5">
                  <a
                    href={`mailto:${inquiryEmail}?subject=Professional%20Membership%20Inquiry`}
                    className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm text-white/85 backdrop-blur transition hover:bg-white/15 md:text-base"
                  >
                    Inquire about Professional Membership
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
