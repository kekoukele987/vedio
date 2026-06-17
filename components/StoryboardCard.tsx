import { useState, useMemo } from 'react'

export default function StoryboardCard({ title, id }: { title: string; id?: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const gradients = [
    'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
    'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
    'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  ]
  
  // 基于id或title生成一致的梯度，避免hydration错误
  const gradient = useMemo(() => {
    const index = id !== undefined ? id : title.charCodeAt(0);
    return gradients[index % gradients.length];
  }, [id, title])
  
  return (
    <div 
      className="story-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="thumb" style={{ background: gradient }}>
        {isHovered ? '▶' : '🎞'}
      </div>
      <div className="meta">
        <div className="title">{title}</div>
        <div className="duration">3s</div>
      </div>
    </div>
  )
}
