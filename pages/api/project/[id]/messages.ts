import type { NextApiRequest, NextApiResponse } from 'next'
import { initDb, getMessages, addMessage } from '../../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initDb()

  const { id } = req.query as { id: string }
  if (req.method === 'GET') {
    const messages = await getMessages(id)
    return res.status(200).json({ messages })
  }

  if (req.method === 'POST') {
    const { role, content } = req.body as { role: 'user' | 'system'; content: string }
    if (!role || !content) return res.status(400).json({ error: 'Missing role or content' })
    const msg = await addMessage(id, role, content)
    return res.status(201).json({ message: msg })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
