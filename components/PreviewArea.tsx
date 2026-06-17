import StoryboardCard from './StoryboardCard'
import Toolbar from './Toolbar'

export default function PreviewArea({ mode }: { mode: string }) {
  const scenes = new Array(7).fill(0).map((_, i) => ({ id: i + 1, title: `分镜 ${i + 1}` }))

  return (
    <div className="preview-area">
      <Toolbar />
      <div className="canvas">
        <div className="canvas-inner">
          <div className="preview-top">
            <span className="preview-tag">HTML视频预览</span>
            <span className="preview-time">00:10 / 01:40</span>
          </div>
          <div className="preview-content">预览区 — 模式: {mode || '未知'}</div>
        </div>
      </div>
      <div className="storyboard">
        {scenes.map((s) => (
          <StoryboardCard key={s.id} title={s.title} />
        ))}
      </div>
    </div>
  )
}
