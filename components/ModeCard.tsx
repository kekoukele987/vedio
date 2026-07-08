import { Check, ArrowRight, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  iconClass: string
  title: string
  description: string
  features: string[]
  loading?: boolean
  onCreate: () => void
}

export default function ModeCard({
  icon,
  iconClass,
  title,
  description,
  features,
  loading = false,
  onCreate,
}: Props) {
  return (
    <div className="mode-card">
      <div className={`mode-card-icon ${iconClass}`}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p className="mode-card-desc">{description}</p>
      <ul className="mode-card-features">
        {features.map((f, i) => (
          <li key={i} className="mode-card-feature">
            <Check size={16} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        className="mode-card-btn"
        disabled={loading}
        onClick={onCreate}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="spin-icon" />
            创建中…
          </>
        ) : (
          <>
            开始创作
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  )
}
