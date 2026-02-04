'use client'

import Link from 'next/link'

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
  return (
    <div className="product-hero-fullbleed group overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        <img
          alt={title}
          src={img}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />

        {/* overlay */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="bg-gradient-to-t from-black/55 via-black/20 to-transparent p-6">
            <div className="max-w-md">
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/70">{category}</div>
              <div className="mt-2 font-serif text-3xl tracking-tight text-white">{title}</div>
              <div className="mt-2">
                <div className="text-sm text-white">
                  <span className="text-white/70">Member</span> {member}
                </div>
                <div className="mt-0.5 text-xs text-white/70">
                  <span className="text-white/70">Retail</span> {retail}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {href ? (
                  <Link
                    href={href}
                    className="rounded-full bg-white/90 px-5 py-2.5 text-sm text-black backdrop-blur"
                  >
                    View
                  </Link>
                ) : (
                  <button className="rounded-full bg-white/90 px-5 py-2.5 text-sm text-black backdrop-blur">
                    View
                  </button>
                )}

                <button className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur">
                  Save
                </button>
              </div>

              <div className="mt-4">
                <a
                  href={`mailto:${inquiryEmail}?subject=Professional%20Membership%20Inquiry`}
                  className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] text-white/80 backdrop-blur transition hover:bg-white/15"
                >
                  Inquire about Professional Membership
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
