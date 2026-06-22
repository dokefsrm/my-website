import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import db from '../db/index.js'

const publicRouter = Router()
const adminRouter = Router()

// === 公开接口 ===

// 文章列表（分页 + 标签筛选）
publicRouter.get('/', (req, res) => {
  const { page = 1, limit = 10, tag, status = 'published' } = req.query
  const filter = { status }
  let posts = db.posts.findAll(filter, { orderBy: 'created_at', order: 'desc' })

  // 标签筛选
  if (tag) {
    posts = posts.filter(p => p.tags && p.tags.includes(tag))
  }

  // 收集所有标签
  const allTags = new Set()
  db.posts.findAll({ status: 'published' }).forEach(p => {
    (p.tags || []).forEach(t => allTags.add(t))
  })

  // 分页
  const total = posts.length
  const offset = (Number(page) - 1) * Number(limit)
  const paged = posts.slice(offset, offset + Number(limit))

  // 去掉 content 减少传输量
  const items = paged.map(({ content, ...rest }) => rest)

  res.json({
    items,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    tags: Array.from(allTags),
  })
})

// 文章详情
publicRouter.get('/:id', (req, res) => {
  const post = db.posts.findById(Number(req.params.id))
  if (!post || post.status !== 'published') {
    return res.status(404).json({ error: '文章不存在' })
  }
  res.json(post)
})

// === 管理接口 ===

// 获取所有文章（含草稿）
adminRouter.get('/', requireAuth, (req, res) => {
  const { status } = req.query
  const filter = status ? { status } : {}
  const posts = db.posts.findAll(filter, { orderBy: 'created_at', order: 'desc' })
  const items = posts.map(({ content, ...rest }) => rest)
  res.json({ items, total: items.length })
})

// 创建文章
adminRouter.post('/', requireAuth, (req, res) => {
  const { title, content, excerpt, cover, tags, status = 'draft' } = req.body
  if (!title) return res.status(400).json({ error: '标题不能为空' })

  const post = db.posts.create({
    title, content: content || '', excerpt: excerpt || '', cover: cover || '',
    tags: tags || [], status, author_id: req.user.id,
  })
  res.status(201).json(post)
})

// 更新文章
adminRouter.put('/:id', requireAuth, (req, res) => {
  const post = db.posts.findById(Number(req.params.id))
  if (!post) return res.status(404).json({ error: '文章不存在' })

  const { title, content, excerpt, cover, tags, status } = req.body
  const updated = db.posts.update(post.id, {
    title: title ?? post.title,
    content: content ?? post.content,
    excerpt: excerpt ?? post.excerpt,
    cover: cover ?? post.cover,
    tags: tags ?? post.tags,
    status: status ?? post.status,
  })
  res.json(updated)
})

// 删除文章
adminRouter.delete('/:id', requireAuth, (req, res) => {
  const ok = db.posts.delete(Number(req.params.id))
  if (!ok) return res.status(404).json({ error: '文章不存在' })
  res.json({ success: true })
})

export default { publicRouter, adminRouter }
