<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNavigation } from '@/apis/useNavigation.js'
import NavHeader from '@/components/common/NavHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import FilterSection from '@/components/common/FilterSection.vue'
import DirectoryItem from '@/components/common/DirectoryItem.vue'
import {
  Bot,
  Activity,
  Database,
  Wrench,
  Home,
  Folder
} from 'lucide-vue-next'

// Category icon mapping
const categoryIcons = {
  'ai-services': Bot,
  'dev-ops': Activity,
  'data-storage': Database,
  'tools': Wrench,
  'personal': Home
}

// --- Navigation Data ---
const { categories, title, loading, error, fetchCategories } = useNavigation()

// --- State ---
const searchQuery = ref('')
const selectedTag = ref('')
const isHydrated = ref(false)

// --- Computed ---
const allTags = computed(() => {
  return categories.value.map(cat => ({
    id: cat.id,
    name: cat.name
  }))
})

const filteredCategories = computed(() => {
  let result = categories.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.map(cat => ({
      ...cat,
      sites: cat.sites.filter(site =>
        site.name.toLowerCase().includes(query) ||
        (site.description && site.description.toLowerCase().includes(query)) ||
        site.url.toLowerCase().includes(query)
      )
    })).filter(cat => cat.sites.length > 0)
  }

  // Filter by selected tag
  if (selectedTag.value) {
    result = result.filter(cat => cat.id === selectedTag.value)
  }

  return result
})

const totalSites = computed(() => {
  return categories.value.reduce((sum, cat) => sum + (cat.sites?.length || 0), 0)
})

// --- Handlers ---
const handleSearch = (query) => {
  searchQuery.value = query
}

const handleFilterSelect = (tagId) => {
  selectedTag.value = tagId
}

const handleFilterReset = () => {
  selectedTag.value = ''
  searchQuery.value = ''
}

// --- Lifecycle ---
onMounted(() => {
  fetchCategories()
  isHydrated.value = true

  // Check saved theme preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Radial Glow Decorations -->
    <div class="radial-glow -top-[300px] -right-[200px] hidden lg:block"></div>
    <div class="radial-glow -bottom-[200px] -left-[200px] hidden lg:block"></div>

    <!-- Header -->
    <NavHeader :title="title || '导航'" />

    <!-- Main Content -->
    <main class="flex-1 relative z-10">
      <div class="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <!-- Hero Section -->
        <div class="text-center mb-20">
          <!-- Section Label -->
          <div class="section-label mb-8 inline-flex">
            <span class="section-label-dot"></span>
            <span class="section-label-text">云飘工具箱</span>
          </div>

          <!-- Hero Headline -->
          <h1 class="text-4xl md:text-5xl lg:text-[3.5rem] leading-tight mb-6" style="color: var(--foreground)">
            <span>快速访问你的</span>
            <span class="gradient-text">常用工具</span>
          </h1>

          <p class="text-lg md:text-xl max-w-2xl mx-auto mb-12" style="color: var(--muted-foreground)">
            AI 服务、监控运维、存储数据、实用工具、个人空间
          </p>

          <!-- Search Bar -->
          <SearchBar
            v-model="searchQuery"
            placeholder="搜索站点名称、描述..."
            @search="handleSearch"
            @clear="handleFilterReset"
          />

          <!-- Stats -->
          <div class="mt-8 flex items-center justify-center gap-8 text-sm" style="color: var(--muted-foreground)">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" style="background: var(--accent)"></span>
              <span>{{ categories.length }} 个分类</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" style="background: var(--accent-secondary)"></span>
              <span>{{ totalSites }} 个站点</span>
            </div>
          </div>
        </div>

        <!-- Filter Section -->
        <FilterSection
          v-if="isHydrated"
          :tags="allTags"
          :selected-tag="selectedTag"
          @select="handleFilterSelect"
          @reset="handleFilterReset"
        />

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="i in 6"
            :key="i"
            class="directory-item"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl shimmer" style="background: var(--muted)"></div>
              <div class="h-5 rounded w-1/3 shimmer" style="background: var(--muted)"></div>
            </div>
            <div class="h-4 rounded w-full mb-2 shimmer" style="background: var(--muted)"></div>
            <div class="h-4 rounded w-2/3 shimmer" style="background: var(--muted)"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16 rounded-2xl" style="background: var(--muted)">
          <p class="text-red-500 mb-4">{{ error }}</p>
          <button @click="fetchCategories" class="btn btn-primary">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else class="space-y-12 stagger-children">
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="relative animate-fade-in-up"
            style="opacity: 0"
          >
            <!-- Category Header -->
            <div class="category-header">
              <div class="flex items-center gap-4">
                <div class="directory-icon">
                  <component
                    :is="categoryIcons[category.id]"
                    class="w-5 h-5"
                    v-if="categoryIcons[category.id]"
                  />
                  <Folder class="w-5 h-5" v-else />
                </div>
                <span class="category-badge">{{ category.name }}</span>
                <span class="text-sm" style="color: var(--muted-foreground)">
                  {{ category.sites?.length || 0 }} 个站点
                </span>
              </div>
              <div class="category-divider"></div>
            </div>

            <!-- Sites Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <DirectoryItem
                v-for="site in category.sites"
                :key="site.id"
                :site="site"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && !error && filteredCategories.length === 0"
          class="text-center py-20 rounded-2xl"
          style="background: var(--muted)"
        >
          <p class="mb-4" style="color: var(--muted-foreground)">
            没有找到 "{{ searchQuery }}" 相关的站点
          </p>
          <button
            class="btn btn-secondary"
            @click="handleFilterReset"
          >
            重置筛选条件
          </button>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="py-10 border-t relative z-10" style="background: var(--card); border-color: var(--border)">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="directory-icon w-8 h-8">
              <span class="text-sm">🧭</span>
            </div>
            <span class="font-medium" style="color: var(--foreground)">{{ title || '导航' }}</span>
          </div>
          <div class="text-sm" style="color: var(--muted-foreground)">
            © {{ new Date().getFullYear() }} 云飘导航. Built with Vue 3 + TailwindCSS.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer {
  background: linear-gradient(90deg,
    var(--muted) 25%,
    rgba(0, 82, 255, 0.05) 37%,
    var(--muted) 63%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}
</style>
