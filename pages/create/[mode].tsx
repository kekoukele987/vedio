import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import PreviewArea from '../../components/PreviewArea'
import ChatPanel from '../../components/ChatPanel'

const modeLabel: Record<string, string> = {
  image: '图片轮播',
  html: 'HTML 视频',
}

export default function CreatePage() {
  const router = useRouter()

  // 等待 router 就绪后再读取 query 参数，避免拿到 undefined
  if (!router.isReady) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Head><title>加载中…</title></Head>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          加载中…
        </div>
      </div>
    )
  }

  const { mode, projectId } = router.query
  const modeStr = String(mode || '')
  const projectIdStr = typeof projectId === 'string' && projectId.length > 0 ? projectId : undefined

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head>
        <title>创作 — {modeLabel[modeStr] || 'AI 视频制作'}</title>
      </Head>

      <Header modeLabel={modeLabel[modeStr]} />

      <div className="create-layout">
        <aside className="create-left">
          <Sidebar activeProjectId={projectIdStr} />
        </aside>

        <section className="create-center">
          <PreviewArea mode={modeStr} />
        </section>

        <aside className="create-right">
          <ChatPanel projectId={projectIdStr} />
        </aside>
      </div>
    </div>
  )
}
