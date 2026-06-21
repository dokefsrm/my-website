---
title: 初识 Vue
order: 1
description: 了解 Vue 是什么，搭建开发环境，写出第一个 Vue 应用。
---

<script setup>
import TutorialNav from '../../.vitepress/theme/components/TutorialNav.vue'
</script>

# 初识 Vue

## Vue 是什么？

Vue（发音 /vjuː/，类似 **view**）是一套用于构建用户界面的**渐进式** JavaScript 框架。

「渐进式」意味着你可以用它增强一个页面的一小部分，也可以用它构建复杂的单页应用（SPA）。

### 核心特性

- 💡 **声明式渲染** — 描述 UI 应该长什么样，Vue 负责更新 DOM
- 🧩 **组件化** — 把 UI 拆成可复用的组件
- ⚡ **响应式** — 数据变了，视图自动更新
- 🪶 **轻量** — 压缩后约 20KB

## 环境搭建

### 方式一：CDN（最快体验）

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
  const { createApp, ref } = Vue
  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return { message }
    }
  }).mount('#app')
</script>
```

### 方式二：Vite 脚手架（推荐）

```bash
npm create vue@latest
# 按提示选择需要的功能
cd your-project
npm install
npm run dev
```

## 第一个 Vue 应用

让我们用组合式 API 写一个计数器：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    👆 点击了 {{ count }} 次
  </button>
</template>
```

### 发生了什么？

1. `ref(0)` 创建了一个**响应式**变量 `count`
2. 点击按钮时 `count.value` +1
3. 模板中 `{{ count }}` 自动更新

这就是 Vue 最核心的**响应式**机制。

## 关键概念

| 概念 | 说明 | 类比 |
|------|------|------|
| **ref** | 包装一个值为响应式 | 给变量装了「自动通知系统」 |
| **template** | 声明 HTML 结构 | 和写 HTML 一样 |
| **setup** | 组件逻辑入口 | 组件的「大脑」 |
| **v-on (@)** | 监听事件 | `addEventListener` 的声明式写法 |

## 下一步

你已经写出了第一个 Vue 应用！接下来学习 Vue 最核心的设计思想——组件。

<TutorialNav
  :prev="undefined"
  :next="{ text: '02. 组件基础', link: '/tutorials/vue-basics/02-components' }"
  :seriesChapters="[
    { title: '系列介绍', link: '/tutorials/vue-basics/', order: 0 },
    { title: '01. 初识 Vue', link: '/tutorials/vue-basics/01-intro', order: 1 },
    { title: '02. 组件基础', link: '/tutorials/vue-basics/02-components', order: 2 },
  ]"
/>
