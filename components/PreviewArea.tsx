import StoryboardCard from './StoryboardCard'
import Toolbar from './Toolbar'
import { useState } from 'react'

export default function PreviewArea({ mode }: { mode: string }) {
  const [currentTime, setCurrentTime] = useState('00:10')
  const [totalTime, setTotalTime] = useState('01:40')
  const [videoTitle] = useState('演示视频')
  const [videoSubtitle] = useState('Modern Design')
  
  const scenes = new Array(7).fill(0).map((_, i) => ({ id: i + 1, title: `分镜 ${i + 1}` }))

  return (
    <div className="preview-area">
      <Toolbar />
      <div className="canvas">
        <div className="canvas-inner">
          <div className="preview-top">
            <span className="preview-tag">HTML视频预览</span>
            <span className="preview-time">{currentTime} / {totalTime}</span>
          </div>
          <div className="preview-content">{videoTitle}</div>
          <div className="preview-content-subtitle">{videoSubtitle}</div>
        </div>
      </div>
      <div className="storyboard">
        {scenes.map((s) => (
          <StoryboardCard key={s.id} id={s.id} title={s.title} />
        ))}
      </div>
    </div>
  )
}
