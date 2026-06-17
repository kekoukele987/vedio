import Link from 'next/link'

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">AI</div>
        <div className="name">AI 视频制作</div>
      </div>
      <nav>
        <Link href="/">首页</Link>
      </nav>
    </header>
  )
}
