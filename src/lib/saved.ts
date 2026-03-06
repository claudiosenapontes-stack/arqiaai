'use client'

const KEY = 'arqia_saved_v1'

export function loadSaved(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function isSaved(slug: string): boolean {
  return loadSaved().includes(slug)
}

export function toggleSaved(slug: string): { saved: boolean; slugs: string[] } {
  const current = loadSaved()
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
  localStorage.setItem(KEY, JSON.stringify(next))
  return { saved: next.includes(slug), slugs: next }
}
