type Props = { title: string; desc?: string }

export default function ModeCard({ title, desc }: Props) {
  return (
    <div className="mode-card">
      <div className="mode-card-inner">
        <h3>{title}</h3>
        <p>{desc}</p>
        <button className="create-btn">创建</button>
      </div>
    </div>
  )
}
