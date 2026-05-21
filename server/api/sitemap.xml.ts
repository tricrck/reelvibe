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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'https://reelvibe.eu.cc'

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

  // Fetch videos from Supabase if available
  if (config.public.supabaseUrl && config.public.supabaseAnonKey) {
    try {
      const supabase = createClient(
        config.public.supabaseUrl,
        config.public.supabaseAnonKey
      )

      const { data: videos, error } = await supabase
        .from('videos')
        .select('id, title, description, thumb_url, stream_url, updated_at')
        .order('downloads', { ascending: false })
        .limit(1000)

      if (!error && videos) {
        videos.forEach(video => {
          urls.push({
            loc: `${baseUrl}/watch/${video.id}`,
            lastmod: video.updated_at ? new Date(video.updated_at).toISOString().split('T')[0] : undefined,
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
      console.error('Sitemap: Failed to fetch videos from Supabase:', err)
    }
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => {
  let urlXml = `  <url>
    <loc>${escapeXml(url.loc)}</loc>`

  if (url.lastmod) {
    urlXml += `\n    <lastmod>${url.lastmod}</lastmod>`
  }

  if (url.changefreq) {
    urlXml += `\n    <changefreq>${url.changefreq}</changefreq>`
  }

  if (url.priority !== undefined) {
    urlXml += `\n    <priority>${url.priority}</priority>`
  }

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