import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import PreviewArea from '../../components/PreviewArea'
import ChatPanel from '../../components/ChatPanel'

export default function CreatePage() {
  const router = useRouter()
  const { mode } = router.query

  return (
    <div>
      <Head>
        <title>创作 - {mode}</title>
      </Head>
      <Header />
      <div className="create-layout">
        <aside className="left">
          <Sidebar />
        </aside>
        <section className="center">
          <PreviewArea mode={String(mode || '')} />
        </section>
        <aside className="right">
          <ChatPanel />
        </aside>
      </div>
    </div>
  )
}
