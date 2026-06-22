import knex from 'knex'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, '..', '..', 'data.db'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
  },
  production: {
    client: process.env.DB_CLIENT || 'better-sqlite3',
    connection: process.env.DATABASE_URL || {
      filename: path.join(__dirname, '..', '..', 'data.db'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
  },
}

const env = process.env.NODE_ENV || 'development'
const db = knex(config[env])

export default db
export { config }
