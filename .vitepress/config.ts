import { defineConfig } from 'vitepress'

// 教程系列侧边栏配置
const tutorialsSidebar = [
  {
    text: 'Vue 基础入门',
    collapsed: false,
    items: [
      { text: '系列介绍', link: '/tutorials/vue-basics/' },
      { text: '01. 初识 Vue', link: '/tutorials/vue-basics/01-intro' },
      { text: '02. 组件基础', link: '/tutorials/vue-basics/02-components' },
    ],
  },
  {
    text: 'Git 实用指南',
    collapsed: true,
    items: [
      { text: '系列介绍', link: '/tutorials/git-guide/' },
      { text: '01. Git 起步', link: '/tutorials/git-guide/01-start' },
      { text: '02. 分支与协作', link: '/tutorials/git-guide/02-branch' },
    ],
  },
]

export default defineConfig({
  base: '/my-website/',
  title: 'MySite',
  description: '个人网站 — 分享资源、教程与文章',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'MySite - 资源·教程·文章' }],
    ['meta', { property: 'og:description', content: '个人网站，分享开发资源、技术教程与思考文章' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  // 本地搜索
  search: {
    provider: 'local',
    options: {
      translations: {
        button: {
          buttonText: '搜索',
          buttonAriaLabel: '搜索文章',
        },
        modal: {
          noResultsText: '未找到相关结果',
          resetButtonTitle: '清除条件',
          footer: {
            selectText: '选择',
            navigateText: '切换',
            closeText: '关闭',
          },
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '教程', link: '/tutorials/' },
      { text: '资源', link: '/resources/' },
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/tutorials/': tutorialsSidebar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],

    // 编辑链接（需要 Git 仓库，部署到 GitHub 后启用）
    // editLink: {
    //   pattern: 'https://github.com/yourname/my-website/edit/main/:path',
    //   text: '在 GitHub 上编辑此页',
    // },

    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2025',
    },

    // 上次更新时间（需要 Git 仓库，部署后自动生效）
    // lastUpdated: {
    //   text: '最后更新于',
    //   formatOptions: {
    //     dateStyle: 'short',
    //   },
    // },

    // 文档元信息
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 大纲
    outline: {
      label: '页面导航',
      level: [2, 3],
    },
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详情',
    },
  },

  // Sitemap
  sitemap: {
    hostname: 'https://yourdomain.com',
  },

  // 忽略死链检查的文件
  ignoreDeadLinks: true,

  // 排除 index.md，使用 public/index.html（ZYYO 风格首页）
  srcExclude: ['index.md'],
})
