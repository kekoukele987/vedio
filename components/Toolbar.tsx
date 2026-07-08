import { useState } from 'react'
import { Maximize2, Download, Subtitles } from 'lucide-react'

type Props = {
  mode: string
}

const modeLabel: Record<string, string> = {
  image: '图片轮播模式',
  html: 'HTML 视频模式',
}

export default function Toolbar({ mode }: Props) {
  const [subtitlesOn, setSubtitlesOn] = useState(true)

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-mode-label">
          {modeLabel[mode] || mode}
        </span>
        <label className="toggle-label">
          <Subtitles size={16} />
          <span>字幕</span>
          <div
            className={`toggle-track${subtitlesOn ? ' on' : ''}`}
            onClick={() => setSubtitlesOn(!subtitlesOn)}
          >
            <div className="toggle-thumb" />
          </div>
        </label>
      </div>

      <div className="toolbar-right">
        <button className="tool-btn" title="全屏预览">
          <Maximize2 size={16} />
          全屏
        </button>
        <button className="tool-btn primary" title="录屏导出视频">
          <Download size={16} />
          导出视频
        </button>
      </div>
    </div>
  )
}
