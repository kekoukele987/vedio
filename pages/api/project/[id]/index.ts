import type { NextApiRequest, NextApiResponse } from 'next'
import { initDb, deleteProject } from '../../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initDb()

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing id' })
  }

  await deleteProject(id)
  return res.status(200).json({ success: true })
}
