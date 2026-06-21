---
title: 组件基础
order: 2
description: 理解 Vue 组件的概念，学习 Props、Events 和插槽的使用。
---

<script setup>
import TutorialNav from '../../.vitepress/theme/components/TutorialNav.vue'
</script>

# 组件基础

## 什么是组件？

组件是 Vue 的**核心设计单元**。页面上的每个功能块都可以封装成组件——按钮、表单、导航栏，甚至是整个页面。

```
App
├── Header
│   ├── Logo
│   └── NavMenu
├── MainContent
│   ├── ArticleCard × N
│   └── Sidebar
└── Footer
```

## 定义组件

在 Vue 3 中，每个 `.vue` 文件就是一个**单文件组件（SFC）**：

```vue
<script setup>
// 逻辑
</script>

<template>
  <!-- 模板 -->
</template>

<style scoped>
/* 隔离样式 */
</style>
```

### 示例：一个消息卡片

```vue
<!-- MessageCard.vue -->
<script setup>
defineProps({
  author: String,
  content: String,
  time: String,
})
</script>

<template>
  <div class="card">
    <strong>{{ author }}</strong>
    <p>{{ content }}</p>
    <small>{{ time }}</small>
  </div>
</template>

<style scoped>
.card {
  padding: 16px;
  border-radius: 8px;
  background: #f5f5f5;
}
</style>
```

## Props — 父传子

父组件通过 props 向子组件传递数据：

```vue
<!-- 使用 MessageCard -->
<MessageCard
  author="小明"
  content="今天学会了 Vue 组件！"
  time="刚刚"
/>
```

## Events — 子传父

子组件通过 `emit` 向父组件发消息：

```vue
<!-- Child.vue -->
<script setup>
const emit = defineEmits(['submit'])
function handleClick() {
  emit('submit', '来自子组件的消息')
}
</script>
<template>
  <button @click="handleClick">提交</button>
</template>
```

## 插槽 — 内容分发

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>
```

```vue
<Card>
  <template #header>标题</template>
  默认插槽内容
  <template #footer>底部</template>
</Card>
```

## 📝 小结

| 通信方式 | 方向 | 场景 |
|---------|------|------|
| Props | 父 → 子 | 传递数据 |
| Emits | 子 → 父 | 事件通知 |
| Slots | 父 → 子 | 内容分发 |

掌握了组件，你就掌握了 Vue 开发的精髓！🎉

<TutorialNav
  :prev="{ text: '01. 初识 Vue', link: '/tutorials/vue-basics/01-intro' }"
  :next="undefined"
  :seriesChapters="[
    { title: '系列介绍', link: '/tutorials/vue-basics/', order: 0 },
    { title: '01. 初识 Vue', link: '/tutorials/vue-basics/01-intro', order: 1 },
    { title: '02. 组件基础', link: '/tutorials/vue-basics/02-components', order: 2 },
  ]"
/>
