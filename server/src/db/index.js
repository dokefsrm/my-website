import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', '..', 'data')

// 确保数据目录存在
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

class JsonStore {
  constructor(filename) {
    this.filepath = path.join(DATA_DIR, filename)
    this.data = this._load()
  }

  _load() {
    try {
      if (existsSync(this.filepath)) {
        return JSON.parse(readFileSync(this.filepath, 'utf-8'))
      }
    } catch { /* ignore */ }
    return { items: [], nextId: 1 }
  }

  _save() {
    writeFileSync(this.filepath, JSON.stringify(this.data, null, 2), 'utf-8')
  }

  // 查询所有（支持过滤和排序）
  findAll(filter = {}, options = {}) {
    let items = [...this.data.items]
    for (const [key, val] of Object.entries(filter)) {
      if (val !== undefined && val !== null) {
        items = items.filter(item => item[key] === val)
      }
    }
    if (options.orderBy) {
      items.sort((a, b) => {
        const aVal = a[options.orderBy] ?? ''
        const bVal = b[options.orderBy] ?? ''
        return options.order === 'asc' ? (aVal > bVal ? 1 : -1) : (bVal > aVal ? 1 : -1)
      })
    }
    if (options.limit) {
      const offset = options.offset || 0
      items = items.slice(offset, offset + options.limit)
    }
    return items
  }

  // 计数
  count(filter = {}) {
    let items = [...this.data.items]
    for (const [key, val] of Object.entries(filter)) {
      if (val !== undefined && val !== null) {
        items = items.filter(item => item[key] === val)
      }
    }
    return items.length
  }

  // 根据 ID 查找
  findById(id) {
    return this.data.items.find(item => item.id === id) || null
  }

  // 根据条件查找一条
  findOne(filter) {
    return this.data.items.find(item => {
      return Object.entries(filter).every(([key, val]) => item[key] === val)
    }) || null
  }

  // 创建
  create(record) {
    const item = { id: this.data.nextId++, ...record, created_at: new Date().toISOString() }
    if (item.updated_at === undefined) item.updated_at = item.created_at
    this.data.items.push(item)
    this._save()
    return item
  }

  // 更新
  update(id, updates) {
    const idx = this.data.items.findIndex(item => item.id === id)
    if (idx === -1) return null
    this.data.items[idx] = { ...this.data.items[idx], ...updates, updated_at: new Date().toISOString() }
    this._save()
    return this.data.items[idx]
  }

  // 删除
  delete(id) {
    const idx = this.data.items.findIndex(item => item.id === id)
    if (idx === -1) return false
    this.data.items.splice(idx, 1)
    this._save()
    return true
  }
}

// 各表实例
const db = {
  users: new JsonStore('users.json'),
  posts: new JsonStore('posts.json'),
  tutorials: new JsonStore('tutorials.json'),
  tutorialChapters: new JsonStore('tutorial_chapters.json'),
  resources: new JsonStore('resources.json'),
  about: new JsonStore('about.json'),
}

// 初始化种子数据
export function initSeedData() {
  // 只在数据为空时初始化
  if (db.users.count() === 0) {
    console.log('Seeding initial data...')
    // 用户
    db.users.create({ username: 'dokefsrm', password_hash: '', nickname: 'dokefsrm', avatar: '' })
    // 通过 seed 模块设置密码
  }
}

export default db
