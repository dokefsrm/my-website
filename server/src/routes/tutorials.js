import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import db from '../db/index.js'

const publicRouter = Router()
const adminRouter = Router()

// 公开：教程系列列表
publicRouter.get('/', (req, res) => {
  const tutorials = db.tutorials.findAll(
    { status: 'published' },
    { orderBy: 'order', order: 'asc' }
  )
  res.json(tutorials)
})

// 公开：教程章节
publicRouter.get('/:id/chapters', (req, res) => {
  const tutorial = db.tutorials.findById(Number(req.params.id))
  if (!tutorial || tutorial.status !== 'published') {
    return res.status(404).json({ error: '教程不存在' })
  }
  const chapters = db.tutorialChapters.findAll(
    { tutorial_id: tutorial.id, status: 'published' },
    { orderBy: 'order', order: 'asc' }
  )
  res.json({ tutorial, chapters })
})

// 管理：所有教程
adminRouter.get('/', requireAuth, (req, res) => {
  const tutorials = db.tutorials.findAll({}, { orderBy: 'order', order: 'asc' })
  res.json(tutorials)
})

// 管理：创建教程
adminRouter.post('/', requireAuth, (req, res) => {
  const { title, description, order = 0, status = 'draft' } = req.body
  if (!title) return res.status(400).json({ error: '标题不能为空' })
  const tutorial = db.tutorials.create({ title, description: description || '', order, status })
  res.status(201).json(tutorial)
})

// 管理：更新教程
adminRouter.put('/:id', requireAuth, (req, res) => {
  const tutorial = db.tutorials.findById(Number(req.params.id))
  if (!tutorial) return res.status(404).json({ error: '教程不存在' })
  const { title, description, order, status } = req.body
  const updated = db.tutorials.update(tutorial.id, {
    title: title ?? tutorial.title,
    description: description ?? tutorial.description,
    order: order ?? tutorial.order,
    status: status ?? tutorial.status,
  })
  res.json(updated)
})

// 管理：删除教程
adminRouter.delete('/:id', requireAuth, (req, res) => {
  const ok = db.tutorials.delete(Number(req.params.id))
  if (!ok) return res.status(404).json({ error: '教程不存在' })
  // 同时删除章节
  db.tutorialChapters.findAll({ tutorial_id: Number(req.params.id) }).forEach(ch => {
    db.tutorialChapters.delete(ch.id)
  })
  res.json({ success: true })
})

// 管理：创建章节
adminRouter.post('/:id/chapters', requireAuth, (req, res) => {
  const tutorial = db.tutorials.findById(Number(req.params.id))
  if (!tutorial) return res.status(404).json({ error: '教程不存在' })
  const { title, content, order = 0, status = 'draft' } = req.body
  const chapter = db.tutorialChapters.create({
    tutorial_id: tutorial.id, title, content: content || '', order, status,
  })
  res.status(201).json(chapter)
})

// 管理：更新章节
adminRouter.put('/chapters/:chapterId', requireAuth, (req, res) => {
  const chapter = db.tutorialChapters.findById(Number(req.params.chapterId))
  if (!chapter) return res.status(404).json({ error: '章节不存在' })
  const { title, content, order, status } = req.body
  const updated = db.tutorialChapters.update(chapter.id, {
    title: title ?? chapter.title,
    content: content ?? chapter.content,
    order: order ?? chapter.order,
    status: status ?? chapter.status,
  })
  res.json(updated)
})

// 管理：删除章节
adminRouter.delete('/chapters/:chapterId', requireAuth, (req, res) => {
  const ok = db.tutorialChapters.delete(Number(req.params.chapterId))
  if (!ok) return res.status(404).json({ error: '章节不存在' })
  res.json({ success: true })
})

export default { publicRouter, adminRouter }
