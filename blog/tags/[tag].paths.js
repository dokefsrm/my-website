// 动态生成标签页路由 — 用 fs 直接扫描文章 frontmatter
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const POSTS_DIR = 'blog/posts'

export default {
  async paths() {
    // VitePress 运行时 CWD 就是项目根目录
    const dir = join(process.cwd(), POSTS_DIR)

    let files
    try {
      files = readdirSync(dir).filter(f => f.endsWith('.md'))
    } catch {
      return []
    }

    const tags = new Set()

    for (const file of files) {
      try {
        const raw = readFileSync(join(dir, file), 'utf-8')
        const { data } = matter(raw)
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach(t => tags.add(t))
        }
      } catch {
        // skip unreadable files
      }
    }

    return Array.from(tags).map(tag => ({
      params: { tag },
    }))
  },
}
