import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { uuid } = req.query

  if (!uuid || typeof uuid !== 'string') {
    return res.status(400).json({ error: 'uuid is required' })
  }

  try {
    const [rows] = await pool.query(
      'SELECT uuid, title, type, storyboard_outline, video_source, created_at, updated_at FROM project WHERE uuid = ?',
      [uuid],
    ) as any[]

    if (!rows.length) {
      return res.status(404).json({ error: 'Project not found' })
    }

    return res.status(200).json(rows[0])
  } catch (err: any) {
    console.error('[getProject]', err)
    return res.status(500).json({ error: 'Failed to get project' })
  }
}
