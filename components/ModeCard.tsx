type Props = {
  title: string
  desc?: string
  onClick?: () => void
  loading?: boolean
}

export default function ModeCard({ title, desc, onClick, loading }: Props) {
  return (
    <div className="mode-card">
      <div className="mode-card-inner">
        <h3>{title}</h3>
        <p>{desc}</p>
        <button className="create-btn" onClick={onClick} disabled={loading}>
          {loading ? '创建中...' : '创建'}
        </button>
      </div>
    </div>
  )
}
