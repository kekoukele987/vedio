import type { NextApiRequest, NextApiResponse } from 'next'
import { getProject, deleteProject } from '../../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { uuid } = req.query

  if (!uuid || typeof uuid !== 'string') {
    return res.status(400).json({ error: 'uuid is required' })
  }

  switch (req.method) {
    case 'GET':
      return get(req, res, uuid)
    case 'DELETE':
      return del(req, res, uuid)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function get(_req: NextApiRequest, res: NextApiResponse, uuid: string) {
  try {
    const project = await getProject(uuid)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    return res.status(200).json({ project })
  } catch (err: any) {
    console.error('[getProject]', err)
    return res.status(500).json({ error: 'Failed to get project' })
  }
}

async function del(_req: NextApiRequest, res: NextApiResponse, uuid: string) {
  try {
    await deleteProject(uuid)
    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('[deleteProject]', err)
    return res.status(500).json({ error: 'Failed to delete project' })
  }
}
