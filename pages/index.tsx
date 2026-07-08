import Head from 'next/head'
import { Image, Code2 } from 'lucide-react'
import Header from '../components/Header'
import ModeCard from '../components/ModeCard'

const modes = [
  {
    title: '图片轮播模式',
    description:
      'AI 根据脚本生成高质量图片，自动拼接轮播形成视频，适合产品展示、宣传片等场景。',
    icon: <Image size={28} />,
    iconClass: 'image',
    features: ['AI 智能生成图片画面', '自动轮播转场特效', '一键导出 MP4 视频'],
    href: '/create/image',
  },
  {
    title: 'HTML 视频模式',
    description:
      'AI 生成网页动画代码，通过 CSS / JS 动效渲染，录屏导出为高清视频，适合创意动画。',
    icon: <Code2 size={28} />,
    iconClass: 'html',
    features: ['AI 生成网页动画代码', 'CSS / JS 动效渲染', '录屏导出高清视频'],
    href: '/create/html',
  },
]

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI 视频制作 — 智能生成专业视频</title>
      </Head>

      <Header />

      <main className="home-container">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <path d="m4 11 2.5-4h11L20 11" />
              <circle cx="12" cy="14" r="1" />
              <path d="M12 7V3" />
            </svg>
          </div>
          <h1>AI 视频制作</h1>
          <p>只需输入一句话，AI 自动完成脚本生成、分镜拆分、画面创作、配音配乐，轻松导出专业视频。</p>
        </section>

        {/* Mode Selection */}
        <section>
          <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 28, fontWeight: 600 }}>
            选择创作模式
          </h2>
          <div className="home-modes">
            {modes.map((m) => (
              <ModeCard
                key={m.href}
                icon={m.icon}
                iconClass={m.iconClass}
                title={m.title}
                description={m.description}
                features={m.features}
                href={m.href}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 12 }}>
        AI Video Studio © 2026
      </footer>
    </div>
  )
}
