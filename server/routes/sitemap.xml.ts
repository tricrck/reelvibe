import { createClient } from '@supabase/supabase-js'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
  video?: {
    title: string
    description: string
    content_loc: string
    thumbnail_loc: string
    player_loc?: string
    tags?: string[]
  }
}

interface VideosResponse {
  data: {
    id: string
    title: string
    description: string
    thumb_url: string
    stream_url: string
    updated_at: string
  }[]
  error: null | unknown
  total: number
  page: number
  limit: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'https://reelvibe.eu.cc'
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey
  const FUNCTION_URL = `${supabaseUrl}/functions/v1`

  const urls: SitemapUrl[] = []

  // Static pages
  const staticPages = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    { loc: '/?sort=popular', priority: 0.8, changefreq: 'daily' },
    { loc: '/?sort=recent', priority: 0.8, changefreq: 'daily' },
  ]

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.loc}`,
      changefreq: page.changefreq as any,
      priority: page.priority
    })
  })

  // Fetch all videos via edge function (paginated)
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const fetchPage = async (page: number): Promise<VideosResponse> => {
        const params = new URLSearchParams({
          page: String(page),
          sort: 'downloads',
          limit: '100'          // bump if your function supports it
        })
        const res = await fetch(`${FUNCTION_URL}/videos-api?${params}`)
        return res.json()
      }

      // Fetch first page to get total count
      const firstPage = await fetchPage(1)

      if (!firstPage.error && firstPage.data) {
        const totalPages = Math.ceil(firstPage.total / firstPage.limit)

        // Collect remaining pages in parallel (cap at 10 pages → 1000 videos)
        const remainingPages = Array.from(
          { length: Math.min(totalPages - 1, 9) },
          (_, i) => fetchPage(i + 2)
        )
        const restResults = await Promise.all(remainingPages)

        const allVideos = [
          ...firstPage.data,
          ...restResults.flatMap(r => r.data ?? [])
        ]

        allVideos.forEach(video => {
          urls.push({
            loc: `${baseUrl}/watch/${video.id}`,
            lastmod: video.updated_at
              ? new Date(video.updated_at).toISOString().split('T')[0]
              : undefined,
            changefreq: 'weekly',
            priority: 0.7,
            video: {
              title: video.title,
              description: video.description?.slice(0, 200) || '',
              content_loc: video.stream_url || '',
              thumbnail_loc: video.thumb_url || '',
              player_loc: `${baseUrl}/watch/${video.id}`
            }
          })
        })
      }
    } catch (err) {
      console.error('Sitemap: Failed to fetch videos from edge function:', err)
    }
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => {
  let urlXml = `  <url>
    <loc>${escapeXml(url.loc)}</loc>`

  if (url.lastmod) urlXml += `\n    <lastmod>${url.lastmod}</lastmod>`
  if (url.changefreq) urlXml += `\n    <changefreq>${url.changefreq}</changefreq>`
  if (url.priority !== undefined) urlXml += `\n    <priority>${url.priority}</priority>`

  if (url.video) {
    urlXml += `\n    <video:video>
      <video:title>${escapeXml(url.video.title)}</video:title>
      <video:description>${escapeXml(url.video.description)}</video:description>
      <video:content_loc>${escapeXml(url.video.content_loc)}</video:content_loc>
      <video:thumbnail_loc>${escapeXml(url.video.thumbnail_loc)}</video:thumbnail_loc>
      <video:player_loc allow_embed="yes">${escapeXml(url.video.player_loc || '')}</video:player_loc>
    </video:video>`
  }

  urlXml += '\n  </url>'
  return urlXml
}).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return sitemap
})

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}