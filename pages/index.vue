<template>
  <div>

    <!-- SORT TABS -->
    <div class="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
      <button
        v-for="tab in sortTabs"
        :key="tab.value"
        @click="setSortOption(tab.value)"
        class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-gothic tracking-wide whitespace-nowrap border transition-all duration-200 shrink-0"
        :class="sortOption === tab.value
          ? 'bg-gothic-shadow border-primary-700 text-primary-400 shadow-crimson-sm'
          : 'bg-transparent border-gothic-stone/50 text-gothic-ash hover:text-gothic-bone hover:border-gothic-stone'"
      >
        <component :is="tab.icon" class="w-3.5 h-3.5" />
        {{ tab.label }}
      </button>

      <div class="ml-auto shrink-0 text-gothic-ash/60 text-xs tracking-widest uppercase font-gothic whitespace-nowrap">
        <span v-if="total > 0">{{ total.toLocaleString() }} videos</span>
        <span v-else-if="pending">Loading…</span>
      </div>
    </div>

    <!-- PAGE TITLE -->
    <div class="mb-6">
      <h1 class="font-gothic text-2xl tracking-widest text-gothic-ivory">
        <span v-if="searchQuery">
          Results for
          <span class="text-primary-400">"{{ searchQuery }}"</span>
        </span>
        <span v-else>{{ currentTab?.label }}</span>
      </h1>
    </div>

    <!-- VIDEO GRID — TikTok portrait ratio -->
    <div v-if="pending && videos.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      <div
        v-for="n in 18"
        :key="n"
        class="aspect-[9/16] bg-gothic-shadow rounded-xl animate-pulse border border-gothic-stone/30"
      />
    </div>

    <div v-else-if="videos.length === 0 && !pending" class="text-center py-24 text-gothic-ash">
      <Film class="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p class="font-gothic tracking-widest text-lg">No videos found</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      <NuxtLink
        v-for="video in videos"
        :key="video.id"
        :to="`/watch/${video.id}`"
        class="group relative block"
      >
        <!-- Portrait card -->
        <div class="relative aspect-[9/16] rounded-xl overflow-hidden bg-gothic-shadow border border-gothic-stone/30 group-hover:border-primary-700/60 transition-all duration-300 group-hover:shadow-crimson-sm">

          <!-- Thumbnail -->
          <img
            v-if="video.thumb_url"
            :src="video.thumb_url"
            :alt="video.title"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gothic-shadow">
            <Film class="w-8 h-8 text-gothic-stone" />
          </div>

          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-gothic-void via-gothic-void/20 to-transparent" />

          <!-- Play button -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="w-12 h-12 rounded-full bg-primary-700/80 backdrop-blur-sm flex items-center justify-center shadow-crimson">
              <Play class="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          <!-- Bottom info -->
          <div class="absolute bottom-0 left-0 right-0 p-2.5">
            <p class="text-gothic-bone text-xs font-semibold leading-tight line-clamp-2">{{ video.title }}</p>
            <div class="flex items-center justify-between mt-1.5">
              <span class="text-gothic-ash/70 text-[10px] truncate">{{ video.creator }}</span>
              <div class="flex items-center gap-0.5 text-gothic-ash/60 text-[10px] shrink-0">
                <Download class="w-2.5 h-2.5" />
                {{ formatCount(video.downloads) }}
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- PAGINATION -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
      <button
        @click="handlePageChange(page - 1)"
        :disabled="page <= 1"
        class="p-2 rounded-lg border border-gothic-stone/50 text-gothic-ash hover:text-gothic-bone hover:border-gothic-stone disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <div class="flex items-center gap-1">
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="handlePageChange(p)"
          class="w-8 h-8 rounded-lg text-xs font-gothic border transition-all duration-200"
          :class="p === page
            ? 'bg-primary-700 border-primary-600 text-white shadow-crimson-sm'
            : 'border-gothic-stone/50 text-gothic-ash hover:text-gothic-bone hover:border-gothic-stone'"
        >
          {{ p }}
        </button>
      </div>

      <button
        @click="handlePageChange(page + 1)"
        :disabled="page >= totalPages"
        class="p-2 rounded-lg border border-gothic-stone/50 text-gothic-ash hover:text-gothic-bone hover:border-gothic-stone disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- ABOUT SECTION -->
    <section v-if="!searchQuery" class="mt-16 p-8 rounded-2xl bg-gothic-shadow border border-gothic-stone/40 relative overflow-hidden">
      <div class="absolute inset-0 bg-blood-fade opacity-20 pointer-events-none" />
      <div class="relative max-w-2xl mx-auto text-center">
        <Skull class="w-6 h-6 text-primary-700 mx-auto mb-4" />
        <h2 class="font-gothic text-xl tracking-widest text-gothic-ivory mb-3">About ReelVibe</h2>
        <p class="text-gothic-ash text-sm leading-relaxed">
          A modern streaming platform powered by the Internet Archive.
          Browse thousands of free movies, documentaries, music videos, and more —
          all legally available and streamed directly from archive.org.
        </p>
        <div class="flex justify-center gap-10 mt-8">
          <div class="text-center">
            <div class="font-gothic text-2xl text-primary-400">{{ total.toLocaleString() }}</div>
            <div class="text-xs text-gothic-ash/60 tracking-widest uppercase mt-0.5">Videos</div>
          </div>
          <div class="text-center">
            <div class="font-gothic text-2xl text-gothic-fog">100%</div>
            <div class="text-xs text-gothic-ash/60 tracking-widest uppercase mt-0.5">Free</div>
          </div>
          <div class="text-center">
            <div class="font-gothic text-2xl text-gothic-bone">Legal</div>
            <div class="text-xs text-gothic-ash/60 tracking-widest uppercase mt-0.5">Archive</div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { Film, Play, Download, ChevronLeft, ChevronRight, Compass, Flame, Clock, Skull } from 'lucide-vue-next'

