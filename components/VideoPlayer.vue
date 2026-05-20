<template>
  <div class="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" :class="{ 'aspect-video': !fullscreen }">
    <video
      v-if="video?.stream_url"
      ref="videoRef"
      :src="video.stream_url"
      :poster="video.thumb_url"
      controls
      preload="metadata"
      class="w-full h-full object-contain"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
    />

    <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-900">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="7" ry="7"/>
          </svg>
        </div>
        <p class="text-gray-400">Loading video...</p>
      </div>
    </div>

    <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-gray-900">
      <div class="text-center p-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-200">Video unavailable</h3>
        <p class="text-gray-400 mt-2">This video cannot be played at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '~/composables/useVideos'

const props = defineProps<{
  video: Video | null
  autoplay?: boolean
  fullscreen?: boolean
}>()

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: [currentTime: number, duration: number]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const error = ref(false)

const onPlay = () => emit('play')
const onPause = () => emit('pause')
const onEnded = () => emit('ended')
const onTimeUpdate = () => {
  if (videoRef.value) {
    emit('timeupdate', videoRef.value.currentTime, videoRef.value.duration)
  }
}

watch(() => props.video, () => {
  error.value = false
})
</script>