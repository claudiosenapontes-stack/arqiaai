import Link from 'next/link'

export function SimilarSplitRow({
  label = 'Similar',
  title,
  subtitle,
  img,
  href,
  flip = false,
}: {
  label?: string
  title: string
  subtitle?: string
  img: string
  href: string
  flip?: boolean
}) {
  return (
    <section className="product-hero-fullbleed overflow-hidden border-y border-black/5 bg-white">
      <Link
        href={href}
        className={
          'group grid min-h-[420px] md:grid-cols-2 ' +
          (flip ? 'md:[direction:rtl]' : '')
        }
      >
        {/* Text */}
        <div
          className={
            'flex items-center px-6 py-14 md:px-16 md:py-16 ' +
            (flip ? 'md:[direction:ltr]' : '')
          }
        >
          <div className="mx-auto w-full max-w-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">{label}</div>
            <div className="mt-4 font-serif text-4xl tracking-tight text-neutral-900 md:text-5xl">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                {subtitle}
              </div>
            ) : null}
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2 text-xs font-light uppercase tracking-[0.25em] text-neutral-800">
              View <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className={
          'relative min-h-[260px] md:min-h-[420px] ' + (flip ? 'md:[direction:ltr]' : '')
        }>
          <img
            alt={title}
            src={img}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
          />
          <div aria-hidden className="absolute inset-0 bg-black/10" />
          <div
            aria-hidden
            className={
              'absolute inset-0 ' +
              (flip
                ? 'bg-gradient-to-r from-black/18 via-black/8 to-black/6'
                : 'bg-gradient-to-l from-black/18 via-black/8 to-black/6')
            }
          />
        </div>
      </Link>
    </section>
  )
}
