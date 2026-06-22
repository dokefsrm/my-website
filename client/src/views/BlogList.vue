<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../api/index.js'

const posts = ref([])
const tags = ref([])
const selectedTag = ref(null)
const page = ref(1)
const totalPages = ref(1)
const loading = ref(true)

async function fetchPosts() {
  loading.value = true
  try {
    const params = { page: page.value, limit: 10, status: 'published' }
    if (selectedTag.value) params.tag = selectedTag.value
    const res = await api.get('/api/posts', { params })
    posts.value = res.items
    tags.value = res.tags || []
    totalPages.value = res.totalPages
  } catch { /* ignore */ }
  loading.value = false
}

function selectTag(tag) {
  selectedTag.value = selectedTag.value === tag ? null : tag
  page.value = 1
  fetchPosts()
}

function goPage(p) { page.value = p; fetchPosts(); window.scrollTo(0, 0) }

onMounted(fetchPosts)
</script>

<template>
  <div class="container">
    <h1 class="page-title">📝 博客</h1>

    <div class="filter-bar" v-if="tags.length">
      <button class="filter-btn" :class="{ active: !selectedTag }" @click="selectTag(null)">全部</button>
      <button v-for="t in tags" :key="t" class="filter-btn" :class="{ active: selectedTag === t }" @click="selectTag(t)">{{ t }}</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <template v-else-if="posts.length">
      <div class="blog-card" v-for="p in posts" :key="p.id">
        <h2><RouterLink :to="`/blog/${p.id}`">{{ p.title }}</RouterLink></h2>
        <div class="meta">{{ new Date(p.created_at).toLocaleDateString('zh-CN') }}</div>
        <p class="excerpt">{{ p.excerpt }}</p>
        <div class="tags">
          <span class="tag" v-for="t in p.tags" :key="t">{{ t }}</span>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="page <= 1" @click="goPage(page - 1)">上一页</button>
        <button v-for="i in totalPages" :key="i" @click="goPage(i)" :class="{ active: i === page }">{{ i }}</button>
        <button :disabled="page >= totalPages" @click="goPage(page + 1)">下一页</button>
      </div>
    </template>

    <div v-else class="empty">暂无文章</div>
  </div>
</template>
