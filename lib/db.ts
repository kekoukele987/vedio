import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_video',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
})

export default pool

// ==================== Project ====================

export async function getProject(uuid: string) {
  const [rows] = await pool.query(
    'SELECT uuid, title, type, storyboard_outline, video_source, created_at, updated_at FROM project WHERE uuid = ?',
    [uuid],
  ) as any[]
  return rows.length ? rows[0] : null
}

export async function deleteProject(uuid: string) {
  // 先删除关联消息，再删除项目
  await pool.query('DELETE FROM message WHERE project_uuid = ?', [uuid])
  await pool.query('DELETE FROM project WHERE uuid = ?', [uuid])
}

// ==================== Message ====================

export async function getMessages(projectUuid: string) {
  const [rows] = await pool.query(
    'SELECT id, project_uuid, role, content, created_at FROM message WHERE project_uuid = ? ORDER BY created_at ASC',
    [projectUuid],
  ) as any[]
  return rows
}

export async function addMessage(projectUuid: string, role: string, content: string) {
  const [result] = await pool.query(
    'INSERT INTO message (project_uuid, role, content) VALUES (?, ?, ?)',
    [projectUuid, role, content],
  ) as any
  return {
    id: result.insertId,
    project_uuid: projectUuid,
    role,
    content,
    created_at: new Date().toISOString(),
  }
}
