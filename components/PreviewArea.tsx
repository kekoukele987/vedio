import { useState } from 'react'
import { Clapperboard } from 'lucide-react'
import Toolbar from './Toolbar'
import StoryboardCard from './StoryboardCard'

type Props = {
  mode: string
}

const sceneNames: Record<string, string[]> = {
  image: ['开场画面', '产品展示', '功能特写', '使用场景', '用户评价', '结尾'],
  html: ['加载动画', '标题入场', '内容展开', '交互动效', '数据展示', '收尾'],
}

export default function PreviewArea({ mode }: Props) {
  const [activeScene, setActiveScene] = useState(0)
  const scenes = sceneNames[mode] || ['分镜 1', '分镜 2', '分镜 3', '分镜 4', '分镜 5', '分镜 6']

  return (
    <div className="preview-area">
      <Toolbar mode={mode} />

      <div className="canvas">
        <div className="canvas-inner">
          <Clapperboard size={48} />
          <p>请在右侧输入提示词开始创作</p>
          <span className="canvas-hint">
            选择「{mode === 'html' ? 'HTML 视频模式' : '图片轮播模式'}」
          </span>
        </div>
      </div>

      <div className="storyboard">
        {scenes.map((name, i) => (
          <StoryboardCard
            key={i}
            title={name}
            index={i}
            isActive={i === activeScene}
            onClick={() => setActiveScene(i)}
          />
        ))}
      </div>
    </div>
  )
}
