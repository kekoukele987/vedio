import { useState, useEffect, useRef } from 'react'
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react'

type Message = {
  id: number
  role: 'user' | 'bot'
  content: string
  created_at?: string
}

const suggestions = [
  '制作一个产品宣传视频',
  '生成节日祝福动画',
  '创建一个教学演示视频',
]

type Props = {
  projectId?: string
}

export default function ChatPanel({ projectId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 当 projectId 变化时加载历史消息
  useEffect(() => {
    if (projectId) {
      loadHistory(projectId)
    } else {
      setMessages([])
    }
  }, [projectId])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadHistory = async (pid: string) => {
    // 防御：非法的 projectId 不发请求
    if (!pid || pid === 'undefined' || pid.length < 10) {
      setMessages([{ id: 0, role: 'bot', content: '你好！我是 AI 创作助手，请输入提示词开始创作视频。' }])
      return
    }
    setLoadingHistory(true)
    try {
      const resp = await fetch(`/api/project/${pid}/messages`)
      if (resp.ok) {
        const data = await resp.json()
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages)
          return
        }
      }
    } catch (err) {
      console.error('[ChatPanel] Failed to load history:', err)
    } finally {
      setLoadingHistory(false)
    }

    // 无历史消息时显示欢迎语
    setMessages([
      {
        id: 0,
        role: 'bot',
        content: '你好！我是 AI 创作助手，请输入提示词开始创作视频。我会帮你完成脚本生成、分镜拆分、画面生成等全流程。',
      },
    ])
  }

  const sendMsg = async () => {
    const trimmed = input.trim()
    if (!trimmed || sending || !projectId) return

    setSending(true)
    const userInput = trimmed
    setInput('')

    // 乐观更新：先显示用户消息
    const tempUserMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: userInput,
    }
    setMessages((prev) => [...prev, tempUserMsg])

    try {
      const resp = await fetch(`/api/project/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userInput }),
      })

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}))
        throw new Error((errData as any).error || `HTTP ${resp.status}`)
      }

      const data = await resp.json()
      // 用服务器返回的真实消息替换临时消息
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMsg.id)
        return [...filtered, data.userMessage, data.botMessage]
      })
    } catch (err: any) {
      // 发送失败：移除临时用户消息，显示错误
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMsg.id)
        return [
          ...filtered,
          {
            id: Date.now() + 1,
            role: 'bot',
            content: '抱歉，消息发送失败：' + (err.message || '未知错误'),
          },
        ]
      })
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMsg()
    }
  }

  const isWelcome = messages.length <= 1

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <h4>
          <Sparkles size={16} />
          AI 创作助手
          <span className="dot" />
        </h4>
      </div>

      <div className="chat-messages">
        {/* 加载历史 */}
        {loadingHistory && (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
            <Loader2 size={24} className="spin-icon" />
            <p style={{ fontSize: 13, marginTop: 8 }}>加载历史消息…</p>
          </div>
        )}

        {/* 消息列表 */}
        {!loadingHistory &&
          messages.map((msg) => (
            <div key={msg.id} className={`chat-msg ${msg.role}`}>
              <div className={`chat-msg-avatar ${msg.role}`}>
                {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div>
                <div className="chat-msg-bubble">{msg.content}</div>
              </div>
            </div>
          ))}

        {/* 发送中指示器 */}
        {sending && (
          <div className="chat-msg bot">
            <div className="chat-msg-avatar bot">
              <Bot size={16} />
            </div>
            <div>
              <div className="chat-msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={14} className="spin-icon" />
                正在分析…
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* 欢迎提示 */}
        {!loadingHistory && isWelcome && !sending && (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">
              <Sparkles size={24} />
            </div>
            <h5>试试这些</h5>
            <p>点击下方提示词快速开始</p>
          </div>
        )}
      </div>

      {/* 快捷建议按钮 */}
      {!loadingHistory && isWelcome && (
        <div style={{ padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="tool-btn"
              style={{ fontSize: 12 }}
              onClick={() => setInput(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            projectId
              ? '输入提示词或与 AI 对话…'
              : '请先选择或创建一个项目'
          }
          disabled={!projectId || sending}
        />
        <button
          className="chat-send-btn"
          onClick={sendMsg}
          title="发送"
          disabled={!projectId || sending || !input.trim()}
        >
          {sending ? <Loader2 size={16} className="spin-icon" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  )
}
