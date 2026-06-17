import Link from 'next/link'
import Head from 'next/head'
import Header from '../components/Header'
import ModeCard from '../components/ModeCard'

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI 视频制作</title>
      </Head>
      <Header />
      <main className="container">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">智能视频创作平台</span>
            <h1>一键生成互动演示、动画短片与 HTML 视频</h1>
            <p>
              通过 AI 自动生成画面、分镜与脚本，省去手动剪辑步骤，快速输出符合专业级风格的视频内容。
            </p>
          </div>
          <div className="hero-actions">
            <Link href="/create/image" className="btn-primary hero-btn">
              立即开始创作
            </Link>
            <Link href="/create/html" className="btn-secondary hero-btn">
              查看模式
            </Link>
          </div>
        </section>
        <section className="mode-panel">
          <h2 className="title">选择创作模式</h2>
          <div className="modes">
            <Link href="/create/image">
              <ModeCard title="图片轮播模式" desc="AI 生成图片，轮播成片" />
            </Link>
            <Link href="/create/html">
              <ModeCard title="HTML 视频模式" desc="AI 生成网页动画，导出视频" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
