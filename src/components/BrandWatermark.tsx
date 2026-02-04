'use client'

export function BrandWatermark({
  opacity = 0.05,
  size = 520,
  className = '',
}: {
  opacity?: number
  size?: number
  className?: string
}) {
  // Purely decorative watermark mark.
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="absolute -right-24 -top-24">
        <img
          src={`/arqia-mark-${size}.png`}
          alt=""
          className="select-none"
          style={{ opacity }}
        />
      </div>
    </div>
  )
}
