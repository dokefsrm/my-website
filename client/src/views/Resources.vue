<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/index.js'

const resources = ref([])
const selectedCat = ref('全部')
const loading = ref(true)

const categoryColors = {
  '程序': { bg: '#dbeafe', color: '#1d4ed8' },
  '书本': { bg: '#dcfce7', color: '#15803d' },
  '网站': { bg: '#fef3c7', color: '#a16207' },
  '工具': { bg: '#f3e8ff', color: '#7c3aed' },
  '其他': { bg: '#f1f5f9', color: '#475569' },
}

// 从数据库中提取实际存在的分类
const categories = computed(() => {
  const cats = new Set(resources.value.map(r => r.category))
  return ['全部', ...Array.from(cats).sort()]
})

const filtered = computed(() => {
  if (selectedCat.value === '全部') return resources.value
  return resources.value.filter(r => r.category === selectedCat.value)
})

// 按分类分组（全部模式）
const grouped = computed(() => {
  if (selectedCat.value !== '全部') return null
  const groups = {}
  resources.value.forEach(r => {
    if (!groups[r.category]) groups[r.category] = []
    groups[r.category].push(r)
  })
  return groups
})

onMounted(async () => {
  try { const res = await api.get('/api/resources'); resources.value = res.items } catch {}
  loading.value = false
})
</script>

<template>
  <div class="container">
    <h1 class="page-title">🔧 资源库</h1>

    <!-- 分类筛选 -->
    <div class="filter-bar" v-if="categories.length > 1">
      <button
        v-for="c in categories"
        :key="c"
        class="filter-btn"
        :class="{ active: selectedCat === c }"
        @click="selectedCat = c"
      >
        {{ c }}
      </button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <!-- 全部模式：按分类分组 -->
    <template v-else-if="grouped">
      <div v-for="(items, cat) in grouped" :key="cat" class="cat-section">
        <h3 class="cat-title">{{ cat }} <span class="count">{{ items.length }}</span></h3>
        <div class="resource-grid">
          <a v-for="r in items" :key="r.id" :href="r.url" target="_blank" rel="noopener" class="resource-card">
            <span class="cat-badge" :style="{
              background: (categoryColors[r.category] || categoryColors['其他']).bg,
              color: (categoryColors[r.category] || categoryColors['其他']).color
            }">{{ r.category }}</span>
            <h3>{{ r.title }}</h3>
            <p class="desc">{{ r.description }}</p>
            <div class="card-tags">
              <span class="mini-tag" v-for="t in r.tags" :key="t">{{ t }}</span>
            </div>
          </a>
        </div>
      </div>
    </template>

    <!-- 单分类模式 -->
    <div class="resource-grid" v-else-if="filtered.length">
      <a v-for="r in filtered" :key="r.id" :href="r.url" target="_blank" rel="noopener" class="resource-card">
        <span class="cat-badge" :style="{
          background: (categoryColors[r.category] || categoryColors['其他']).bg,
          color: (categoryColors[r.category] || categoryColors['其他']).color
        }">{{ r.category }}</span>
        <h3>{{ r.title }}</h3>
        <p class="desc">{{ r.description }}</p>
        <div class="card-tags">
          <span class="mini-tag" v-for="t in r.tags" :key="t">{{ t }}</span>
        </div>
      </a>
    </div>

    <div v-else class="empty">暂无资源</div>
  </div>
</template>

<style scoped>
.cat-section { margin-bottom: 32px; }
.cat-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--border); }
.count { font-size: 13px; color: var(--text-muted); font-weight: 400; margin-left: 6px; }

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.resource-card {
  background: var(--bg-card); border-radius: 12px; padding: 20px;
  border: 1px solid var(--border); transition: all 0.2s;
  display: block; color: inherit; text-decoration: none;
}
.resource-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  transform: translateY(-2px);
  text-decoration: none;
}
.resource-card h3 { font-size: 16px; margin: 8px 0; }
.desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
.cat-badge {
  display: inline-block; padding: 2px 10px; border-radius: 4px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.3px;
}
.card-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 10px; }
.mini-tag {
  padding: 1px 8px; border-radius: 10px; font-size: 11px;
  background: var(--bg-soft); color: var(--text-secondary);
}

@media (max-width: 640px) {
  .resource-grid { grid-template-columns: 1fr; }
}
</style>
