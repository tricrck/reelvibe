<template>
  <div class="space-y-6">
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="aspect-video bg-gray-800 rounded-xl" />
        <div class="mt-4 space-y-2">
          <div class="h-4 bg-gray-800 rounded w-3/4" />
          <div class="h-3 bg-gray-800 rounded w-1/2" />
        </div>
      </div>
    </div>

    <div v-else-if="videos.length === 0" class="text-center py-16">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-400">No videos found</h3>
      <p class="text-gray-500 mt-2">Try adjusting your search or check back later</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <VideoCard
        v-for="(video, index) in videos"
        :key="video.id"
        :video="video"
        :show-description="showDescriptions"
        class="animate-fadeIn"
        :style="{ animationDelay: `${index * 50}ms` }"
      />
    </div>

    <div v-if="totalPages > 1" class="flex justify-center gap-2 pt-8">
      <button
        v-for="page in displayedPages"
        :key="page"
        @click="$emit('page-change', page)"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          page === currentPage
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '~/composables/useVideos'

const props = withDefaults(defineProps<{
  videos: Video[]
  loading?: boolean
  currentPage?: number
  totalPages?: number
  showDescriptions?: boolean
}>(), {
  loading: false,
  currentPage: 1,
  totalPages: 1,
  showDescriptions: false
})

defineEmits<{
  'page-change': [page: number]
}>()

const displayedPages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push(-1)
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push(-1)
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    }
  }

  return pages.filter(p => p > 0)
})
</script>