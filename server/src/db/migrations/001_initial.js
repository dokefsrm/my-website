export function up(knex) {
  return knex.schema
    // 用户表
    .createTable('users', t => {
      t.increments('id')
      t.string('username', 50).notNullable().unique()
      t.string('password_hash', 255).notNullable()
      t.string('nickname', 50).defaultTo('')
      t.string('avatar', 500).defaultTo('')
      t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    // 文章表
    .createTable('posts', t => {
      t.increments('id')
      t.string('title', 200).notNullable()
      t.text('content').defaultTo('')
      t.string('excerpt', 500).defaultTo('')
      t.string('cover', 500).defaultTo('')
      t.json('tags').defaultTo('[]')
      t.string('status', 20).defaultTo('draft') // draft | published
      t.integer('author_id').unsigned().references('id').inTable('users')
      t.timestamp('created_at').defaultTo(knex.fn.now())
      t.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    // 教程系列
    .createTable('tutorials', t => {
      t.increments('id')
      t.string('title', 200).notNullable()
      t.text('description').defaultTo('')
      t.integer('order').defaultTo(0)
      t.string('status', 20).defaultTo('draft')
      t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    // 教程章节
    .createTable('tutorial_chapters', t => {
      t.increments('id')
      t.integer('tutorial_id').unsigned().references('id').inTable('tutorials').onDelete('CASCADE')
      t.string('title', 200).notNullable()
      t.text('content').defaultTo('')
      t.integer('order').defaultTo(0)
      t.string('status', 20).defaultTo('draft')
      t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    // 资源
    .createTable('resources', t => {
      t.increments('id')
      t.string('title', 200).notNullable()
      t.string('url', 500).defaultTo('')
      t.string('category', 50).defaultTo('工具')
      t.json('tags').defaultTo('[]')
      t.text('description').defaultTo('')
      t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    // 关于页信息
    .createTable('about', t => {
      t.increments('id')
      t.string('name', 100).defaultTo('')
      t.text('bio').defaultTo('')
      t.json('skills').defaultTo('[]')
      t.json('social').defaultTo('{}')
      t.text('avatar_url').defaultTo('')
      t.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('tutorial_chapters')
    .dropTableIfExists('tutorials')
    .dropTableIfExists('posts')
    .dropTableIfExists('resources')
    .dropTableIfExists('about')
    .dropTableIfExists('users')
}
