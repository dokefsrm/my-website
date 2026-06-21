// VitePress 构建时加载博客文章元数据
import { createContentLoader } from 'vitepress'

export default createContentLoader('blog/posts/*.md', {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(raw) {
    return {
      posts: raw
        .filter(page => !page.frontmatter.draft)
        .map(page => ({
          title: page.frontmatter.title,
          date: page.frontmatter.date,
          tags: page.frontmatter.tags || [],
          description: page.frontmatter.description || '',
          url: page.url,
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }
  },
})
