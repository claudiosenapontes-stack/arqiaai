import Image from 'next/image'

export function EditorialSplit({
  kicker = 'Editorial',
  title,
  body,
  img,
  flip = false,
}: {
  kicker?: string
  title: string
  body: string
  img: string
  flip?: boolean
}) {
  return (
    <section className="product-hero-fullbleed overflow-hidden border-y border-black/5 bg-white">
      <div className={'grid min-h-[520px] md:grid-cols-2 ' + (flip ? 'md:[direction:rtl]' : '')}>
        {/* Text */}
        <div className={
          'flex items-center px-6 py-14 md:px-16 md:py-16 ' + (flip ? 'md:[direction:ltr]' : '')
        }>
          <div className="mx-auto w-full max-w-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">{kicker}</div>
            <h3 className="mt-4 text-4xl tracking-tight text-neutral-900 md:text-5xl">
              {title}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-neutral-600 md:text-base">{body}</p>
          </div>
        </div>

        {/* Image */}
        <div className={
          'relative min-h-[320px] md:min-h-[520px] ' + (flip ? 'md:[direction:ltr]' : '')
        }>
          <Image src={img} alt={title} fill className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-black/10" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-l from-black/25 via-black/10 to-black/8" />
        </div>
      </div>
    </section>
  )
}
