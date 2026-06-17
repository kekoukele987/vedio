import type { NextApiRequest, NextApiResponse } from 'next'
import { addMessage } from '../../lib/db'

type IntentResponse = {
  action: string
  reason: string
  extra?: any
}

const SYSTEM_PROMPT = `你是一个视频创作智能体，现在需要对用户输入的指令进行研判，分析用户的行为属于以下哪种情况，并给出理由，以结构化的JSON形式返回。返回格式示例：\n{\n  "action": "generate_outline",\n  "reason": "用户要求创作完整视频脚本，包含场景与对白。",\n  "extra": {"exampleField": "value"}\n}\naction 可能值：generate_outline, regenerate_outline, add_shot, delete_shot, regenerate_shot, other`

function validateIntent(obj: any): obj is IntentResponse {
  return obj && typeof obj.action === 'string' && typeof obj.reason === 'string'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { projectId, prompt } = req.body as { projectId?: string; prompt?: string }
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL || 'gemini-3-flash-preview'

  if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY in env' })

  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    max_tokens: 512,
    temperature: 0
  }

  try {
    const r = await (globalThis.fetch)(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body)
    })
    const data = await r.json()
    const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ''

    let parsed: any = null
    try {
      parsed = JSON.parse(text)
    } catch (err) {
      console.error('Intent parse error', err, text)
      // log and return error
      await addMessage(projectId || 'unknown', 'system', `意图解析失败：${String(err)}`)
      return res.status(500).json({ error: 'Intent parse error', raw: text })
    }

    if (!validateIntent(parsed)) {
      console.error('Intent validation failed', parsed)
      await addMessage(projectId || 'unknown', 'system', `意图验证失败: ${JSON.stringify(parsed)}`)
      return res.status(500).json({ error: 'Intent validation failed', parsed })
    }

    // For now, respond with a simple system message depending on action
    const action = parsed.action
    let reply = ''
    switch (action) {
      case 'generate_outline':
        reply = '收到：生成视频大纲，正在准备示例大纲...'
        break
      case 'regenerate_outline':
        reply = '收到：重新生成视频大纲，正在根据要求调整...'
        break
      case 'add_shot':
        reply = '收到：新增分镜，已在分镜列表末尾创建占位项。'
        break
      case 'delete_shot':
        reply = '收到：删除分镜，已标记对应分镜为删除。'
        break
      case 'regenerate_shot':
        reply = '收到：重新生成指定分镜，正在替换内容...'
        break
      default:
        reply = '无法识别的指令或当前不支持的操作。'
    }

    if (projectId) {
      await addMessage(projectId, 'user', prompt)
      await addMessage(projectId, 'system', reply)
    }

    return res.status(200).json({ intent: parsed, reply })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Model call failed' })
  }
}
