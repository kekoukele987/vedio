import type { NextApiRequest, NextApiResponse } from 'next'
import { initDb, getProjects } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initDb()

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const projects = await getProjects()
  return res.status(200).json({ projects })
}
