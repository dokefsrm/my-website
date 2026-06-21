---
title: 资源库
description: 精选开发工具、书籍和网站资源
---

<script setup>
import { ref, onMounted } from 'vue'
import resources from './data/resources.json'
</script>

# 🔧 资源库

我日常使用和推荐的开发资源，按分类筛选。

<ResourceCards :resources="resources" />

---

## 💡 推荐方式

- **工具类**：可以先用免费版试试，大部分足够日常使用
- **书籍类**：建议先看目录和书评，挑最需要的章节精读
- **网站类**：收藏到浏览器的 Favorites 栏，需要时随手查

> 持续更新中，欢迎推荐好资源！
