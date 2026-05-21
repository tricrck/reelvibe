export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/', '/sitemap.xml'],
      crawlLinks: true
    },
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  app: {
    head: {
      title: 'ReelVibe - Free Archive Video Streaming',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#9333ea' },
        // Core SEO
        { name: 'description', content: 'Stream thousands of free movies, documentaries, and videos from Internet Archive. No sign-up required.' },
        { name: 'keywords', content: 'free videos, archive.org, movies, documentaries, streaming, public domain' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'ReelVibe' },
        { property: 'og:title', content: 'ReelVibe - Free Archive Video Streaming' },
        { property: 'og:description', content: 'Stream thousands of free movies, documentaries, and videos from Internet Archive.' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: 'https://reelvibe.eu.cc' },
        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@reelvibe' },
        { name: 'twitter:title', content: 'ReelVibe - Free Archive Video Streaming' },
        { name: 'twitter:description', content: 'Stream thousands of free movies, documentaries, and videos from Internet Archive.' },
        { name: 'twitter:image', content: '/og-image.png' },
        // Robots
        { name: 'robots', content: 'index, follow' },
        // Canonical
        { name: 'canonical', content: 'https://reelvibe.eu.cc' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://archive.org' },
        { rel: 'dns-prefetch', href: 'https://archive.org' }
      ]
    }
  },
  // Route rules for caching
  routeRules: {
    '/api/**': { cors: true },
    '/sitemap.xml': {
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' }
    },
    '/robots.txt': {
      headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400' }
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }
  }
})