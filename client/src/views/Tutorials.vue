<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../api/index.js'

const tutorials = ref([])
const loading = ref(true)

onMounted(async () => {
  try { tutorials.value = await api.get('/api/tutorials') } catch {}
  loading.value = false
})
</script>

<template>
  <div class="container">
    <h1 class="page-title">📚 教程</h1>

    <div v-if="loading" class="loading">加载中...</div>

    <template v-else-if="tutorials.length">
      <RouterLink v-for="t in tutorials" :key="t.id" :to="`/tutorials/${t.id}`" class="tutorial-card">
        <h2>{{ t.title }}</h2>
        <p>{{ t.description }}</p>
        <span class="arrow">开始学习 →</span>
      </RouterLink>
    </template>

    <div v-else class="empty">暂无教程</div>
  </div>
</template>

<style scoped>
.tutorial-card {
  display: block;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  color: inherit;
  transition: all 0.2s;
}
.tutorial-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-decoration: none;
}
.tutorial-card h2 { font-size: 20px; margin-bottom: 8px; }
.tutorial-card p { color: #64748b; font-size: 14px; margin-bottom: 12px; }
.tutorial-card .arrow { color: #3b82f6; font-size: 14px; font-weight: 500; }
</style>
