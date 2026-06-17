import { useEffect, useState } from 'react'

type Message = {
  id: string
  role: 'user' | 'system'
  content: string
}

export default function ChatPanel({ projectId, messages, onMessagesChange }: { projectId?: string | null; messages?: Message[]; onMessagesChange?: (m: Message[]) => void }) {
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!input.trim()) return
    if (!projectId) {
      setError('项目ID未加载，请稍候')
      return
    }

    setIsSending(true)
    setError('')

    try {
      const res = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, prompt: input })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData?.error || '请求失败')
      }

      const data = await res.json()
      console.log('Intent response:', data)

      // 刷新消息列表
      const msgsRes = await fetch(`/api/project/${projectId}/messages`)
      if (!msgsRes.ok) throw new Error('获取消息失败')

      const msgsData = await msgsRes.json()
      onMessagesChange?.(msgsData.messages || [])
      setInput('')
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '发送失败'
      console.error('Chat error:', err)
      setError(errMsg)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <h4>创作助手</h4>
          <p>AI 为你分析意图并返回下一步建议</p>
        </div>
        <button className="tool primary" onClick={() => {}}>AI 识别</button>
      </div>
      <div className="chat-window">
        {messages && messages.length === 0 && <div className="msg bot">暂无消息</div>}
        {messages && messages.map((m) => (
          <div key={m.id} className={`msg ${m.role === 'user' ? 'user' : 'bot'}`}>
            {m.content}
          </div>
        ))}
      </div>
      {error && <div className="chat-error">{error}</div>}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSend()}
          placeholder="描述你想要的修改，例如：调整配色、修改文案、增加数据图表..."
          disabled={isSending || !projectId}
        />
        <button className="btn-primary" onClick={handleSend} disabled={isSending || !projectId || !input.trim()}>
          {isSending ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  )
}
