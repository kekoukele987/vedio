import StoryboardCard from './StoryboardCard'
import Toolbar from './Toolbar'

export default function PreviewArea({ mode }: { mode: string }) {
  const scenes = new Array(6).fill(0).map((_, i) => ({ id: i + 1, title: `分镜 ${i + 1}` }))

  return (
    <div className="preview-area">
      <Toolbar />
      <div className="canvas">
        <div className="canvas-inner">预览区 — 模式: {mode || '未知'}</div>
      </div>
      <div className="storyboard">
        {scenes.map((s) => (
          <StoryboardCard key={s.id} title={s.title} />
        ))}
      </div>
    </div>
  )
}
