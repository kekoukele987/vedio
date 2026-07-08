import type { NextApiRequest, NextApiResponse } from 'next'
import { getMessages, addMessage } from '../../../../lib/db'
import { analyzeIntent, handleIntent } from '../../../../lib/ai'

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
    const { content } = req.body || {}
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'content is required' })
    }

    // 1. 保存用户消息到数据库
    const userMsg = await addMessage(uuid, 'user', content)

    // 2. 调用 AI 进行意图分析
    let botContent: string
    try {
      const intentResult = await analyzeIntent(content)
      console.log('[intentAnalysis] action:', intentResult.action, '| reason:', intentResult.reason)
      botContent = handleIntent(intentResult)
    } catch (err: any) {
      console.error('[intentAnalysis] AI call failed:', err.message)
      // AI 调用失败时的兜底回复
      botContent = '抱歉，AI 服务暂时不可用，请稍后再试。'
    }

    // 3. 保存系统回复到数据库
    const botMsg = await addMessage(uuid, 'bot', botContent)

    // 4. 返回两条消息
    return res.status(201).json({ userMessage: userMsg, botMessage: botMsg })
  } catch (err: any) {
    console.error('[addMessage]', err)
    return res.status(500).json({ error: 'Failed to process message' })
  }
}
