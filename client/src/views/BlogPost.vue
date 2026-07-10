<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '../api/index.js'
import hljs from 'highlight.js'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

async function highlight() {
  await nextTick()
  document.querySelectorAll('.post-content pre code').forEach(block => {
    hljs.highlightElement(block)
  })
}

onMounted(async () => {
  try { post.value = await api.get(`/api/posts/${route.params.id}`) } catch {}
  loading.value = false
  await highlight()
})

watch(() => route.params.id, async () => {
  loading.value = true
  try { post.value = await api.get(`/api/posts/${route.params.id}`) } catch { post.value = null }
  loading.value = false
  await highlight()
})
</script>

<template>
  <div class="container" v-if="loading"><div class="loading">加载中...</div></div>
  <div class="container" v-else-if="post">
    <RouterLink to="/blog" class="back-link">← 返回博客</RouterLink>
    <img v-if="post.cover" :src="post.cover" class="post-cover" alt="">
    <h1 class="page-title">{{ post.title }}</h1>
    <div class="meta" style="margin-bottom:24px;color:var(--text-muted);font-size:14px">
      {{ new Date(post.created_at).toLocaleDateString('zh-CN') }}
      · <span class="tag" v-for="t in post.tags" :key="t" style="margin-right:4px">{{ t }}</span>
    </div>
    <div class="post-content" v-html="post.content" />

    <!-- Giscus 评论 -->
    <div class="comments-section" v-if="post.id">
      <h3 style="margin-bottom:16px">💬 评论</h3>
      <div class="giscus-wrap">
        <script src="https://giscus.app/client.js"
          data-repo="dokefsrm/my-website"
          data-repo-id="R_kgDOTAy55g"
          data-category="General"
          data-category-id="DIC_kwDOTAy55s4C_qnE"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="preferred_color_scheme"
          data-lang="zh-CN"
          crossorigin="anonymous"
          async>
        </script>
      </div>
    </div>
  </div>
  <div class="container" v-else><div class="empty">文章不存在</div></div>
</template>

<style scoped>
.back-link { font-size: 14px; color: var(--text-secondary); display: inline-block; margin-bottom: 16px; }
.comments-section { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); }
.giscus-wrap { background: var(--bg-soft); border-radius: var(--radius-sm); padding: 20px; }
</style>
