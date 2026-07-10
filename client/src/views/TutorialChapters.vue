<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '../api/index.js'

const route = useRoute()
const tutorial = ref(null)
const chapters = ref([])
const loading = ref(true)
const currentPath = computed(() => route.path)

onMounted(async () => {
  try {
    const res = await api.get(`/api/tutorials/${route.params.id}/chapters`)
    tutorial.value = res.tutorial
    chapters.value = res.chapters
  } catch {}
  loading.value = false
})

function isActive(link) {
  return currentPath.value === link
}
</script>

<template>
  <div class="container" v-if="loading"><div class="loading">加载中...</div></div>
  <div class="container" v-else-if="tutorial">
    <RouterLink to="/tutorials" class="back-link">← 返回教程</RouterLink>
    <h1 class="page-title">{{ tutorial.title }}</h1>
    <p style="color:#64748b;margin-bottom:24px">{{ tutorial.description }}</p>

    <div class="tutorial-progress" v-if="chapters.length">
      <div class="progress-title">📑 章节列表</div>
      <RouterLink
        v-for="(ch, i) in chapters"
        :key="ch.id"
        :to="`/tutorials/${tutorial.id}?chapter=${ch.id}`"
        class="chapter-link"
      >
        <span class="dot">{{ i + 1 }}</span>
        {{ ch.title }}
      </RouterLink>
    </div>

    <!-- 章节内容 -->
    <div v-for="ch in chapters" :key="ch.id" class="chapter-content" :id="`chapter-${ch.id}`">
      <h2>{{ ch.title }}</h2>
      <div class="post-content" v-html="ch.content" />
    </div>
  </div>
</template>

<style scoped>
.back-link { font-size: 14px; color: var(--text-secondary); display: inline-block; margin-bottom: 16px; }
.progress-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
.chapter-link {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; border-radius: 8px; font-size: 14px;
  color: var(--text-secondary); margin-bottom: 4px;
}
.chapter-link:hover { background: var(--brand-soft); color: var(--brand); text-decoration: none; }
.chapter-link .dot {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--bg-soft); display: flex; align-items: center;
  justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.chapter-content { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }
.chapter-content h2 { font-size: 22px; margin-bottom: 16px; }
</style>
