<template>
  <div class="max-w-7xl mx-auto">
    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="aspect-video bg-gray-800 rounded-xl" />
      <div class="space-y-4">
        <div class="h-8 bg-gray-800 rounded w-3/4" />
        <div class="h-4 bg-gray-800 rounded w-1/2" />
      </div>
    </div>

    <div v-else-if="!video" class="text-center py-20">
      <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-400">Video not found</h1>
      <p class="text-gray-500 mt-2">The video you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/" class="btn-primary inline-block mt-6">Browse Videos</NuxtLink>
    </div>

    <div v-else>
      <div class="mb-6">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to videos
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <VideoPlayer :video="video" @timeupdate="onTimeUpdate" />

          <div class="space-y-4">
            <h1 class="text-2xl md:text-3xl font-bold text-white leading-tight">
              {{ video.title }}
            </h1>

            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
                  {{ video.creator.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium text-gray-300">{{ video.creator }}</span>
              </div>
              <span>•</span>
              <span>{{ formatViews(video.downloads) }} views</span>
              <span>•</span>
              <span>{{ formatDate(video.created_at) }}</span>
            </div>

            <div v-if="video.description" class="p-4 bg-gray-900 rounded-xl border border-gray-800">
              <h3 class="text-sm font-semibold text-gray-400 mb-2">Description</h3>
              <p class="text-gray-300 whitespace-pre-wrap">{{ video.description }}</p>
            </div>

            <div v-if="video.metadata" class="flex flex-wrap gap-2">
              <span v-for="(value, key) in getMetadataTags(video.metadata)" :key="key"
                    class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                {{ key }}: {{ value }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-white mb-4">About this video</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Upload date</span>
                <span class="text-gray-300">{{ formatDate(video.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Downloads</span>
                <span class="text-gray-300">{{ video.downloads.toLocaleString() }}</span>
              </div>
              <div v-if="video.metadata?.language" class="flex justify-between">
                <span class="text-gray-400">Language</span>
                <span class="text-gray-300">{{ video.metadata.language }}</span>
              </div>
              <div v-if="video.metadata?.date" class="flex justify-between">
                <span class="text-gray-400">Year</span>
                <span class="text-gray-300">{{ video.metadata.date }}</span>
              </div>
            </div>
          </div>

          <div v-if="relatedVideos.length > 0" class="card p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Related Videos</h3>
            <div class="space-y-4">
              <VideoCard
                v-for="relatedVideo in relatedVideos"
                :key="relatedVideo.id"
                :video="relatedVideo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '~/composables/useVideos'

const route = useRoute()
const videoId = computed(() => route.params.id as string)

const { fetchVideo, fetchVideos } = useVideos()

const video = ref<Video | null>(null)
const relatedVideos = ref<Video[]>([])
const pending = ref(false)

const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return String(views)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getMetadataTags = (metadata: any): Record<string, string> => {
  const tags: Record<string, string> = {}
  const relevantKeys = ['language', 'year', 'collection', 'subject']
  relevantKeys.forEach(key => {
    if (metadata[key]) {
      tags[key] = Array.isArray(metadata[key]) ? metadata[key].join(', ') : String(metadata[key])
    }
  })
  return tags
}

const onTimeUpdate = (currentTime: number, duration: number) => {
  // Could be used for analytics or progress tracking
}

const loadVideo = async () => {
  pending.value = true
  try {
    const result = await fetchVideo(videoId.value)
    video.value = result.data

    // Load related videos
    if (result.data) {
      const related = await fetchVideos(1, '', 'downloads')
      if (related.data) {
        relatedVideos.value = related.data
          .filter((v: Video) => v.id !== videoId.value)
          .slice(0, 5)
      }
    }
  } catch (error) {
    console.error('Failed to load video:', error)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadVideo()
})

watch(videoId, () => {
  loadVideo()
})
</script>