<template>
  <div>
    <section class="mb-12">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">
            <span v-if="searchQuery" class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Search: "{{ searchQuery }}"
            </span>
            <span v-else class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {{ sortLabel }}
            </span>
          </h1>
          <p class="text-gray-400 mt-2">
            <span v-if="total > 0">{{ total }} videos available</span>
            <span v-else>Loading...</span>
          </p>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-400">Sort by:</label>
          <select
            v-model="sortOption"
            class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
          >
            <option value="downloads">Popular</option>
            <option value="created_at">Recent</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      <VideoGrid
        :videos="videos"
        :loading="pending"
        :current-page="page"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </section>

    <section v-if="!searchQuery && videos.length > 0" class="mt-16">
      <h2 class="text-2xl font-bold text-white mb-8">Featured Collections</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card p-6 group cursor-pointer" @click="navigateToSearch('music')">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">Music & Arts</h3>
          <p class="text-gray-400 text-sm mt-2">Concerts, performances, and artistic collections</p>
        </div>

        <div class="card p-6 group cursor-pointer" @click="navigateToSearch('documentary')">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Documentaries</h3>
          <p class="text-gray-400 text-sm mt-2">Educational and informational films</p>
        </div>

        <div class="card p-6 group cursor-pointer" @click="navigateToSearch('animation')">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
              <line x1="7" y1="2" x2="7" y2="22"/>
              <line x1="17" y1="2" x2="17" y2="22"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="2" y1="7" x2="7" y2="7"/>
              <line x1="2" y1="17" x2="7" y2="17"/>
              <line x1="17" y1="17" x2="22" y2="17"/>
              <line x1="17" y1="7" x2="22" y2="7"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">Animation</h3>
          <p class="text-gray-400 text-sm mt-2">Classic and modern animated works</p>
        </div>
      </div>
    </section>

    <section v-if="!searchQuery" class="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-2xl font-bold text-white mb-4">About ReelVibe</h2>
        <p class="text-gray-300 leading-relaxed">
          ReelVibe is a modern video streaming platform powered by the Internet Archive.
          Browse thousands of free movies, documentaries, music videos, and more — all legally available and
          streamed directly from archive.org.
        </p>
        <div class="flex justify-center gap-8 mt-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-400">{{ total.toLocaleString() }}</div>
            <div class="text-sm text-gray-400">Videos</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-pink-400">{{ (total * 0.1).toLocaleString() }}K+</div>
            <div class="text-sm text-gray-400">Creators</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-400">100%</div>
            <div class="text-sm text-gray-400">Free</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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

const sortLabel = computed(() => {
  switch (sortOption.value) {
    case 'downloads': return 'Popular Videos'
    case 'created_at': return 'Recently Added'
    case 'title': return 'Alphabetical'
    default: return 'All Videos'
  }
})

const { fetchVideos } = useVideos()

const loadVideos = async () => {
  pending.value = true
  try {
    const result = await fetchVideos(page.value, searchQuery.value, sortOption.value)
    if (result.data) {
      videos.value = result.data
      total.value = result.total || 0
    }
  } catch (error) {
    console.error('Failed to load videos:', error)
  } finally {
    pending.value = false
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  loadVideos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const navigateToSearch = (query: string) => {
  router.push(`/?search=${encodeURIComponent(query)}`)
}

watch([searchQuery, sortOption], () => {
  page.value = 1
  loadVideos()
})

onMounted(() => {
  loadVideos()
})
</script>