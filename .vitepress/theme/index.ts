import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import BlogList from './components/BlogList.vue'
import ResourceCards from './components/ResourceCards.vue'
import TutorialNav from './components/TutorialNav.vue'
import HomeHero from './components/HomeHero.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('BlogList', BlogList)
    app.component('ResourceCards', ResourceCards)
    app.component('TutorialNav', TutorialNav)
    app.component('HomeHero', HomeHero)
  },
} satisfies Theme
