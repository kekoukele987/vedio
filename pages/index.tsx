import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Image, Code2 } from 'lucide-react'
import Header from '../components/Header'
import ModeCard from '../components/ModeCard'

const modes = [
  {
    key: 'image' as const,
    title: '图片轮播模式',
    description:
      'AI 根据脚本生成高质量图片，自动拼接轮播形成视频，适合产品展示、宣传片等场景。',
    icon: <Image size={28} />,
    iconClass: 'image',
    features: ['AI 智能生成图片画面', '自动轮播转场特效', '一键导出 MP4 视频'],
  },
  {
    key: 'html' as const,
    title: 'HTML 视频模式',
    description:
      'AI 生成网页动画代码，通过 CSS / JS 动效渲染，录屏导出为高清视频，适合创意动画。',
    icon: <Code2 size={28} />,
    iconClass: 'html',
    features: ['AI 生成网页动画代码', 'CSS / JS 动效渲染', '录屏导出高清视频'],
  },
]

function nowStr() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Home() {
  const router = useRouter()
  const [creatingMode, setCreatingMode] = useState<string | null>(null)

  const handleCreate = async (modeKey: string) => {
    setCreatingMode(modeKey)
    try {
      const title = `${modeKey === 'image' ? '图片轮播' : 'HTML 视频'} - ${nowStr()}`
      const resp = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type: modeKey }),
      })

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}))
        throw new Error((data as any).error || `HTTP ${resp.status}`)
      }

      const project = await resp.json()
      router.push(`/create/${modeKey}?projectId=${project.uuid}`)
    } catch (err: any) {
      alert('创建项目失败：' + (err.message || '未知错误'))
      setCreatingMode(null)
    }
  }

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
                key={m.key}
                icon={m.icon}
                iconClass={m.iconClass}
                title={m.title}
                description={m.description}
                features={m.features}
                loading={creatingMode === m.key}
                onCreate={() => handleCreate(m.key)}
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
