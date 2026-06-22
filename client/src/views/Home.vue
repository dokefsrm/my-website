<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../api/index.js'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/api/posts?limit=3&status=published')
    posts.value = res.items
  } catch { /* ignore */ }
  loading.value = false
})
</script>

<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Hello, I'm <span class="gradient-text">dokefsrm</span>
        </h1>
        <p class="hero-desc">开发者 · 写作者 · 终身学习者</p>
        <div class="hero-links">
          <a href="https://github.com/dokefsrm" target="_blank" class="hero-link">GitHub</a>
          <RouterLink to="/blog" class="hero-link primary">阅读文章</RouterLink>
        </div>
      </div>
    </section>

    <!-- 快捷入口 -->
    <section class="quick-grid">
      <RouterLink to="/blog" class="quick-card">
        <span class="icon">📝</span>
        <span class="title">博客</span>
        <span class="desc">技术文章与思考</span>
      </RouterLink>
      <RouterLink to="/tutorials" class="quick-card">
        <span class="icon">📚</span>
        <span class="title">教程</span>
        <span class="desc">系列教程，由浅入深</span>
      </RouterLink>
      <RouterLink to="/resources" class="quick-card">
        <span class="icon">🔧</span>
        <span class="title">资源</span>
        <span class="desc">工具、书籍精选</span>
      </RouterLink>
      <RouterLink to="/about" class="quick-card">
        <span class="icon">🙋</span>
        <span class="title">关于</span>
        <span class="desc">了解更多</span>
      </RouterLink>
    </section>

    <!-- 最新文章 -->
    <section class="container" v-if="!loading && posts.length">
      <h2 class="section-title">📝 最新文章</h2>
      <div class="blog-card" v-for="p in posts" :key="p.id">
        <h2><RouterLink :to="`/blog/${p.id}`">{{ p.title }}</RouterLink></h2>
        <div class="meta">{{ new Date(p.created_at).toLocaleDateString('zh-CN') }}</div>
        <p class="excerpt">{{ p.excerpt }}</p>
        <div class="tags">
          <span class="tag" v-for="t in p.tags" :key="t">{{ t }}</span>
        </div>
      </div>
      <div style="text-align:center;margin-top:20px">
        <RouterLink to="/blog" class="hero-link">查看全部 →</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 72px 24px 56px;
  background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
}
.hero-title {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 12px;
}
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 28px;
}
.hero-links { display: flex; gap: 12px; justify-content: center; }
.hero-link {
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  color: #334155;
  transition: all 0.2s;
}
.hero-link:hover { border-color: #3b82f6; color: #3b82f6; text-decoration: none; }
.hero-link.primary {
  background: #3b82f6; color: #fff; border-color: #3b82f6;
}
.hero-link.primary:hover { background: #2563eb; }

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 800px;
  margin: -28px auto 40px;
  padding: 0 24px;
}
.quick-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transition: all 0.25s;
  color: inherit;
}
.quick-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(59,130,246,0.15);
  text-decoration: none;
}
.quick-card .icon { font-size: 32px; display: block; margin-bottom: 8px; }
.quick-card .title { font-size: 16px; font-weight: 700; display: block; margin-bottom: 4px; }
.quick-card .desc { font-size: 13px; color: #94a3b8; }

.section-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; }

@media (max-width: 640px) {
  .hero { padding: 48px 16px 40px; }
  .hero-title { font-size: 28px; }
  .quick-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
