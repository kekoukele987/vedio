import type { NextApiRequest, NextApiResponse } from 'next'
import { getMessages, addMessage } from '../../../../lib/db'

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
      return list(req, res, uuid)
    case 'POST':
      return create(req, res, uuid)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function list(_req: NextApiRequest, res: NextApiResponse, uuid: string) {
  try {
    const messages = await getMessages(uuid)
    return res.status(200).json({ messages })
  } catch (err: any) {
    console.error('[getMessages]', err)
    return res.status(500).json({ error: 'Failed to get messages' })
  }
}

async function create(req: NextApiRequest, res: NextApiResponse, uuid: string) {
  try {
    const { role, content } = req.body || {}
    if (!role || !content) {
      return res.status(400).json({ error: 'role and content are required' })
    }

    const message = await addMessage(uuid, role, content)
    return res.status(201).json({ message })
  } catch (err: any) {
    console.error('[addMessage]', err)
    return res.status(500).json({ error: 'Failed to add message' })
  }
}
