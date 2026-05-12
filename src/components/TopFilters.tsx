'use client'

import { useState } from 'react'

const TYPES = ['Sectionals','Sofas','Dining','Coffee Tables','Beds','Chairs','Outdoor Lounge','Outdoor Dining']

export function TopFilters({ title, showControls = true }: { title: string; showControls?: boolean }) {
  const [type, setType] = useState<string>('All')
  const [price, setPrice] = useState<string>('All')
  const [material, setMaterial] = useState<string>('All')

  return (
    <div className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 pb-10 pt-28 md:pt-32">
        <div>
          <h1 className="text-4xl tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">Curated pieces for refined spaces.</p>
        </div>

        {showControls ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Select label="Type" value={type} setValue={setType} options={['All', ...TYPES]} />
            <Select label="Price" value={price} setValue={setPrice} options={['All', '$0–$999', '$1k–$2.5k', '$2.5k–$5k', '$5k+']} />
            <Select label="Material" value={material} setValue={setMaterial} options={['All', 'Wood', 'Stone', 'Metal', 'Upholstery']} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  setValue,
  options,
}: {
  label: string
  value: string
  setValue: (v: string) => void
  options: string[]
}) {
  return (
    <label className="flex w-full items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm transition hover:border-black/20 focus-within:border-black/30 focus-within:ring-1 focus-within:ring-black/10">
      <span className="text-xs uppercase tracking-[0.22em] text-neutral-500">{label}</span>
      <select
        className="min-w-0 flex-1 bg-transparent text-right text-sm text-neutral-900 outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
