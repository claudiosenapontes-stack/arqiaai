import Link from 'next/link'
import { BrandWatermark } from '@/components/BrandWatermark'

const COLLECTIONS = [
  {
    title: 'Indoor',
    collectionName: 'VELA',
    subtitle: 'Curated indoor collections for refined spaces.',
    href: '/indoor',
    images: ['/mock/furniture-1.jpg', '/mock/furniture-2.jpg'],
  },
  {
    title: 'Outdoor',
    collectionName: 'CALMA',
    subtitle: 'Weather-ready pieces with quiet luxury restraint.',
    href: '/outdoor',
    images: ['/mock/furniture-4.jpg', '/mock/furniture-3.jpg'],
  },
  {
    title: 'Decor',
    collectionName: 'TERRA',
    subtitle: 'Objects and accents (coming soon).',
    href: '/decor',
    images: ['/mock/material-2.jpg', '/mock/furniture-5.jpg'],
  },
  {
    title: 'Rugs',
    collectionName: 'DUNE',
    subtitle: 'Texture, warmth, and scale (coming soon).',
    href: '/rugs',
    images: ['/mock/material-1.jpg', '/mock/furniture-1.jpg'],
  },
  {
    title: 'Lighting',
    collectionName: 'LUME',
    subtitle: 'Sculptural light as architecture (coming soon).',
    href: '/lighting',
    images: ['/mock/furniture-5.jpg', '/mock/material-1.jpg'],
  },
]

const SERVICES = [
  {
    title: 'Interior Design',
    subtitle: 'Space planning, sourcing, and full-room concepts.',
    href: '/services',
  },
  {
    title: 'Staging',
    subtitle: 'Styling and staging for listings, showings, and presentations.',
    href: '/services',
  },
  {
    title: 'Architectural',
    subtitle: 'Layout guidance, elevations, and coordination with your build team.',
    href: '/services',
  },
  {
    title: 'Engineering',
    subtitle: 'Technical planning support and coordination for complex installs.',
    href: '/services',
  },
  {
    title: 'Trade Program',
    subtitle: 'Preferential pricing and dedicated support for pros.',
    href: '/services',
  },
  {
    title: 'White-Glove Delivery',
    subtitle: 'Scheduling, assembly, placement, and packaging removal.',
    href: '/services',
  },
]

function StackedImageStrip({
  title,
  subtitle,
  href,
  images,
  topKicker,
  bigTitle,
}: {
  title: string
  subtitle: string
  href: string
  images: [string, string]
  topKicker?: string
  bigTitle?: string
}) {
  return (
    <Link href={href} className="group relative block bg-neutral-100">
      <div className="grid w-full">
        {images.map((src, idx) => (
          <div key={idx} className="relative aspect-[21/9] w-full overflow-hidden">
            <img
              alt={title}
              src={src}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Top-left overlay */}
      <div className="pointer-events-none absolute left-0 top-0 w-full">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="max-w-xl">
            {topKicker ? (
              <div className="text-xs uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">{topKicker}</div>
            ) : null}

            {bigTitle ? (
              <div className="mt-3 text-3xl md:text-4xl font-extralight uppercase tracking-[0.28em] text-[color:var(--arqia-brass-light)]">
                {bigTitle}
              </div>
            ) : null}

            <div
              className={
                'font-serif text-2xl md:text-3xl tracking-tight text-white ' +
                ((topKicker || bigTitle) ? 'mt-2' : 'mt-3')
              }
            >
              {title}
            </div>

            <p className="mt-3 text-sm text-white/80">{subtitle}</p>

            <div className="mt-6 inline-flex items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/5 px-5 py-2 text-xs font-light uppercase tracking-[0.25em] text-white/85 backdrop-blur transition duration-300 ease-out group-hover:border-[color:var(--arqia-brass-light)] group-hover:bg-white/10 group-hover:text-[color:var(--arqia-brass-light)]/80 group-hover:scale-[1.02]">
                Explore
                <span className="transition duration-300 ease-out group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function HomeTilesLayer() {
  return (
    <section id="collections" className="scroll-mt-24 border-t border-arqia-olive/10">
      {/* Keep the heading aligned, but make the collection images full-bleed */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Collections</div>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">Explore collections</h2>
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">A visual, editorial way to browse by space.</p>
        </div>
      </div>

      <div className="space-y-0">
        {COLLECTIONS.map((c) => (
          <StackedImageStrip
            key={c.title}
            title={c.title}
            topKicker="Collection"
            bigTitle={c.collectionName}
            subtitle={c.subtitle}
            href={c.href}
            images={c.images as [string, string]}
          />
        ))}
      </div>

      {/* Services (cards floating above a parallax background) */}
      <section className="relative border-t border-black/10">
        <BrandWatermark opacity={0.035} size={360} className="mix-blend-multiply" />

        <div className="mx-auto max-w-6xl px-6 py-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Services</div>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">Work with ARQIA</h2>
            <p className="mt-4 max-w-2xl text-sm text-neutral-600">
              Design support, trade partnerships, and delivery—built for projects that need precision.
            </p>
          </div>

          {/* Full-width static background image; cards/titles float and move while the photo stays fixed */}
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-black/10">
            <div className="relative min-h-[140vh]">
              {/* Sticky backdrop (static feel) */}
              <div className="pointer-events-none sticky top-0 h-screen w-full">
                <div className="absolute inset-0">
                  <img
                    src="/mock/furniture-5.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div aria-hidden className="absolute inset-0 bg-black/30" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
                </div>
              </div>

              {/* Foreground content scrolls over the fixed-feel image */}
              <div className="relative z-10 mx-auto -mt-[70vh] max-w-6xl px-6 pb-16">
                <div className="grid gap-4 md:grid-cols-3">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.title}
                      href={s.href}
                      className="group rounded-3xl border border-white/20 bg-white/85 p-6 backdrop-blur transition hover:border-white/35 hover:bg-white/90"
                    >
                      <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Service</div>
                      <div className="mt-3 font-serif text-2xl text-neutral-900">{s.title}</div>
                      <div className="mt-3 text-sm text-neutral-700">{s.subtitle}</div>
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs font-light uppercase tracking-[0.25em] text-neutral-900 transition group-hover:border-black/30">
                        Learn more <span className="transition group-hover:translate-x-0.5">→</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/services"
                    className="rounded-full bg-black/80 px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-white backdrop-blur hover:bg-black"
                  >
                    Explore Services
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full border border-white/25 bg-white/0 px-6 py-3 text-xs font-light uppercase tracking-[0.25em] text-white backdrop-blur hover:border-white/45"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
