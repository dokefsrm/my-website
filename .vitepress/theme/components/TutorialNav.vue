<script setup lang="ts">
interface NavItem {
  text: string
  link: string
}

interface SeriesChapter {
  title: string
  link: string
  order: number
}

const props = defineProps<{
  prev?: NavItem
  next?: NavItem
  seriesChapters: SeriesChapter[]
}>()

function currentIndex() {
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  return props.seriesChapters.findIndex(ch => path.endsWith(ch.link))
}
</script>

<template>
  <div class="tutorial-nav-wrapper">
    <!-- 系列进度指示 -->
    <div v-if="seriesChapters.length > 0" class="series-progress">
      <div class="progress-header">📑 本系列目录</div>
      <div class="progress-list">
        <a
          v-for="(ch, i) in seriesChapters"
          :key="ch.link"
          :href="ch.link"
          class="progress-item"
          :class="{ active: i === currentIndex() }"
        >
          <span class="progress-dot">{{ i + 1 }}</span>
          {{ ch.title }}
        </a>
      </div>
    </div>

    <!-- 上一页 / 下一页 -->
    <div class="tutorial-nav">
      <a v-if="prev" :href="prev.link" class="nav-link prev">
        ← {{ prev.text }}
      </a>
      <span v-else></span>
      <a v-if="next" :href="next.link" class="nav-link next">
        {{ next.text }} →
      </a>
    </div>
  </div>
</template>

<style scoped>
.tutorial-nav-wrapper {
  margin-top: 48px;
}
.series-progress {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.progress-header {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.progress-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.2s;
}
.progress-item:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.progress-item.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.progress-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.progress-item.active .progress-dot {
  background: var(--vp-c-brand-1);
  color: white;
}
.tutorial-nav {
  display: flex;
  justify-content: space-between;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s;
}
.nav-link:hover {
  background: var(--vp-c-brand-soft);
  text-decoration: none;
  transform: translateY(-1px);
}
</style>
