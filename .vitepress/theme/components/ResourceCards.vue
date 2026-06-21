<script setup lang="ts">
import { computed, ref } from 'vue'

interface Resource {
  title: string
  url: string
  category: string
  tags: string[]
  description: string
}

const props = defineProps<{
  resources: Resource[]
}>()

const selectedCategory = ref<string>('全部')

const categories = computed(() => {
  const cats = new Set<string>()
  cats.add('全部')
  props.resources.forEach(r => cats.add(r.category))
  return Array.from(cats)
})

const filteredResources = computed(() => {
  if (selectedCategory.value === '全部') return props.resources
  return props.resources.filter(r => r.category === selectedCategory.value)
})

const categoryClass = (cat: string) => {
  const map: Record<string, string> = {
    '工具': 'tool',
    '书籍': 'book',
    '网站': 'website',
  }
  return map[cat] || 'other'
}
</script>

<template>
  <div class="resource-section">
    <!-- 分类筛选 -->
    <div class="filter-bar">
      <button
        v-for="cat in categories"
        :key="cat"
        class="filter-btn"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 资源卡片网格 -->
    <div class="resource-grid">
      <a
        v-for="r in filteredResources"
        :key="r.title"
        :href="r.url"
        target="_blank"
        rel="noopener noreferrer"
        class="resource-card"
      >
        <span class="category-badge" :class="categoryClass(r.category)">
          {{ r.category }}
        </span>
        <h3 class="r-title">{{ r.title }}</h3>
        <p class="r-desc">{{ r.description }}</p>
        <div class="r-tags">
          <span v-for="t in r.tags" :key="t" class="mini-tag">{{ t }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.resource-card {
  text-decoration: none;
  color: inherit;
  display: block;
}
.r-title {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0;
}
.r-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-bottom: 8px;
}
.r-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.mini-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}
</style>
