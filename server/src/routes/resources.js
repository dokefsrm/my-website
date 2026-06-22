import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import db from '../db/index.js'

const publicRouter = Router()
const adminRouter = Router()

// 公开：资源列表（支持分类筛选）
publicRouter.get('/', (req, res) => {
  const { category } = req.query
  const filter = category && category !== '全部' ? { category } : {}
  const resources = db.resources.findAll(filter, { orderBy: 'created_at', order: 'desc' })
  const categories = [...new Set(db.resources.findAll().map(r => r.category))]
  res.json({ items: resources, categories })
})

// 管理：获取所有
adminRouter.get('/', requireAuth, (req, res) => {
  const resources = db.resources.findAll({}, { orderBy: 'created_at', order: 'desc' })
  res.json({ items: resources })
})

// 管理：创建
adminRouter.post('/', requireAuth, (req, res) => {
  const { title, url, category = '工具', tags = [], description = '' } = req.body
  if (!title) return res.status(400).json({ error: '标题不能为空' })
  const resource = db.resources.create({ title, url: url || '', category, tags, description })
  res.status(201).json(resource)
})

// 管理：更新
adminRouter.put('/:id', requireAuth, (req, res) => {
  const resource = db.resources.findById(Number(req.params.id))
  if (!resource) return res.status(404).json({ error: '资源不存在' })
  const { title, url, category, tags, description } = req.body
  const updated = db.resources.update(resource.id, {
    title: title ?? resource.title,
    url: url ?? resource.url,
    category: category ?? resource.category,
    tags: tags ?? resource.tags,
    description: description ?? resource.description,
  })
  res.json(updated)
})

// 管理：删除
adminRouter.delete('/:id', requireAuth, (req, res) => {
  const ok = db.resources.delete(Number(req.params.id))
  if (!ok) return res.status(404).json({ error: '资源不存在' })
  res.json({ success: true })
})

export default { publicRouter, adminRouter }
