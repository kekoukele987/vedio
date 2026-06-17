import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import PreviewArea from '../../components/PreviewArea'
import ChatPanel from '../../components/ChatPanel'
import { useEffect, useState } from 'react'

type Message = {
  id: string
  role: 'user' | 'system'
  content: string
}

export default function CreatePage() {
  const router = useRouter()
  const { mode } = router.query
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!selectedProject) return
    fetch(`/api/project/${selectedProject}/messages`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => {})
  }, [selectedProject])

  return (
    <div>
      <Head>
        <title>创作 - {mode}</title>
      </Head>
      <Header />
      <div className="create-layout">
        <aside className="left">
          <Sidebar selectedProject={selectedProject} onSelectProject={setSelectedProject} />
        </aside>
        <section className="center">
          <PreviewArea mode={String(mode || '')} />
        </section>
        <aside className="right">
          <ChatPanel projectId={selectedProject} messages={messages} onMessagesChange={setMessages} />
        </aside>
      </div>
    </div>
  )
}
