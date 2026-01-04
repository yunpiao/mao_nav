<script setup>
import {
  Bot,
  Brain,
  Sparkles,
  Activity,
  LineChart,
  Eye,
  Database,
  HardDrive,
  Rss,
  Wrench,
  Settings,
  ExternalLink,
  FileText,
  Volume2,
  Gauge,
  Search,
  GitBranch,
  Server,
  Cloud,
  Calculator,
  Github,
  BookOpen,
  Terminal
} from 'lucide-vue-next'

// --- Icon Mapping ---
const iconMap = {
  // AI Services
  'Dify AI': Bot,
  'Any2Text': FileText,
  'TTS': Volume2,
  'NewAPI': Settings,
  // Monitoring
  'Grafana': LineChart,
  'Prometheus': Gauge,
  'Uptime Kuma': Activity,
  'Kibana': Search,
  'Jaeger': GitBranch,
  // Storage
  'OBS': Cloud,
  'CouchDB': Database,
  'RSSHub': Rss,
  'RSS Reader': Rss,
  // Tools
  'Tools Box': Wrench,
  'DEC Service': Server,
  'TS Service': HardDrive,
  'Fenshululu': Calculator
}

// Get icon for item, fallback to category default
const getIcon = (itemName, categoryId) => {
  if (iconMap[itemName]) return iconMap[itemName]
  const categoryIcons = {
    ai: Brain,
    monitoring: Eye,
    storage: Database,
    tools: Wrench
  }
  return categoryIcons[categoryId] || Sparkles
}

// --- Profile Data ---
const profile = {
  name: 'yunpiao',
  title: 'Backend Engineer / DevOps',
  bio: 'Building infrastructure, self-hosting services, and exploring AI applications.',
  links: [
    { name: 'GitHub', url: 'https://github.com/yunpiao', icon: Github },
    { name: 'Blog', url: 'https://blog.yunpiao.site/', icon: BookOpen },
    { name: 'RSS', url: 'https://rsshub.yunpiao.site', icon: Rss }
  ]
}

// --- Featured Projects (Bento Grid: first item is large) ---
const featured = [
  {
    id: 'dify',
    name: 'Dify AI',
    description: 'AI application development platform with RAG, Agent, and Workflow support. Build LLM-powered apps without code.',
    url: 'https://dify.yunpiao.site',
    tags: ['AI', 'LLM', 'RAG'],
    icon: Bot,
    large: true
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Metrics visualization dashboard',
    url: 'https://grafana.yunpiao.site/dashboards/',
    tags: ['Monitoring'],
    icon: LineChart,
    large: false
  },
  {
    id: 'any2text',
    name: 'Any2Text',
    description: 'Multimodal to text: images, PDF, audio',
    url: 'https://any2text.yunpiao.site',
    tags: ['AI', 'OCR'],
    icon: FileText,
    large: false
  },
  {
    id: 'kuma',
    name: 'Uptime Kuma',
    description: 'Service availability monitoring',
    url: 'https://kuma.yunpiao.site',
    tags: ['Uptime'],
    icon: Activity,
    large: false
  },
  {
    id: 'tools',
    name: 'Tools Box',
    description: 'Developer utilities collection',
    url: 'https://tools.yunpiao.site',
    tags: ['Utils'],
    icon: Wrench,
    large: false
  },
  {
    id: 'tts',
    name: 'TTS',
    description: 'Text-to-speech synthesis',
    url: 'https://tts.yunpiao.site',
    tags: ['Audio'],
    icon: Volume2,
    large: false
  }
]

