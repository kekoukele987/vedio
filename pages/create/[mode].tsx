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
  const { mode } = router.query
  const modeStr = String(mode || '')

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head>
        <title>创作 — {modeLabel[modeStr] || 'AI 视频制作'}</title>
      </Head>

      <Header modeLabel={modeLabel[modeStr]} />

      <div className="create-layout">
        <aside className="create-left">
          <Sidebar />
        </aside>

        <section className="create-center">
          <PreviewArea mode={modeStr} />
        </section>

        <aside className="create-right">
          <ChatPanel />
        </aside>
      </div>
    </div>
  )
}
