export default function ChatPanel() {
  return (
    <div className="chat-panel">
      <h4>AI 对话</h4>
      <div className="chat-window">
        <div className="msg bot">你好！请输入提示词开始创作。</div>
      </div>
      <div className="chat-input">
        <input placeholder="输入提示词或与 AI 对话" />
        <button>发送</button>
      </div>
    </div>
  )
}
