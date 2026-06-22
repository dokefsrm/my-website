<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '../api/index.js'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    post.value = await api.get(`/api/posts/${route.params.id}`)
  } catch { /* 404 */ }
  loading.value = false
})
</script>

<template>
  <div class="container" v-if="loading">
    <div class="loading">加载中...</div>
  </div>
  <div class="container" v-else-if="post">
    <RouterLink to="/blog" class="back-link">← 返回博客</RouterLink>
    <h1 class="page-title">{{ post.title }}</h1>
    <div class="meta" style="margin-bottom:24px;color:#94a3b8;font-size:14px">
      {{ new Date(post.created_at).toLocaleDateString('zh-CN') }}
      · <span class="tag" v-for="t in post.tags" :key="t" style="margin-right:4px">{{ t }}</span>
    </div>
    <div class="post-content" v-html="post.content" />
  </div>
  <div class="container" v-else>
    <div class="empty">文章不存在</div>
  </div>
</template>

<style scoped>
.back-link { font-size: 14px; color: #64748b; display: inline-block; margin-bottom: 16px; }
</style>
