import bcrypt from 'bcryptjs'

export async function seed(knex) {
  // 创建默认管理员
  const hash = await bcrypt.hash('admin123', 10)
  await knex('users').del()
  await knex('users').insert({
    username: 'dokefsrm',
    password_hash: hash,
    nickname: 'dokefsrm',
    avatar: '',
  })

  // 插入示例文章
  await knex('posts').del()
  await knex('posts').insert([
    {
      title: '欢迎来到我的网站',
      content: '<p>这是我的<strong>第一篇文章</strong>。网站刚刚上线，后续会持续更新技术文章、教程和资源分享。</p><p>感谢访问！ 🚀</p>',
      excerpt: '网站上线第一篇文章，介绍本站内容和计划',
      tags: JSON.stringify(['公告']),
      status: 'published',
      author_id: 1,
    },
    {
      title: '如何高效学习一门新技术',
      content: '<h2>5 步学习法</h2><ol><li><strong>明确目标</strong> — 搞清楚 Why/What/How</li><li><strong>看官方文档</strong> — 第一手信息来源</li><li><strong>最小可行项目</strong> — 边做边学</li><li><strong>教给别人</strong> — 费曼学习法</li><li><strong>持续迭代</strong> — 小步快跑</li></ol>',
      excerpt: '在信息爆炸的时代，掌握高效学习方法比掌握具体技术更重要',
      tags: JSON.stringify(['学习方法', '效率']),
      status: 'published',
      author_id: 1,
    },
  ])

  // 示例教程
  await knex('tutorials').del()
  await knex('tutorial_chapters').del()
  const [tutorial] = await knex('tutorials').insert({
    title: 'Vue 3 基础入门',
    description: '从零开始学习 Vue 3，适合有 HTML/CSS/JS 基础的初学者',
    order: 1,
    status: 'published',
  }).returning('id')

  await knex('tutorial_chapters').insert([
    { tutorial_id: tutorial.id, title: '初识 Vue', content: '<p>Vue 是一套用于构建用户界面的<strong>渐进式</strong> JavaScript 框架。</p><h2>环境搭建</h2><pre><code>npm create vue@latest</code></pre>', order: 1, status: 'published' },
    { tutorial_id: tutorial.id, title: '组件基础', content: '<p>组件是 Vue 的<strong>核心设计单元</strong>。</p><h2>单文件组件</h2><p>每个 .vue 文件就是一个组件。</p>', order: 2, status: 'published' },
  ])

  // 示例资源
  await knex('resources').del()
  await knex('resources').insert([
    { title: 'VS Code', url: 'https://code.visualstudio.com/', category: '工具', tags: JSON.stringify(['免费', '编辑器']), description: '最流行的开源代码编辑器' },
    { title: 'Obsidian', url: 'https://obsidian.md/', category: '工具', tags: JSON.stringify(['免费', '笔记']), description: '本地优先的 Markdown 笔记工具' },
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', category: '网站', tags: JSON.stringify(['免费', '文档']), description: '最权威的 Web 技术文档' },
    { title: 'JavaScript 高级程序设计', url: 'https://book.douban.com/subject/35175321/', category: '书籍', tags: JSON.stringify(['JavaScript', '经典']), description: '前端必读经典「红宝书」' },
  ])

  // 关于信息
  await knex('about').del()
  await knex('about').insert({
    name: 'dokefsrm',
    bio: '一名热爱技术的开发者，专注于前端开发和技术写作。这里记录我的学习历程和心得分享。',
    skills: JSON.stringify(['JavaScript', 'Vue', 'Node.js', 'Git', 'Docker']),
    social: JSON.stringify({ github: 'https://github.com/dokefsrm', email: '3447566617@qq.com' }),
    avatar_url: '',
  })
}
