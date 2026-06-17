import Link from 'next/link'

const navLinks = [
  { label: '首页', href: '/' },
  { label: '案例', href: '/#cases' },
  { label: '工具', href: '/#tools' },
  { label: '开始创作', href: '/create/image' },
  { label: '博客', href: '/#blog' },
  { label: '价格', href: '/#pricing' },
  { label: '个人中心', href: '/#profile' }
]

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">SVG</div>
        <div className="brand-text">
          <div className="name">AI 视频制作</div>
          <div className="subtitle">智能视频演示与短片生成</div>
        </div>
      </div>
      <nav className="nav-links">
        {navLinks.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <button className="btn-secondary">EN</button>
        <button className="btn-primary">创作</button>
      </div>
    </header>
  )
}
