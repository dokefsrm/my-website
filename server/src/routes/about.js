import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import db from '../db/index.js'

const publicRouter = Router()
const adminRouter = Router()

// 公开：获取关于信息
publicRouter.get('/', (req, res) => {
  const about = db.about.findAll()[0] || {
    name: '', bio: '', skills: [], social: {}, avatar_url: '',
  }
  res.json(about)
})

// 管理：更新关于信息
adminRouter.put('/', requireAuth, (req, res) => {
  let about = db.about.findAll()[0]
  const { name, bio, skills, social, avatar_url } = req.body

  if (!about) {
    about = db.about.create({
      name: name || '', bio: bio || '', skills: skills || [],
      social: social || {}, avatar_url: avatar_url || '',
    })
  } else {
    about = db.about.update(about.id, {
      name: name ?? about.name,
      bio: bio ?? about.bio,
      skills: skills ?? about.skills,
      social: social ?? about.social,
      avatar_url: avatar_url ?? about.avatar_url,
    })
  }
  res.json(about)
})

export default { publicRouter, adminRouter }
