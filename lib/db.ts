import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const dataDir = join(process.cwd(), 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir)
}

let SQL: SqlJsStatic | null = null
let db: SqlJsDatabase | null = null
const DB_FILE = join(dataDir, 'projects.db')

function loadDbFromDisk(): Uint8Array | null {
  try {
    if (!existsSync(DB_FILE)) return null
    return readFileSync(DB_FILE)
  } catch (err) {
    return null
  }
}

function saveDbToDisk() {
  if (!db) return
  const data = db.export()
  writeFileSync(DB_FILE, Buffer.from(data))
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
  if (db) return
  SQL = await initSqlJs({ locateFile: file => `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${file}` })
  const fileBuffer = loadDbFromDisk()
  if (fileBuffer) {
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS project (
      uuid TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      type TEXT NOT NULL,
      outline TEXT NOT NULL DEFAULT '',
      sourceCode TEXT NOT NULL DEFAULT ''
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS message (
      id TEXT PRIMARY KEY,
      projectUuid TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(projectUuid) REFERENCES project(uuid)
    )
  `)

  saveDbToDisk()
}

export async function getProjects(): Promise<Project[]> {
  if (!db) await initDb()
  const stmt = db!.prepare('SELECT uuid, title, createdAt, type, outline, sourceCode FROM project ORDER BY createdAt DESC')
  const rows: Project[] = []
  while (stmt.step()) {
    const r = stmt.getAsObject() as any
    rows.push({
      uuid: String(r.uuid),
      title: String(r.title),
      createdAt: String(r.createdAt),
      type: String(r.type),
      outline: String(r.outline || ''),
      sourceCode: String(r.sourceCode || '')
    })
  }
  stmt.free()
  return rows
}

export async function getMessages(projectUuid: string): Promise<Message[]> {
  if (!db) await initDb()
  const stmt = db!.prepare('SELECT id, projectUuid, role, content, createdAt FROM message WHERE projectUuid = ? ORDER BY createdAt ASC')
  const rows: Message[] = []
  stmt.bind([projectUuid])
  while (stmt.step()) {
    const r = stmt.getAsObject() as any
    rows.push({
      id: String(r.id),
      projectUuid: String(r.projectUuid),
      role: String(r.role) as 'user' | 'system',
      content: String(r.content),
      createdAt: String(r.createdAt)
    })
  }
  stmt.free()
  return rows
}

export async function addMessage(projectUuid: string, role: 'user' | 'system', content: string): Promise<Message> {
  if (!db) await initDb()
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const stmt = db!.prepare('INSERT INTO message (id, projectUuid, role, content, createdAt) VALUES (?, ?, ?, ?, ?)')
  stmt.run([id, projectUuid, role, content, createdAt])
  stmt.free()
  saveDbToDisk()
  return { id, projectUuid, role, content, createdAt }
}

export async function createProject({ title, type }: { title: string; type: string }): Promise<Project> {
  if (!db) await initDb()
  const uuid = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const outline = ''
  const sourceCode = ''

  const stmt = db!.prepare('INSERT INTO project (uuid, title, createdAt, type, outline, sourceCode) VALUES (?, ?, ?, ?, ?, ?)')
  stmt.run([uuid, title, createdAt, type, outline, sourceCode])
  stmt.free()

  saveDbToDisk()

  return { uuid, title, createdAt, type, outline, sourceCode }
}