// ── SEO ────────────────────────────────────────────────────────────────────
useHead({
  title: 'ReelVibe - Free Archive Video Streaming',
  meta: [
    { name: 'description', content: 'Browse popular videos from Internet Archive. Stream free movies, documentaries, music videos, and more.' },
    { property: 'og:title', content: 'ReelVibe - Free Archive Video Streaming' },
    { property: 'og:description', content: 'Browse popular videos from Internet Archive. Stream free movies, documentaries, and more.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://reelvibe.com' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'ReelVibe - Free Archive Video Streaming' },
    { name: 'twitter:description', content: 'Browse popular videos from Internet Archive. Stream free, legal movies, documentaries, and more.' },
    { name: 'robots', content: 'index, follow' },
  ],
  link: [
    { rel: 'canonical', href: 'https://reelvibe.com' },
  ],
})

// ── Structured Data (JSON-LD) ──────────────────────────────────────────────
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ReelVibe',
        url: 'https://reelvibe.com',
        description: 'Free archive video streaming platform powered by the Internet Archive.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://reelvibe.com/?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }),
    },
  ],
})

// ── State ──────────────────────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()

const searchQuery = computed(() => route.query.search as string || '')
const sortOption = ref((route.query.sort as string) || 'downloads')

const page = ref(1)
const videos = ref<any[]>([])
const total = ref(0)
const pending = ref(false)

const limit = 20
const totalPages = computed(() => Math.ceil(total.value / limit))

const sortTabs = [
  { value: 'downloads', label: 'Popular',  icon: Flame   },
  { value: 'created_at', label: 'Recent',  icon: Clock   },
  { value: 'title',      label: 'A–Z',     icon: Compass },
]

const currentTab = computed(() => sortTabs.find(t => t.value === sortOption.value))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = page.value
  const delta = 2
  const range: number[] = []
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }
  return range
})

const formatCount = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n?.toString() ?? '0'
}

const setSortOption = (val: string) => {
  sortOption.value = val
  router.replace({ query: { ...route.query, sort: val } })
}

// ── Data ───────────────────────────────────────────────────────────────────
const { fetchVideos } = useVideos()

const loadVideos = async () => {
  pending.value = true
  try {
    const result = await fetchVideos(page.value, searchQuery.value, sortOption.value)
    if (result.data) {
      videos.value = result.data
      total.value = result.total || 0
    }
  } catch (e) {
    console.error('Failed to load videos:', e)
  } finally {
    pending.value = false
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  loadVideos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch([searchQuery, sortOption], () => {
  page.value = 1
  loadVideos()
})

onMounted(loadVideos)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>