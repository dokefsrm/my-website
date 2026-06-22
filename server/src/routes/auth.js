import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: '请输入用户名和密码' })
    }

    const user = db.users.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const payload = { id: user.id, username: user.username, nickname: user.nickname }
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' })
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: '登录失败' })
  }
})

// 刷新 Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ error: '缺少 refreshToken' })
    }
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
    const newAccessToken = jwt.sign(
      { id: payload.id, username: payload.username, nickname: payload.nickname },
      JWT_SECRET,
      { expiresIn: '2h' }
    )
    res.json({ accessToken: newAccessToken })
  } catch {
    res.status(401).json({ error: 'refreshToken 无效或已过期' })
  }
})

// 获取当前用户
router.get('/me', (req, res) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.json({ user: null })
  }
  try {
    const payload = jwt.verify(header.split(' ')[1], JWT_SECRET)
    const user = db.users.findById(payload.id)
    if (!user) return res.json({ user: null })
    res.json({
      user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar },
    })
  } catch {
    res.json({ user: null })
  }
})

export default router
