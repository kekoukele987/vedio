export default function StoryboardCard({ title }: { title: string }) {
  return (
    <div className="story-card">
      <div className="thumb">🎞</div>
      <div className="meta">
        <div className="title">{title}</div>
        <div className="duration">3s</div>
      </div>
    </div>
  )
}
