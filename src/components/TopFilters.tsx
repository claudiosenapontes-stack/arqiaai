'use client'

import { useState } from 'react'

const TYPES = ['Sectionals','Sofas','Dining','Coffee Tables','Beds','Chairs','Outdoor Lounge','Outdoor Dining']

export function TopFilters({ title }: { title: string }) {
  const [type, setType] = useState<string>('All')
  const [price, setPrice] = useState<string>('All')
  const [material, setMaterial] = useState<string>('All')

  return (
    <div className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-10 pt-32 md:pt-36">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">Curated pieces for refined spaces.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select label="Type" value={type} setValue={setType} options={['All', ...TYPES]} />
          <Select label="Price" value={price} setValue={setPrice} options={['All', '$0–$999', '$1k–$2.5k', '$2.5k–$5k', '$5k+']} />
          <Select label="Material" value={material} setValue={setMaterial} options={['All', 'Wood', 'Stone', 'Metal', 'Upholstery']} />
          <div className="ml-auto text-xs text-neutral-500">Filters are UI-only for now; wiring to DB next.</div>
        </div>
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
    <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs transition hover:border-black/20 focus-within:border-black/30 focus-within:ring-1 focus-within:ring-black/10">
      <span className="text-neutral-500">{label}</span>
      <select className="bg-transparent outline-none text-neutral-900" value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
