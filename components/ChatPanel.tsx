export default function ChatPanel() {
  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <h4>创作助手</h4>
          <p>AI 正在为你生成分镜和场景</p>
        </div>
        <button className="tool primary">AI 识别</button>
      </div>
      <div className="chat-window">
        <div className="msg bot">
          我已经完成这一轮更新，本轮主要修改了 分镜 7。目前版本共 10 个分镜，预计 102 秒。你可以先看中间预览，不满意再继续细调。
        </div>
        <div className="msg user">请帮我把第一段改成更科技感的视觉效果。</div>
      </div>
      <div className="chat-input">
        <input placeholder="描述你想要的修改，例如：调整配色、修改文案、增加数据图表..." />
        <button className="btn-primary">发送</button>
      </div>
    </div>
  )
}
