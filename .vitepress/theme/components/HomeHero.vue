<script setup lang="ts">
import { VPButton } from 'vitepress/theme'
</script>

<template>
  <div class="home-hero">
    <div class="hero-content">
      <div class="hero-avatar">👨‍💻</div>
      <h1 class="hero-title">
        <span class="greeting">你好，我是</span>
        <span class="name-gradient">YourName</span>
      </h1>
      <p class="hero-desc">
        开发者 / 写作者 / 终身学习者<br>
        这里记录我的技术探索、教程与资源分享
      </p>
      <div class="hero-actions">
        <a class="vp-button brand" href="/blog/">📝 阅读文章</a>
        <a class="vp-button alt" href="/tutorials/">📚 查看教程</a>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-links">
      <a href="/blog/" class="quick-card">
        <span class="card-icon">📝</span>
        <span class="card-title">博客</span>
        <span class="card-desc">技术文章与思考</span>
      </a>
      <a href="/tutorials/" class="quick-card">
        <span class="card-icon">📚</span>
        <span class="card-title">教程</span>
        <span class="card-desc">系列教程，由浅入深</span>
      </a>
      <a href="/resources/" class="quick-card">
        <span class="card-icon">🔧</span>
        <span class="card-title">资源</span>
        <span class="card-desc">工具、书籍、网站精选</span>
      </a>
      <a href="/about" class="quick-card">
        <span class="card-icon">🙋</span>
        <span class="card-title">关于</span>
        <span class="card-desc">了解更多关于我</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.home-hero {
  text-align: center;
  padding: 48px 24px 64px;
}
.hero-content {
  max-width: 640px;
  margin: 0 auto;
}
.hero-avatar {
  font-size: 72px;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 16px;
}
.greeting {
  display: block;
  font-size: 20px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-bottom: 4px;
}
.name-gradient {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc {
  font-size: 16px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 32px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 快捷入口 */
.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 48px auto 0;
}
.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.25s;
  text-decoration: none;
  color: var(--vp-c-text-1);
}
.quick-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  text-decoration: none;
}
.card-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
}
.card-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
