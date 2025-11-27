<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNavigation } from '@/apis/useNavigation.js'
import { 
  Search, 
  Lock, 
  LayoutGrid,
  ArrowUpDown,
  Github,
  Menu,
  X,
  ChevronRight
} from 'lucide-vue-next'

// --- Navigation Data ---
const { categories, title, loading, error, fetchCategories } = useNavigation()

// --- State ---
const searchQuery = ref('')
const showMobileMenu = ref(false)
const isScrolled = ref(false)

// --- Lock Screen Logic ---
const isLocked = ref(false)
const isUnlocked = ref(false)
const unlockPassword = ref('')
const unlocking = ref(false)
const unlockError = ref('')

const checkLockStatus = () => {
  const openLock = import.meta.env.VITE_OPEN_LOCK
  if (openLock && openLock.trim() !== '') {
    isLocked.value = true
    const savedUnlock = localStorage.getItem('nav_unlocked')
    if (savedUnlock === 'true') {
      isUnlocked.value = true
    }
  } else {
    isLocked.value = false
    isUnlocked.value = true
  }
}

const handleUnlock = async () => {
  unlocking.value = true
  unlockError.value = ''
  
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    if (!adminPassword) throw new Error('System Configuration Error: Key missing')
    
    if (unlockPassword.value === adminPassword) {
      isUnlocked.value = true
      localStorage.setItem('nav_unlocked', 'true')
      unlockPassword.value = ''
    } else {
      throw new Error('Access Denied: Invalid Credentials')
    }
  } catch (err) {
    unlockError.value = err.message
  } finally {
    unlocking.value = false
  }
}

// --- Scroll Handling ---
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// --- Emoji / Icon Fallback ---
const emojiIcons = ['🌟', '⭐', '✨', '💎', '🚀', '🔥', '🎯', '🎨', '🎪', '🎧', '💡', '🔮', '🧿', '🌈', '⚡']
const getFallbackEmoji = (id) => {
  let seed = 0
  const str = String(id)
  for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i)
  return emojiIcons[seed % emojiIcons.length]
}

const handleImageError = (e, id) => {
  e.target.style.display = 'none'
  if (e.target.parentNode.querySelector('.emoji-fallback')) return
  
  const span = document.createElement('span')
  span.className = 'emoji-fallback text-lg'
  span.textContent = getFallbackEmoji(id)
  e.target.parentNode.appendChild(span)
}

// --- Search Logic ---
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.map(cat => ({
    ...cat,
    sites: cat.sites.filter(site => 
      site.name.toLowerCase().includes(query) || 
      (site.description && site.description.toLowerCase().includes(query))
    )
  })).filter(cat => cat.sites.length > 0)
})

