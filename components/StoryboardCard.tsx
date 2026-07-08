import { Image, Film } from 'lucide-react'

type Props = {
  title: string
  index: number
  isActive?: boolean
  duration?: string
  onClick?: () => void
}

export default function StoryboardCard({
  title,
  index,
  isActive = false,
  duration = '3s',
  onClick,
}: Props) {
  return (
    <div
      className={`story-card${isActive ? ' active' : ''}`}
      onClick={onClick}
    >
      <div className="story-card-thumb">
        <span className="story-card-thumb-num">{index + 1}</span>
        <Film size={24} />
      </div>
      <div className="story-card-meta">
        <div className="story-card-title">{title}</div>
        <div className="story-card-duration">{duration}</div>
      </div>
    </div>
  )
}
