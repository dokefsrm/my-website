<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/index.js'

const resources = ref([])
const categories = ref([])
const selectedCat = ref('全部')
const loading = ref(true)

onMounted(async () => {
  try { const res = await api.get('/api/resources'); resources.value = res.items; categories.value = res.categories } catch {}
  loading.value = false
})

const filtered = () => {
  if (selectedCat.value === '全部') return resources.value
  return resources.value.filter(r => r.category === selectedCat.value)
}

function catClass(cat) {
  const map = { '工具': 'tool', '书籍': 'book', '网站': 'website' }
  return map[cat] || 'tool'
}
</script>

<template>
  <div class="container">
    <h1 class="page-title">🔧 资源库</h1>

    <div class="filter-bar" v-if="categories.length">
      <button class="filter-btn" :class="{ active: selectedCat === '全部' }" @click="selectedCat = '全部'">全部</button>
      <button v-for="c in categories" :key="c" class="filter-btn" :class="{ active: selectedCat === c }" @click="selectedCat = c">{{ c }}</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div class="resource-grid" v-else-if="filtered().length">
      <a v-for="r in filtered()" :key="r.id" :href="r.url" target="_blank" rel="noopener" class="resource-card">
        <span class="cat-badge" :class="catClass(r.category)">{{ r.category }}</span>
        <h3>{{ r.title }}</h3>
        <p class="desc">{{ r.description }}</p>
        <div style="margin-top:8px">
          <span class="tag" v-for="t in r.tags" :key="t" style="margin-right:4px">{{ t }}</span>
        </div>
      </a>
    </div>

    <div v-else class="empty">暂无资源</div>
  </div>
</template>
