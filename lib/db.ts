import mysql from 'mysql2/promise'
import { Pool } from 'mysql2/promise'

let pool: Pool | null = null

function formatDateTime(isoString: string): string {
  return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ')
}

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ai_video',
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_POOL_MAX || '10'),
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0,
    })
  }
  return pool
}

export type Project = {
  uuid: string
  title: string
  createdAt: string
  type: string
  outline: string
  sourceCode: string
}

export type Message = {
  id: string
  projectUuid: string
  role: 'user' | 'system'
  content: string
  createdAt: string
}

export async function initDb() {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS project (
        uuid VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL,
        type VARCHAR(50) NOT NULL,
        outline LONGTEXT,
        sourceCode LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_createdAt (createdAt),
        INDEX idx_type (type)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS message (
        id VARCHAR(36) PRIMARY KEY,
        projectUuid VARCHAR(36) NOT NULL,
        role VARCHAR(20) NOT NULL,
        content LONGTEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(projectUuid) REFERENCES project(uuid) ON DELETE CASCADE,
        INDEX idx_projectUuid (projectUuid),
        INDEX idx_createdAt (createdAt)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `)
  } finally {
    connection.release()
  }
}

export async function getProjects(): Promise<Project[]> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const [rows] = await connection.query<any[]>(
      'SELECT uuid, title, createdAt, type, outline, sourceCode FROM project ORDER BY createdAt DESC'
    )

    return rows.map(r => ({
      uuid: String(r.uuid),
      title: String(r.title),
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      type: String(r.type),
      outline: String(r.outline || ''),
      sourceCode: String(r.sourceCode || '')
    }))
  } finally {
    connection.release()
  }
}

export async function getMessages(projectUuid: string): Promise<Message[]> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const [rows] = await connection.query<any[]>(
      'SELECT id, projectUuid, role, content, createdAt FROM message WHERE projectUuid = ? ORDER BY createdAt ASC',
      [projectUuid]
    )

    return rows.map(r => ({
      id: String(r.id),
      projectUuid: String(r.projectUuid),
      role: String(r.role) as 'user' | 'system',
      content: String(r.content),
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt)
    }))
  } finally {
    connection.release()
  }
}

export async function addMessage(
  projectUuid: string,
  role: 'user' | 'system',
  content: string
): Promise<Message> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const formattedCreatedAt = formatDateTime(createdAt)

    await connection.query(
      'INSERT INTO message (id, projectUuid, role, content, createdAt) VALUES (?, ?, ?, ?, ?)',
      [id, projectUuid, role, content, formattedCreatedAt]
    )

    return { id, projectUuid, role, content, createdAt }
  } finally {
    connection.release()
  }
}

export async function createProject({
  title,
  type,
}: {
  title: string
  type: string
}): Promise<Project> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const uuid = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const formattedCreatedAt = formatDateTime(createdAt)
    const outline = ''
    const sourceCode = ''

    await connection.query(
      'INSERT INTO project (uuid, title, createdAt, type, outline, sourceCode) VALUES (?, ?, ?, ?, ?, ?)',
      [uuid, title, formattedCreatedAt, type, outline, sourceCode]
    )

    return { uuid, title, createdAt, type, outline, sourceCode }
  } finally {
    connection.release()
  }
}

export async function updateProjectOutline(uuid: string, outline: string): Promise<void> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.query(
      'UPDATE project SET outline = ? WHERE uuid = ?',
      [outline, uuid]
    )
  } finally {
    connection.release()
  }
}

export async function updateProjectSourceCode(uuid: string, sourceCode: string): Promise<void> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.query(
      'UPDATE project SET sourceCode = ? WHERE uuid = ?',
      [sourceCode, uuid]
    )
  } finally {
    connection.release()
  }
}

export async function getProject(uuid: string): Promise<Project | null> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const [rows] = await connection.query<any[]>(
      'SELECT uuid, title, createdAt, type, outline, sourceCode FROM project WHERE uuid = ?',
      [uuid]
    )

    if (rows.length === 0) return null

    const r = rows[0]
    return {
      uuid: String(r.uuid),
      title: String(r.title),
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      type: String(r.type),
      outline: String(r.outline || ''),
      sourceCode: String(r.sourceCode || '')
    }
  } finally {
    connection.release()
  }
}
