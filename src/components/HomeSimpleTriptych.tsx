export function HomeSimpleTriptych() {
  return (
    <section className="border-t border-black/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <Module title="Materials" desc="Refined finishes, natural variation, and clear specifications." />
        <Module title="Craft" desc="Sculptural forms with modern restraint—built to endure." />
        <Module title="Delivery" desc="White-glove logistics with clear lead times." />
      </div>
    </section>
  )
}

function Module({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">ARQIA</div>
      <h3 className="mt-3 text-2xl tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{desc}</p>
    </div>
  )
}
