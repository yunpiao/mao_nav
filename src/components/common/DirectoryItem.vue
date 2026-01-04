<script setup>
import { ExternalLink } from 'lucide-vue-next'

defineProps({
  site: {
    type: Object,
    required: true
  }
})

// Fallback emoji icons
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

// Extract domain for display
const extractDomain = (url) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}
</script>

<template>
  <a
    :href="site.url"
    target="_blank"
    rel="noopener noreferrer"
    class="directory-item group block"
  >
    <div class="flex items-start gap-4">
      <!-- Icon -->
      <div class="directory-icon-sm flex-shrink-0 overflow-hidden">
        <img
          v-if="site.icon"
          :src="site.icon"
          :alt="site.name"
          class="w-5 h-5 object-contain"
          loading="lazy"
          @error="(e) => handleImageError(e, site.id)"
        />
        <span v-else class="emoji-fallback text-lg">{{ getFallbackEmoji(site.id) }}</span>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ site.name }}
          </h3>
          <ExternalLink class="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>

        <p v-if="site.description" class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
          {{ site.description }}
        </p>

        <div class="text-xs text-slate-400 dark:text-slate-500 truncate">
          {{ extractDomain(site.url) }}
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
