import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

  // TODO: When products live in DB, generate per-product + per-collection URLs here.
  const routes = ['/', '/indoor', '/outdoor', '/services', '/contact', '/decor', '/rugs', '/lighting']

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
