<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '../api/index.js'
import hljs from 'highlight.js'

const route = useRoute()
const post = ref(null)
const loading = ref(true)
const giscusEl = ref(null)

async function highlight() {
  await nextTick()
  document.querySelectorAll('.post-content pre code').forEach(block => {
    hljs.highlightElement(block)
  })
}

function loadGiscus() {
  if (!giscusEl.value) return
  // 清除旧内容，重新注入 Giscus 脚本
  giscusEl.value.innerHTML = ''
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'dokefsrm/my-website')
  script.setAttribute('data-repo-id', 'R_kgDOTAy55g')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDOTAy55s4C_qnE')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', 'preferred_color_scheme')
  script.setAttribute('data-lang', 'zh-CN')
  script.crossOrigin = 'anonymous'
  script.async = true
  giscusEl.value.appendChild(script)
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

// 监听 post 加载完成后注入 Giscus（flush: 'post' 确保 DOM 已渲染）
watch(post, (val) => {
  if (val) {
    setTimeout(() => loadGiscus(), 0)
  }
}, { flush: 'post' })
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
      <div ref="giscusEl" class="giscus-wrap"></div>
    </div>
  </div>
  <div class="container" v-else><div class="empty">文章不存在</div></div>
</template>

<style scoped>
.back-link { font-size: 14px; color: var(--text-secondary); display: inline-block; margin-bottom: 16px; }
.comments-section { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); }
.giscus-wrap { background: var(--bg-soft); border-radius: var(--radius-sm); padding: 20px; }
</style>
