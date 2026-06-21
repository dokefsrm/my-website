---
title: VitePress 建站实战指南
date: 2025-01-10
tags: [VitePress, Vue, 建站]
description: 从零开始用 VitePress 搭建一个带博客、教程和资源库的个人网站。
---

# VitePress 建站实战指南

VitePress 是 Vue 团队维护的静态站点生成器，基于 Vite 构建，极快、极简。

## 为什么选 VitePress

| 特性 | VitePress | VuePress | Nuxt 3 |
|------|-----------|----------|--------|
| 构建速度 | ⚡ 极快 | 🐢 较慢 | ⚡ 快 |
| Markdown 支持 | 原生 | 原生 | 插件 |
| 学习曲线 | 低 | 中 | 高 |
| 内置搜索 | ✅ | ❌ | ❌ |

## 快速开始

```bash
# 1. 创建项目
mkdir my-site && cd my-site
npm init -y
npm install -D vitepress vue

# 2. 添加快捷脚本
# package.json:
# "scripts": {
#   "dev": "vitepress dev",
#   "build": "vitepress build",
#   "preview": "vitepress preview"
# }

# 3. 启动开发服务器
npm run dev
```

## 目录结构

```
.
├── .vitepress/
│   ├── config.ts        # 站点配置
│   └── theme/           # 自定义主题
├── index.md             # 首页
└── *.md                 # 更多页面
```

## 自定义主题

VitePress 支持**扩展默认主题**，不需要从零开始：

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import MyComponent from './components/MyComponent.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MyComponent', MyComponent)
  },
}
```

## 部署到 Vercel

1. 把代码推送到 GitHub
2. 在 Vercel 中导入仓库
3. 构建命令：`npm run build`
4. 输出目录：`.vitepress/dist`
5. 部署完成 🎉

---

VitePress 生态还在飞速发展，现在是入手的好时机！
