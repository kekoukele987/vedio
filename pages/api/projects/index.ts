import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'GET':
      return listProjects(req, res)
    case 'POST':
      return createProject(req, res)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function listProjects(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const [rows] = await pool.query(
      'SELECT uuid, title, type, created_at, updated_at FROM project ORDER BY created_at DESC',
    )
    return res.status(200).json(rows)
  } catch (err: any) {
    console.error('[listProjects]', err)
    return res.status(500).json({ error: 'Failed to list projects' })
  }
}

function generateUUID(): string {
  // crypto.randomUUID is available in Node 19+
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback: simple v4-like UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function createProject(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, type } = req.body || {}

    if (!title || !type) {
      return res.status(400).json({ error: 'title and type are required' })
    }

    if (!['image', 'html'].includes(type)) {
      return res.status(400).json({ error: 'type must be "image" or "html"' })
    }

    const uuid = generateUUID()

    await pool.query(
      `INSERT INTO project (uuid, title, type) VALUES (?, ?, ?)`,
      [uuid, title, type],
    )

    // Fetch the newly created row to get server-generated timestamps
    const [rows] = await pool.query(
      'SELECT uuid, title, type, storyboard_outline, video_source, created_at, updated_at FROM project WHERE uuid = ?',
      [uuid],
    ) as any[]

    return res.status(201).json(rows[0])
  } catch (err: any) {
    console.error('[createProject]', err)
    return res.status(500).json({ error: 'Failed to create project' })
  }
}
