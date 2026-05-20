<template>
  <div class="min-h-screen bg-gray-950">
    <header class="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ReelVibe</span>
          </NuxtLink>

          <div class="hidden md:flex items-center gap-6">
            <NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors">Browse</NuxtLink>
            <NuxtLink to="/?sort=popular" class="text-gray-400 hover:text-white transition-colors">Popular</NuxtLink>
            <NuxtLink to="/?sort=recent" class="text-gray-400 hover:text-white transition-colors">Recent</NuxtLink>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search videos..."
                class="w-48 md:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="border-t border-gray-800 py-8 mt-16">
      <div class="container mx-auto px-4 text-center text-gray-500">
        <p>Powered by <a href="https://archive.org" target="_blank" class="text-purple-400 hover:text-purple-300">Internet Archive</a></p>
        <p class="mt-2 text-sm">Stream free videos legally</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const searchQuery = ref('')
const router = useRouter()

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/?search=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>