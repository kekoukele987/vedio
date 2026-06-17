import type { NextApiRequest, NextApiResponse } from 'next'
import { getProjects, createProject } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const projects = await getProjects()
    return res.status(200).json({ projects })
  }

  if (req.method === 'POST') {
    const { title, type } = req.body as { title?: string; type?: string }
    if (!title || !type) {
      return res.status(400).json({ error: 'Missing title or type' })
    }
    const project = await createProject({ title, type })
    return res.status(201).json({ project })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
