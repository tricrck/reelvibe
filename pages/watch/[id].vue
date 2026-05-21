<template>
  <div class="max-w-7xl mx-auto animate-rise">

    <!-- LOADING -->
    <div v-if="pending" class="space-y-6">
      <div class="aspect-video bg-gothic-shadow rounded-2xl animate-pulse border border-gothic-stone/30" />
      <div class="space-y-3">
        <div class="h-7 bg-gothic-shadow rounded-lg w-2/3 animate-pulse" />
        <div class="h-4 bg-gothic-shadow rounded w-1/3 animate-pulse" />
      </div>
    </div>

    <!-- NOT FOUND -->
    <div v-else-if="!video" class="text-center py-28">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gothic-shadow border border-gothic-stone/40 flex items-center justify-center">
        <Film class="w-9 h-9 text-gothic-stone" />
      </div>
      <h1 class="font-gothic text-2xl tracking-widest text-gothic-fog">Video not found</h1>
      <p class="text-gothic-ash text-sm mt-2">This reel has vanished into the archive's depths.</p>
      <NuxtLink to="/" class="inline-flex items-center gap-2 mt-8 px-6 py-2.5 bg-primary-700 hover:bg-primary-600 text-white rounded-lg text-sm font-gothic tracking-widest shadow-crimson transition-all duration-200">
        <ArrowLeft class="w-4 h-4" /> Return
      </NuxtLink>
    </div>

    <!-- WATCH PAGE -->
    <div v-else>

      <!-- BACK LINK -->
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-gothic-ash hover:text-gothic-bone text-sm mb-6 transition-colors group">
        <ArrowLeft class="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span class="font-gothic tracking-widest text-xs uppercase">Back to Archive</span>
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- LEFT: PLAYER + META -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Player wrapper with crimson glow on hover -->
          <div class="relative group rounded-2xl overflow-hidden shadow-abyss border border-gothic-stone/40 hover:border-primary-800/50 transition-all duration-500 hover:shadow-crimson">
            <VideoPlayer :video="video" @timeupdate="onTimeUpdate" />
            <!-- top vignette -->
            <div class="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gothic-void/60 to-transparent pointer-events-none" />
          </div>

          <!-- TITLE + CREATOR ROW -->
          <div class="space-y-4">
            <h1 class="font-gothic text-2xl md:text-3xl tracking-wide text-gothic-ivory leading-tight">
              {{ video.title }}
            </h1>

            <div class="flex flex-wrap items-center justify-between gap-4">
              <!-- Creator -->
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gothic-shadow border border-gothic-stone/50 flex items-center justify-center text-primary-400 font-gothic text-sm shadow-crimson-sm">
                  {{ video.creator.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-gothic-bone text-sm font-semibold">{{ video.creator }}</p>
                  <p class="text-gothic-ash text-xs">{{ formatDate(video.created_at) }}</p>
                </div>
              </div>

              <!-- Stats pills -->
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5 px-3 py-1.5 bg-gothic-shadow border border-gothic-stone/40 rounded-lg text-xs text-gothic-ash">
                  <Eye class="w-3.5 h-3.5 text-primary-600" />
                  {{ formatViews(video.downloads) }}
                </div>
                <a
                  :href="`https://archive.org/details/${video.metadata?.identifier || video.id}`"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-gothic-shadow border border-gothic-stone/40 hover:border-primary-700/50 rounded-lg text-xs text-gothic-ash hover:text-primary-400 transition-all duration-200"
                >
                  <ExternalLink class="w-3.5 h-3.5" />
                  Archive.org
                </a>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-px bg-gradient-to-r from-transparent via-gothic-stone/50 to-transparent" />

            <!-- Description -->
            <div v-if="video.description && video.description !== 'No description provided.'" class="group">
              <button
                @click="descExpanded = !descExpanded"
                class="flex items-center gap-2 text-gothic-ash hover:text-gothic-bone text-xs font-gothic tracking-widest uppercase mb-3 transition-colors"
              >
                <ScrollText class="w-3.5 h-3.5" />
                Description
                <ChevronDown class="w-3 h-3 transition-transform duration-200" :class="descExpanded ? 'rotate-180' : ''" />
              </button>
              <div
                class="overflow-hidden transition-all duration-300 text-gothic-fog text-sm leading-relaxed"
                :class="descExpanded ? 'max-h-96' : 'max-h-16'"
              >
                <p class="whitespace-pre-wrap">{{ video.description }}</p>
              </div>
            </div>

            <!-- Metadata tags -->
            <div v-if="metaTags.length > 0" class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in metaTags"
                :key="tag"
                class="px-2.5 py-1 bg-gothic-shadow border border-gothic-stone/30 rounded-md text-[11px] text-gothic-ash font-gothic tracking-wide"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT: SIDEBAR -->
        <div class="space-y-5">

          <!-- About card -->
          <div class="bg-gothic-shadow border border-gothic-stone/40 rounded-2xl p-5 space-y-3">
            <h3 class="font-gothic text-xs tracking-widest uppercase text-gothic-ash flex items-center gap-2">
              <Info class="w-3.5 h-3.5 text-primary-700" />
              Details
            </h3>
            <div class="divide-y divide-gothic-stone/20">
              <div class="flex justify-between py-2.5 text-sm">
                <span class="text-gothic-ash">Uploaded</span>
                <span class="text-gothic-bone">{{ formatDate(video.created_at) }}</span>
              </div>
              <div class="flex justify-between py-2.5 text-sm">
                <span class="text-gothic-ash">Downloads</span>
                <span class="text-gothic-bone">{{ video.downloads.toLocaleString() }}</span>
              </div>
              <div v-if="video.metadata?.language" class="flex justify-between py-2.5 text-sm">
                <span class="text-gothic-ash">Language</span>
                <span class="text-gothic-bone capitalize">{{ video.metadata.language }}</span>
              </div>
              <div v-if="video.metadata?.date" class="flex justify-between py-2.5 text-sm">
                <span class="text-gothic-ash">Year</span>
                <span class="text-gothic-bone">{{ video.metadata.date }}</span>
              </div>
              <div v-if="video.metadata?.collection" class="flex justify-between py-2.5 text-sm">
                <span class="text-gothic-ash">Collection</span>
                <span class="text-gothic-bone text-right max-w-[55%] truncate">{{ video.metadata.collection }}</span>
              </div>
            </div>
          </div>

          <!-- Related videos — 2-col portrait grid -->
          <div v-if="relatedVideos.length > 0" class="space-y-3">
            <h3 class="font-gothic text-xs tracking-widest uppercase text-gothic-ash flex items-center gap-2 px-1">
              <Clapperboard class="w-3.5 h-3.5 text-primary-700" />
              Up Next
            </h3>

            <div class="grid grid-cols-2 gap-2">
              <NuxtLink
                v-for="rel in relatedVideos"
                :key="rel.id"
                :to="`/watch/${rel.id}`"
                class="group relative block"
              >
                <div class="relative aspect-[9/16] rounded-xl overflow-hidden bg-gothic-shadow border border-gothic-stone/30 group-hover:border-primary-700/60 transition-all duration-300 group-hover:shadow-crimson-sm">
                  <img
                    v-if="rel.thumb_url"
                    :src="rel.thumb_url"
                    :alt="rel.title"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Film class="w-6 h-6 text-gothic-stone" />
                  </div>

                  <!-- gradient + play -->
                  <div class="absolute inset-0 bg-gradient-to-t from-gothic-void via-gothic-void/20 to-transparent" />
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div class="w-10 h-10 rounded-full bg-primary-700/80 backdrop-blur-sm flex items-center justify-center shadow-crimson">
                      <Play class="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  <!-- title overlay -->
                  <div class="absolute bottom-0 left-0 right-0 p-2">
                    <p class="text-gothic-bone text-[11px] font-semibold leading-tight line-clamp-2">{{ rel.title }}</p>
                    <div class="flex items-center gap-1 mt-1 text-gothic-ash/70 text-[10px]">
                      <Download class="w-2.5 h-2.5" />
                      {{ formatViews(rel.downloads) }}
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Film, ArrowLeft, Eye, ExternalLink, ScrollText,
  ChevronDown, Info, Clapperboard, Play, Download
} from 'lucide-vue-next'
import type { Video } from '~/composables/useVideos'

const route = useRoute()
const videoId = computed(() => route.params.id as string)
const { fetchVideo, fetchVideos } = useVideos()

const video = ref<Video | null>(null)
const relatedVideos = ref<Video[]>([])
const pending = ref(false)
const descExpanded = ref(false)

// ── SEO ────────────────────────────────────────────────────────────────────
useHead(() => ({
  title: video.value ? `${video.value.title} — ReelVibe` : 'Watch — ReelVibe',
  meta: [
    { name: 'description', content: video.value?.description && video.value.description !== 'No description provided.'
        ? video.value.description.slice(0, 155)
        : `Watch ${video.value?.title ?? 'this video'} free on ReelVibe, powered by the Internet Archive.` },
    { property: 'og:title', content: video.value ? `${video.value.title} — ReelVibe` : 'ReelVibe' },
    { property: 'og:type', content: 'video.other' },
    { property: 'og:image', content: video.value?.thumb_url ?? '' },
    { property: 'og:url', content: `https://reelvibe.com/watch/${videoId.value}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: video.value?.thumb_url ?? '' },
  ],
  link: [
    { rel: 'canonical', href: `https://reelvibe.com/watch/${videoId.value}` },
  ],
}))

useHead(() => ({
  script: video.value ? [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.value!.title,
        description: video.value!.description !== 'No description provided.' ? video.value!.description : undefined,
        thumbnailUrl: video.value!.thumb_url,
        uploadDate: video.value!.created_at,
        contentUrl: video.value!.stream_url,
        embedUrl: `https://reelvibe.com/watch/${videoId.value}`,
        author: { '@type': 'Person', name: video.value!.creator },
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/WatchAction',
          userInteractionCount: video.value!.downloads,
        },
      }),
    },
  ] : [],
}))

// ── Helpers ────────────────────────────────────────────────────────────────
const formatViews = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const metaTags = computed(() => {
  if (!video.value?.metadata) return []
  const m = video.value.metadata
  return ['language', 'collection', 'subject']
    .flatMap(k => m[k] ? (Array.isArray(m[k]) ? m[k] : [String(m[k])]) : [])
    .slice(0, 8)
})

const onTimeUpdate = (_current: number, _duration: number) => {}

// ── Data ───────────────────────────────────────────────────────────────────
const loadVideo = async () => {
  pending.value = true
  descExpanded.value = false
  try {
    const result = await fetchVideo(videoId.value)
    video.value = result.data
    if (result.data) {
      const related = await fetchVideos(1, '', 'downloads')
      if (related.data) {
        relatedVideos.value = related.data
          .filter((v: Video) => v.id !== videoId.value)
          .slice(0, 8)
      }
    }
  } catch (e) {
    console.error('Failed to load video:', e)
  } finally {
    pending.value = false
  }
}

onMounted(loadVideo)
watch(videoId, loadVideo)
</script>