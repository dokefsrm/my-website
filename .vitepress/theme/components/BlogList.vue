<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'

// 从 build time 注入的文章数据
interface Post {
  title: string
  date: string
  tags: string[]
  description: string
  url: string
}

// VitePress 的 createContentLoader 在组件内不可用，这里通过 props 接收数据
const props = defineProps<{
  posts: Post[]
}>()

const selectedTag = ref<string | null>(null)

// 从所有文章中提取去重标签
const allTags = computed(() => {
  const tags = new Set<string>()
  props.posts.forEach(p => p.tags.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})

// 按标签筛选
const filteredPosts = computed(() => {
  if (!selectedTag.value) return props.posts
  return props.posts.filter(p => p.tags.includes(selectedTag.value!))
})

function toggleTag(tag: string) {
  selectedTag.value = selectedTag.value === tag ? null : tag
}

// 格式化日期
function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="blog-list">
    <!-- 标签筛选栏 -->
    <div class="filter-bar">
      <button
        class="filter-btn"
        :class="{ active: selectedTag === null }"
        @click="selectedTag = null"
      >
        全部
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="filter-btn"
        :class="{ active: selectedTag === tag }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <!-- 文章列表 -->
    <template v-if="filteredPosts.length">
      <article v-for="post in filteredPosts" :key="post.url" class="blog-card">
        <a :href="post.url" class="post-link">
          <h2 class="post-title">{{ post.title }}</h2>
        </a>
        <div class="post-meta">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>
        <p class="post-desc">{{ post.description }}</p>
        <div class="post-tags">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="tag"
            :class="{ active: selectedTag === tag }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
        <a :href="post.url" class="read-more">阅读全文 →</a>
      </article>
    </template>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>暂无 {{ selectedTag ? `"${selectedTag}"` : '' }} 相关文章</p>
    </div>
  </div>
</template>

<style scoped>
.post-link {
  text-decoration: none;
  color: inherit;
}
.post-link:hover {
  text-decoration: none;
}
.post-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}
.blog-card:hover .post-title {
  color: var(--vp-c-brand-1);
}
.post-meta {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
}
.post-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 12px;
}
.post-tags {
  margin-bottom: 12px;
}
.read-more {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.read-more:hover {
  text-decoration: underline;
}
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--vp-c-text-2);
  font-size: 15px;
}
</style>
