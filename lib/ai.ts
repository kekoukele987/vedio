/**
 * AI 服务模块 — 通过 OpenAI 兼容接口调用大模型进行意图分析。
 */

const BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1'
const API_KEY = process.env.AI_API_KEY || ''
const MODEL = process.env.AI_MODEL || 'gemini-3-flash-preview'

/** 意图分析返回的 action 类型 */
export type IntentAction =
  | 'generate_outline'
  | 'regenerate_outline'
  | 'add_storyboard'
  | 'delete_storyboard'
  | 'regenerate_storyboard'
  | 'unsupported'

/** AI 意图分析结果 */
export interface IntentResult {
  action: IntentAction
  reason: string
}

/** 意图处理器：根据 action 返回对应的响应文本 */
const intentHandlers: Record<IntentAction, (reason: string) => string> = {
  generate_outline: (reason) =>
    `[生成视频大纲] 正在为您生成完整的视频脚本与分镜拆分列表…\n\n分析理由：${reason}`,
  regenerate_outline: (reason) =>
    `[重新生成视频大纲] 正在根据您的反馈重新生成视频大纲与分镜…\n\n分析理由：${reason}`,
  add_storyboard: (reason) =>
    `[新增分镜] 正在为您新增一个分镜…\n\n分析理由：${reason}`,
  delete_storyboard: (reason) =>
    `[删除分镜] 正在为您删除指定的分镜…\n\n分析理由：${reason}`,
  regenerate_storyboard: (reason) =>
    `[重新生成分镜] 正在为您重新生成该分镜的画面与脚本…\n\n分析理由：${reason}`,
  unsupported: (reason) =>
    `[不支持的指令] 抱歉，您输入的指令暂不支持。请尝试描述您想创作的视频内容，或对已有分镜进行操作（如新增、删除、重新生成）。\n\n分析理由：${reason}`,
}

/** 处理意图并返回响应文本 */
export function handleIntent(result: IntentResult): string {
  const handler = intentHandlers[result.action]
  return handler(result.reason)
}

/** 系统提示词：用于意图分析 */
const SYSTEM_PROMPT = `你是一个视频创作智能体。现在需要对用户输入的指令进行研判，分析用户的行为属于以下哪种情况，并给出理由。

可能的 action 值：
- "generate_outline"：用户想要创作一个视频，或直接给出一段视频脚本，需要生成完整的视频大纲（包含完整脚本、分镜拆分列表）
- "regenerate_outline"：用户对当前大纲不满意，要求重新生成
- "add_storyboard"：用户要求在现有分镜基础上新增一个分镜
- "delete_storyboard"：用户要求删除某个分镜
- "regenerate_storyboard"：用户要求重新生成某个分镜
- "unsupported"：其他不支持的指令

请以结构化 JSON 形式返回，格式如下：
{"action": "generate_outline", "reason": "用户想要创作一个产品宣传视频，需要生成完整视频大纲和分镜脚本"}

注意：
1. 仅返回 JSON，不要包含其他文字
2. reason 字段用简洁的语言说明判断依据
3. 如果用户输入模糊但有创作意图（如"做个视频"、"帮我做个宣传片"），应归类为 generate_outline`

/**
 * 调用 AI 大模型进行意图分析。
 * 使用 OpenAI 兼容接口（支持自定义 baseUrl）。
 */
export async function analyzeIntent(userMessage: string): Promise<IntentResult> {
  const url = `${BASE_URL}/chat/completions`

  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 512,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`AI API error (${response.status}): ${errText}`)
  }

  const data: any = await response.json()
  const content: string = data?.choices?.[0]?.message?.content || ''

  // 尝试从 AI 返回内容中提取 JSON
  const result = parseIntentJSON(content)

  // 校验 action 合法性
  const validActions: string[] = [
    'generate_outline',
    'regenerate_outline',
    'add_storyboard',
    'delete_storyboard',
    'regenerate_storyboard',
    'unsupported',
  ]
  if (!validActions.includes(result.action)) {
    console.error('[analyzeIntent] Invalid action from AI:', result.action, '| raw content:', content)
    // 兜底：归类为 unsupported
    return { action: 'unsupported', reason: `无法识别的意图类型: ${result.action}` }
  }

  return result as IntentResult
}

/**
 * 从 AI 返回的文本中解析 JSON。
 * 处理 AI 可能包裹在 markdown 代码块中的情况。
 */
function parseIntentJSON(raw: string): { action: string; reason: string } {
  // 去除可能的 markdown 代码块包裹
  let jsonStr = raw.trim()
  if (jsonStr.startsWith('```')) {
    const end = jsonStr.lastIndexOf('```')
    if (end > 3) {
      jsonStr = jsonStr.slice(jsonStr.indexOf('\n') + 1, end).trim()
    }
  }

  try {
    const parsed = JSON.parse(jsonStr)
    if (parsed && typeof parsed.action === 'string' && typeof parsed.reason === 'string') {
      return parsed
    }
  } catch {
    // JSON 解析失败，尝试正则提取
    const actionMatch = jsonStr.match(/"action"\s*:\s*"([^"]+)"/)
    const reasonMatch = jsonStr.match(/"reason"\s*:\s*"([^"]+)"/)
    if (actionMatch && reasonMatch) {
      return { action: actionMatch[1], reason: reasonMatch[1] }
    }
    console.error('[parseIntentJSON] JSON parse error, raw:', raw)
    throw new Error('Failed to parse AI response as JSON')
  }

  console.error('[parseIntentJSON] Missing required fields, raw:', raw)
  throw new Error('AI response missing action or reason fields')
}
