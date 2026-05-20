<template>
  <div class="group">
    <NuxtLink :to="`/watch/${video.id}`" class="block">
      <div class="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-all duration-300">
        <img
          :src="video.thumb_url"
          :alt="video.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="w-16 h-16 rounded-full bg-purple-500/90 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
        </div>
        <div class="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs font-medium text-gray-200">
          {{ formatDuration(video.metadata?.duration) }}
        </div>
      </div>
    </NuxtLink>

    <div class="mt-4 space-y-2">
      <NuxtLink :to="`/watch/${video.id}`">
        <h3 class="font-semibold text-gray-100 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {{ video.title }}
        </h3>
      </NuxtLink>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>{{ formatViews(video.downloads) }} views</span>
          <span>•</span>
          <span>{{ video.creator }}</span>
        </div>
      </div>

      <p v-if="showDescription && video.description" class="text-sm text-gray-400 line-clamp-2">
        {{ video.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '~/composables/useVideos'

const props = withDefaults(defineProps<{
  video: Video
  showDescription?: boolean
}>(), {
  showDescription: false
})

const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return String(views)
}

const formatDuration = (duration?: string | number): string => {
  if (!duration) return ''
  const num = typeof duration === 'string' ? parseFloat(duration) : duration
  const minutes = Math.floor(num / 60)
  const seconds = Math.floor(num % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>