import { useEffect, useState } from 'react'

type Message = {
  id: string
  role: 'user' | 'system'
  content: string
}

export default function ChatPanel({ projectId, messages, onMessagesChange }: { projectId?: string | null; messages?: Message[]; onMessagesChange?: (m: Message[]) => void }) {
  const [input, setInput] = useState('')

  useEffect(() => {
    // noop
  }, [projectId])

  async function handleSend() {
    if (!input || !projectId) return
    // call intent API
    const res = await fetch('/api/intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId, prompt: input }) })
    const data = await res.json()
    // refresh messages
    const msgsRes = await fetch(`/api/project/${projectId}/messages`)
    const msgsData = await msgsRes.json()
    onMessagesChange?.(msgsData.messages || [])
    setInput('')
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
      <div className="chat-input">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="描述你想要的修改，例如：调整配色、修改文案、增加数据图表..." />
        <button className="btn-primary" onClick={handleSend}>发送</button>
      </div>
    </div>
  )
}
