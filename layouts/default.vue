<template>
  <div class="min-h-screen bg-gothic-void text-gothic-bone font-body">

    <!-- TOP HEADER -->
    <header class="sticky top-0 z-50 bg-gothic-void/85 backdrop-blur-xl border-b border-gothic-stone/60">
      <nav class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group shrink-0">
            <div class="relative">
              <img
                src="~/assets/logo.png"
                alt="ReelVibe Logo"
                class="w-10 h-10 object-contain rounded-xl shadow-lg shadow-primary-800/40 group-hover:shadow-primary-600/60 transition-all duration-300"
              />
              <div class="absolute inset-0 rounded-xl ring-1 ring-primary-700/30 group-hover:ring-primary-500/50 transition-all duration-300" />
            </div>
            <span class="font-gothic text-xl tracking-widest text-gothic-ivory group-hover:text-primary-400 transition-colors duration-300">
              ReelVibe
            </span>
          </NuxtLink>

          <!-- Desktop Nav Links -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-gothic-ash hover:text-gothic-bone hover:bg-gothic-shadow border border-transparent hover:border-gothic-stone/50 transition-all duration-200 text-sm tracking-wide"
              active-class="text-primary-400 bg-gothic-shadow border-gothic-stone/50"
            >
              <component :is="link.icon" class="w-4 h-4 shrink-0" />
              <span>{{ link.label }}</span>
            </NuxtLink>
          </div>

          <!-- Search Bar -->
          <div class="relative flex-1 max-w-xs md:max-w-sm">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gothic-ash pointer-events-none" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search the archives…"
              class="w-full pl-9 pr-4 py-2 bg-gothic-shadow border border-gothic-stone/60 rounded-lg text-sm text-gothic-bone placeholder-gothic-ash/60 focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-all duration-200"
              @keyup.enter="handleSearch"
            />
          </div>

        </div>
      </nav>
    </header>

    <!-- PAGE CONTENT -->
    <main class="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <slot />
    </main>

    <!-- FOOTER (desktop) -->
    <footer class="hidden md:block border-t border-gothic-stone/40 py-8 mt-16">
      <div class="container mx-auto px-4 text-center text-gothic-ash text-sm">
        <div class="flex items-center justify-center gap-2 mb-1">
          <Skull class="w-3.5 h-3.5 text-primary-700" />
          <span>Powered by <a href="https://archive.org" target="_blank" class="text-primary-500 hover:text-primary-400 transition-colors">Internet Archive</a></span>
          <Skull class="w-3.5 h-3.5 text-primary-700" />
        </div>
        <p class="text-gothic-ash/50 text-xs tracking-widest uppercase mt-1">Stream free videos legally</p>
      </div>
    </footer>

    <!-- MOBILE BOTTOM NAV -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gothic-void/95 backdrop-blur-xl border-t border-gothic-stone/60">
      <div class="flex items-stretch">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-gothic-ash transition-all duration-200 relative group"
          active-class="text-primary-400"
        >
          <!-- active indicator -->
          <span class="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-px bg-primary-600 opacity-0 group-[.router-link-active]:opacity-100 transition-opacity duration-200" />
          <component :is="link.icon" class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span class="text-[10px] tracking-widest uppercase font-gothic">{{ link.label }}</span>
        </NuxtLink>
      </div>
    </nav>

  </div>
</template>

<script setup lang="ts">
import { Search, Compass, Flame, Clock, Skull } from 'lucide-vue-next'

const searchQuery = ref('')
const router = useRouter()

const navLinks = [
  { to: '/',             label: 'Browse',  icon: Compass },
  { to: '/?sort=popular', label: 'Popular', icon: Flame   },
  { to: '/?sort=recent',  label: 'Recent',  icon: Clock   },
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/?search=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>