// --- All Services by Category ---
const categories = [
  {
    id: 'ai',
    name: 'AI Services',
    items: [
      { name: 'Dify AI', url: 'https://dify.yunpiao.site', desc: 'AI App Platform' },
      { name: 'Any2Text', url: 'https://any2text.yunpiao.site', desc: 'Multimodal OCR' },
      { name: 'TTS', url: 'https://tts.yunpiao.site', desc: 'Speech Synthesis' },
      { name: 'NewAPI', url: 'https://newapi.yunpiao.site', desc: 'API Gateway' }
    ]
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    items: [
      { name: 'Grafana', url: 'https://grafana.yunpiao.site/dashboards/', desc: 'Dashboards' },
      { name: 'Prometheus', url: 'https://prom.yunpiao.site', desc: 'Metrics' },
      { name: 'Uptime Kuma', url: 'https://kuma.yunpiao.site', desc: 'Uptime' },
      { name: 'Kibana', url: 'https://kibana.yunpiao.site', desc: 'Logs' },
      { name: 'Jaeger', url: 'https://jaeger.yunpiao.site', desc: 'Tracing' }
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    items: [
      { name: 'OBS', url: 'https://obs.yunpiao.site', desc: 'Object Storage' },
      { name: 'CouchDB', url: 'https://couch.yunpiao.site', desc: 'Document DB' },
      { name: 'RSSHub', url: 'https://rsshub.yunpiao.site', desc: 'RSS Generator' },
      { name: 'RSS Reader', url: 'https://rss.yunpiao.site', desc: 'Feed Reader' }
    ]
  },
  {
    id: 'tools',
    name: 'Tools',
    items: [
      { name: 'Tools Box', url: 'https://tools.yunpiao.site', desc: 'Utilities' },
      { name: 'DEC Service', url: 'https://dec.yunpiao.site', desc: 'Decoder' },
      { name: 'TS Service', url: 'https://ts.yunpiao.site', desc: 'Transfer' },
      { name: 'Fenshululu', url: 'https://www.fenshululu.cn/', desc: 'Score Entry' }
    ]
  }
]

// --- Stats ---
const stats = [
  { label: 'Services', value: '27+', status: 'online' },
  { label: 'Uptime', value: '99.9%', status: 'online' },
  { label: 'Open Source', value: '10+', status: 'online' }
]
</script>

<template>
  <div class="min-h-screen bg-[--background] relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute inset-0 bg-gradient-radial pointer-events-none" aria-hidden="true"></div>
    <div class="absolute inset-0 grid-pattern pointer-events-none opacity-50" aria-hidden="true"></div>

    <!-- Ambient Glow Orbs -->
    <div
      class="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
      style="background: radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent 70%)"
      aria-hidden="true"
    ></div>
    <div
      class="absolute bottom-40 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
      style="background: radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent 70%)"
      aria-hidden="true"
    ></div>

    <!-- Hero Section -->
    <header class="relative z-10 pt-20 pb-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Terminal Icon -->
        <div class="icon-box-lg mx-auto mb-6 glow-sm animate-float">
          <Terminal class="w-7 h-7 text-accent" />
        </div>
        <h1 class="text-4xl sm:text-5xl font-semibold text-[--foreground] mb-3 tracking-tight font-display">
          {{ profile.name }}
        </h1>
        <p class="text-lg text-accent font-medium mb-4 font-mono">{{ profile.title }}</p>
        <p class="text-muted max-w-xl mx-auto mb-10 leading-relaxed">{{ profile.bio }}</p>

        <!-- Links -->
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <a
            v-for="link in profile.links"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary inline-flex items-center gap-2"
          >
            <component :is="link.icon" class="w-4 h-4" />
            {{ link.name }}
          </a>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <section class="relative z-10 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-3 gap-4 stats-grid-responsive">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card p-6 text-center"
            role="status"
            :aria-label="stat.label + ': ' + stat.value"
          >
            <div class="text-3xl font-semibold text-[--foreground] mb-1 font-mono">{{ stat.value }}</div>
            <div class="text-sm text-muted font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects - Bento Grid -->
    <section class="relative z-10 pt-16 pb-8 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-xl font-semibold text-[--foreground] mb-8 text-center tracking-tight font-display">
          Featured Projects
        </h2>
        <div class="bento-grid">
          <a
            v-for="project in featured"
            :key="project.id"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block group no-underline"
            :class="[
              project.large ? 'glass-card-lg bento-large p-6' : 'glass-card p-5'
            ]"
          >
            <!-- Large Card Content -->
            <template v-if="project.large">
              <div class="flex items-start justify-between mb-5">
                <div class="icon-box glow-sm">
                  <component :is="project.icon" class="w-5 h-5 text-accent" />
                </div>
                <ExternalLink class="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 class="text-lg font-semibold text-[--foreground] group-hover:text-accent transition-colors mb-3 font-display">
                {{ project.name }}
              </h3>
              <p class="text-sm text-muted mb-5 leading-relaxed line-clamp-3">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="tag tag-accent"
                >
                  {{ tag }}
                </span>
              </div>
            </template>

            <!-- Regular Card Content -->
            <template v-else>
              <div class="flex items-start justify-between mb-4">
                <div class="icon-box flex-shrink-0">
                  <component :is="project.icon" class="w-5 h-5 text-accent" />
                </div>
                <ExternalLink class="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 class="font-semibold text-[--foreground] group-hover:text-accent transition-colors mb-2 font-display">
                {{ project.name }}
              </h3>
              <p class="text-sm text-muted mb-4 leading-relaxed line-clamp-2">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </template>
          </a>
        </div>
      </div>
    </section>

    <!-- All Services by Category -->
    <section class="relative z-10 pt-16 pb-20 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-xl font-semibold text-[--foreground] mb-8 text-center tracking-tight font-display">
          All Services
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="category in categories" :key="category.id" class="category-card">
            <div class="category-header">
              <span class="font-medium text-[--foreground] font-display">{{ category.name }}</span>
              <span class="category-count">{{ category.items.length }}</span>
            </div>
            <div class="p-3 space-y-1">
              <a
                v-for="item in category.items"
                :key="item.name"
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="service-item group"
              >
                <div class="icon-box-sm flex-shrink-0 transition-all">
                  <component :is="getIcon(item.name, category.id)" class="w-4 h-4 text-accent" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-[--foreground] truncate group-hover:text-accent transition-colors">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-muted truncate">{{ item.desc }}</div>
                </div>
                <ExternalLink class="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 py-8 text-center text-sm text-muted border-t border-[--border]">
      <span class="font-mono text-xs">Built with Vue 3 + TailwindCSS</span>
    </footer>
  </div>
</template>
