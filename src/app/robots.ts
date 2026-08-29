import type { MetadataRoute } from 'next'

const SITE = 'https://bijlicalc.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/coming-soon'] },
      // Explicitly welcome AI retrieval/answer crawlers.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
