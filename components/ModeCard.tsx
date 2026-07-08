import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  iconClass: string
  title: string
  description: string
  features: string[]
  href: string
}

export default function ModeCard({ icon, iconClass, title, description, features, href }: Props) {
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
      <Link href={href} style={{ display: 'block' }}>
        <button className="mode-card-btn">
          开始创作
          <ArrowRight size={18} />
        </button>
      </Link>
    </div>
  )
}
