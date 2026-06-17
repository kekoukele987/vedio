import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../components/Header'
import ModeCard from '../components/ModeCard'

const modeMap = {
  image: { type: '图片轮播', title: '图片轮播项目' },
  html: { type: 'HTML 动画', title: 'HTML 动画项目' }
}

export default function Home() {
  const router = useRouter()
  const [loadingType, setLoadingType] = useState<string | null>(null)

  async function handleCreateMode(mode: 'image' | 'html') {
    const config = modeMap[mode]
    setLoadingType(mode)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `${config.title} ${new Date().toLocaleString()}`, type: config.type })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || '创建项目失败')
      }
      router.push(`/create/${mode}?projectId=${data.project.uuid}`)
    } catch (error) {
      console.error(error)
      setLoadingType(null)
      alert('项目创建失败，请稍后重试。')
    }
  }

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
              通过 AI 自动生成画面、分镜与脚本，省去手动剪辑步骤，快速输出符合专业级
              风格的视频内容。
            </p>
          </div>
          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={() => handleCreateMode('image')}>
              开始图片轮播创作
            </button>
            <button className="btn-secondary hero-btn" onClick={() => handleCreateMode('html')}>
              开始 HTML 视频创作
            </button>
          </div>
        </section>
        <section className="mode-panel">
          <h2 className="title">选择创作模式</h2>
          <div className="modes">
            <ModeCard
              title="图片轮播模式"
              desc="AI 生成图片，轮播成片"
              onClick={() => handleCreateMode('image')}
              loading={loadingType === 'image'}
            />
            <ModeCard
              title="HTML 视频模式"
              desc="AI 生成网页动画，导出视频"
              onClick={() => handleCreateMode('html')}
              loading={loadingType === 'html'}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