const handleSearchEnter = () => {
    if (!searchQuery.value) return
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`, '_blank')
}

// --- Lifecycle ---
onMounted(() => {
  checkLockStatus()
  fetchCategories()
  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-[#F8F9FC] text-slate-600 font-sans selection:bg-[#E0D4FF] selection:text-indigo-900">
    
    <!-- Atmosphere Background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
       <div class="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#C6B9FF]/20 rounded-full blur-[120px]"></div>
       <div class="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#FFE8A3]/20 rounded-full blur-[100px]"></div>
       <div class="absolute bottom-[-10%] left-[10%] w-[40vw] h-[40vw] bg-[#C1E1C1]/20 rounded-full blur-[120px]"></div>
    </div>

    <!-- 1. Lock Screen Overlay -->
    <transition
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 blur-md scale-105"
      enter-to-class="opacity-100 blur-0 scale-100"
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="opacity-100 blur-0"
      leave-to-class="opacity-0 blur-xl scale-95"
    >
      <div v-if="isLocked && !isUnlocked" class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#F8F9FC]">
        <div class="absolute inset-0 bg-white/40 backdrop-blur-3xl"></div>
        <div class="relative z-10 w-full max-w-md p-8 mx-4">
          <div class="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_20px_40px_-15px_rgba(198,185,255,0.3)] p-8 text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#C6B9FF] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <Lock class="w-8 h-8 text-white" />
            </div>
            <h2 class="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Private Space</h2>
            <p class="text-slate-500 mb-8 text-sm">Softly secured for your eyes only.</p>
            
            <form @submit.prevent="handleUnlock" class="space-y-4">
              <div class="relative group">
                <input 
                  type="password" 
                  v-model="unlockPassword"
                  placeholder="Access Key"
                  class="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C6B9FF] focus:ring-4 focus:ring-[#C6B9FF]/20 transition-all"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                :disabled="unlocking"
                class="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-slate-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="unlocking">Verifying...</span>
                <span v-else>Enter Workspace</span>
              </button>
              
              <p v-if="unlockError" class="text-red-400 text-xs mt-2 font-medium">{{ unlockError }}</p>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- 2. Main Interface -->
    <div v-if="!(isLocked && !isUnlocked)" class="relative z-10 min-h-screen flex flex-col">
      
      <!-- Header -->
      <header 
        class="sticky top-0 z-40 transition-all duration-500"
        :class="isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm shadow-indigo-100/20 py-2' : 'bg-transparent py-6'"
      >
        <div class="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-6">
          
          <!-- Left: Logo -->
          <div class="flex items-center gap-3 min-w-fit">
            <div class="w-10 h-10 bg-gradient-to-br from-[#C6B9FF] to-[#A78BFA] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200/50 rotate-3 hover:rotate-0 transition-transform duration-300">
              <LayoutGrid class="w-5 h-5" />
            </div>
            <span class="text-xl font-bold text-slate-800 tracking-tight">
              {{ title || 'Mao Nav' }}
            </span>
          </div>
          
          <!-- Center: Search Bar (Floating Pill) -->
          <div class="hidden md:flex flex-1 max-w-xl mx-auto justify-center">
            <div class="w-full relative group">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[#A78BFA] group-focus-within:text-indigo-600 transition-colors">
                <Search class="w-5 h-5" />
              </div>
              <input 
                v-model="searchQuery"
                @keydown.enter="handleSearchEnter"
                type="text" 
                class="w-full bg-white border border-transparent shadow-[0_4px_20px_-4px_rgba(198,185,255,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(198,185,255,0.4)] focus:shadow-[0_8px_30px_-5px_rgba(198,185,255,0.5)] focus:ring-2 focus:ring-[#C6B9FF]/30 rounded-full py-3 pl-12 pr-14 text-sm font-medium text-slate-700 transition-all outline-none placeholder:text-slate-400"
                placeholder="Search for inspiration..."
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd class="hidden lg:inline-flex h-7 items-center gap-1 rounded-full border border-slate-100 bg-slate-50 px-3 font-sans text-[10px] font-bold text-slate-400 shadow-sm">
                  ⌘ F
                </kbd>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-3 min-w-fit">
             <div class="md:hidden">
                <button @click="showMobileMenu = true" class="p-2 text-slate-600 bg-white rounded-xl shadow-sm">
                   <Menu class="w-6 h-6" />
                </button>
             </div>

             <a href="https://github.com/maodeyu180/mao_nav" target="_blank" class="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full hover:bg-slate-50 hover:text-indigo-600 cursor-pointer transition-all shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-transparent hover:border-indigo-100">
               <Github class="w-4 h-4" />
               <span>GitHub</span>
             </a>
          </div>
        </div>
      </header>

      <!-- Mobile Search -->
      <div class="md:hidden px-4 pb-4" v-if="!isScrolled">
        <div class="relative">
           <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[#A78BFA]">
              <Search class="w-4 h-4" />
           </div>
           <input v-model="searchQuery" class="w-full bg-white rounded-full py-3 pl-10 pr-4 text-sm shadow-sm border border-transparent focus:border-[#C6B9FF] outline-none transition-all" placeholder="Search..." />
        </div>
      </div>

      <!-- Content Grid -->
      <main class="flex-1 container mx-auto px-4 md:px-8 py-8">
        
        <div v-if="loading" class="flex justify-center py-20">
           <div class="w-10 h-10 border-4 border-[#E0D4FF] border-t-[#A78BFA] rounded-full animate-spin"></div>
        </div>

        <div v-else-if="error" class="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-red-50">
          <p class="text-red-400 mb-4 font-medium">{{ error }}</p>
          <button @click="fetchCategories" class="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 transition shadow-sm text-sm">Retry</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="category in filteredCategories" 
            :key="category.id" 
            class=""
          >
            <div class="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] border border-white/50 hover:shadow-[0_20px_50px_-10px_rgba(198,185,255,0.2)] transition-all duration-500 hover:-translate-y-1">
              
              <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-50">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F3F0FF] to-[#E0D4FF] flex items-center justify-center text-xl shadow-inner">
                  {{ category.icon }}
                </div>
                <h2 class="text-lg font-bold text-slate-800 tracking-tight">{{ category.name }}</h2>
              </div>

              <div class="space-y-2">
                <a 
                  v-for="site in category.sites" 
                  :key="site.id"
                  :href="site.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-4 p-3 rounded-2xl hover:bg-[#F8F9FC] transition-all duration-300 border border-transparent hover:border-[#F3F0FF]"
                >
                  <div class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <img 
                        v-if="site.icon"
                        :src="site.icon" 
                        :alt="site.name"
                        class="w-5 h-5 object-contain"
                        @error="(e) => handleImageError(e, site.id)"
                      />
                      <span v-else class="emoji-fallback text-base leading-none">{{ getFallbackEmoji(site.id) }}</span>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                     <div class="flex items-center justify-between">
                        <span class="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{{ site.name }}</span>
                        <ChevronRight class="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                     </div>
                     <p v-if="site.description" class="text-xs text-slate-400 truncate mt-0.5 font-medium group-hover:text-slate-500 transition-colors">{{ site.description }}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div v-if="showMobileMenu" class="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl md:hidden flex flex-col">
          <div class="p-6 flex items-center justify-between">
            <span class="text-xl font-bold text-slate-800">Menu</span>
            <button @click="showMobileMenu = false" class="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 rounded-xl">
              <X class="w-6 h-6" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
             <div class="text-sm text-slate-400 font-medium mb-2 px-2">Categories</div>
             <div v-for="cat in categories" :key="cat.id" class="p-4 rounded-2xl bg-slate-50 flex items-center gap-3">
                <span class="text-xl">{{ cat.icon }}</span>
                <span class="font-bold text-slate-700">{{ cat.name }}</span>
             </div>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
  border: 2px solid #F8F9FC;
}
::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
