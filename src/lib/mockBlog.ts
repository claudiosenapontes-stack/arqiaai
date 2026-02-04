export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  cover: string
  readingTime: string
}

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'quiet-luxury-a-shopping-framework',
    title: 'Quiet Luxury: A Shopping Framework',
    excerpt:
      'How to choose fewer, better pieces by prioritizing proportion, material honesty, and restraint.',
    date: '2026-02-01',
    cover: '/mock/furniture-3.jpg',
    readingTime: '4 min read',
  },
  {
    slug: 'materials-that-age-well',
    title: 'Materials That Age Well',
    excerpt:
      'Travertine, oak, linen, and brass—what to expect over time, and why patina is part of the design.',
    date: '2026-02-02',
    cover: '/mock/material-1.jpg',
    readingTime: '5 min read',
  },
  {
    slug: 'lighting-as-architecture',
    title: 'Lighting as Architecture',
    excerpt:
      'A simple approach to ambient, task, and accent lighting—without overfilling the ceiling plan.',
    date: '2026-02-03',
    cover: '/mock/furniture-2.jpg',
    readingTime: '6 min read',
  },
]
