<script setup>
import { ref } from 'vue'
import { Sun, Moon, Github, Menu, X } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: '导航站'
  }
})

const isDark = ref(false)
const showMobileMenu = ref(false)

// Check initial dark mode
if (typeof window !== 'undefined') {
  isDark.value = document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
}

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <header class="sticky top-4 z-40 mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl">
    <div class="navbar px-6 py-3">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="directory-icon w-9 h-9">
            <span class="text-lg">🧭</span>
          </div>
          <h1 class="text-lg font-semibold" style="color: var(--foreground)">
            {{ title }}
          </h1>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden sm:flex items-center gap-3">
          <!-- Theme Toggle -->
          <button
            @click="toggleDarkMode"
            class="directory-icon-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Sun v-if="isDark" class="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <Moon v-else class="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          <!-- GitHub Link -->
          <a
            href="https://github.com/maodeyu180/mao_nav"
            target="_blank"
            rel="noopener noreferrer"
            class="directory-icon-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Github class="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="sm:hidden directory-icon-sm"
        >
          <Menu v-if="!showMobileMenu" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showMobileMenu" class="sm:hidden mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div class="flex items-center justify-center gap-4">
            <button
              @click="toggleDarkMode"
              class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Sun v-if="isDark" class="w-4 h-4" />
              <Moon v-else class="w-4 h-4" />
              <span class="text-sm">{{ isDark ? '浅色模式' : '深色模式' }}</span>
            </button>
            <a
              href="https://github.com/maodeyu180/mao_nav"
              target="_blank"
              class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Github class="w-4 h-4" />
              <span class="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>
