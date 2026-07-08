import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

type Props = {
  modeLabel?: string
}

export default function Header({ modeLabel }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <Link href="/">
          <div className="header-logo" title="AI 视频制作">
            <Clapperboard size={20} />
          </div>
        </Link>
        <div className="header-brand">
          <span className="header-brand-name">AI 视频制作</span>
          <span className="header-brand-sub">AI Video Studio</span>
        </div>
      </div>
      <nav className="header-nav">
        <Link href="/">首页</Link>
        {modeLabel && <span className="header-mode-badge">{modeLabel}</span>}
      </nav>
    </header>
  )
}
