<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/index.js'

const about = ref({ name: '', bio: '', skills: [], social: {}, avatar_url: '' })
const loading = ref(true)

onMounted(async () => {
  try { about.value = await api.get('/api/about') } catch {}
  loading.value = false
})
</script>

<template>
  <div class="container" v-if="loading"><div class="loading">加载中...</div></div>
  <div class="container" v-else>
    <h1 class="page-title">🙋 关于</h1>

    <div class="about-card">
      <h2>{{ about.name || 'dokefsrm' }}</h2>
      <p class="bio">{{ about.bio || '还没有填写个人介绍。' }}</p>

      <div v-if="about.skills?.length" style="margin-top:20px">
        <h3>🛠️ 技能</h3>
        <div class="skill-tags">
          <span class="tag" v-for="s in about.skills" :key="s">{{ s }}</span>
        </div>
      </div>

      <div v-if="about.social && Object.keys(about.social).length" style="margin-top:20px">
        <h3>🌐 社交</h3>
        <div class="social-links">
          <a v-if="about.social.github" :href="about.social.github" target="_blank">GitHub</a>
          <a v-if="about.social.email" :href="`mailto:${about.social.email}`">Email</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-card {
  background: var(--bg-card); border-radius: 12px; padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.about-card h2 { font-size: 24px; margin-bottom: 12px; }
.bio { color: var(--text-secondary); font-size: 15px; line-height: 1.7; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.social-links { display: flex; gap: 16px; margin-top: 8px; }
.social-links a { font-size: 14px; }
</style>
