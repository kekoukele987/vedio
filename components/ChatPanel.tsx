import { useState } from 'react'
import { Send, Sparkles, Bot, User } from 'lucide-react'

type Message = {
  id: number
  role: 'user' | 'bot'
  text: string
  time: string
}

const suggestions = [
  '制作一个产品宣传视频',
  '生成节日祝福动画',
  '创建一个教学演示视频',
]

function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: '你好！我是 AI 创作助手，请输入提示词开始创作视频。我会帮你完成脚本生成、分镜拆分、画面生成等全流程。',
      time: nowTime(),
    },
  ])
  const [input, setInput] = useState('')

  const sendMsg = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      time: nowTime(),
    }

    const botMsg: Message = {
      id: Date.now() + 1,
      role: 'bot',
      text: '收到你的需求！正在分析并生成视频脚本…（此处为 UI 占位，后续将接入 AI 创作逻辑）',
      time: nowTime(),
    }

    setMessages((prev) => [...prev, userMsg, botMsg])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMsg()
    }
  }

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
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-msg ${msg.role}`}>
            <div className={`chat-msg-avatar ${msg.role}`}>
              {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div>
              <div className="chat-msg-bubble">{msg.text}</div>
              <div className="chat-msg-time">{msg.time}</div>
            </div>
          </div>
        ))}

        {messages.length <= 1 && (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">
              <Sparkles size={24} />
            </div>
            <h5>试试这些</h5>
            <p>点击下方提示词快速开始</p>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
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
          placeholder="输入提示词或与 AI 对话…"
        />
        <button className="chat-send-btn" onClick={sendMsg} title="发送">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
