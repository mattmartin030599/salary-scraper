import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/salaryData'

const BASE = 'https://salaryscraper.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 1   },
    { url: `${BASE}/explore`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/faq`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/helpful-links`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const salaryPages: MetadataRoute.Sitemap = getAllSlugs().map(slug => ({
    url: `${BASE}/salary/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [...staticPages, ...salaryPages]
}
