import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

import { runSeed } from './db/seed.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import tutorialRoutes from './routes/tutorials.js'
import resourceRoutes from './routes/resources.js'
import uploadRoutes from './routes/upload.js'
import aboutRoutes from './routes/about.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// 静态文件（上传的图片）
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// 公开 API
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes.publicRouter)
app.use('/api/tutorials', tutorialRoutes.publicRouter)
app.use('/api/resources', resourceRoutes.publicRouter)
app.use('/api/about', aboutRoutes.publicRouter)

// 管理 API（需认证）
app.use('/api/admin/posts', postRoutes.adminRouter)
app.use('/api/admin/tutorials', tutorialRoutes.adminRouter)
app.use('/api/admin/resources', resourceRoutes.adminRouter)
app.use('/api/admin/about', aboutRoutes.adminRouter)
app.use('/api/admin/upload', uploadRoutes)

// 生产环境：托管前端静态文件
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
  app.use(express.static(clientDist))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : '服务器错误',
  })
})

app.listen(PORT, async () => {
  await runSeed()
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`)
})
