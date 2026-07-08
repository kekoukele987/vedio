import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Image, Code2, Plus, History, Loader2, AlertCircle } from 'lucide-react'

type Project = {
  uuid: string
  title: string
  type: 'image' | 'html'
  created_at: string
}

const modeLabel: Record<string, string> = {
  image: '图片轮播',
  html: 'HTML 视频',
}

function formatDate(raw: string): string {
  // raw is like "2026-07-08T12:00:00.000Z" or "2026-07-08 12:00:00"
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw.slice(0, 10)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

type Props = {
  activeProjectId?: string
}

export default function Sidebar({ activeProjectId }: Props) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch('/api/projects')
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      setProjects(data)
    } catch (err: any) {
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const goToProject = (p: Project) => {
    router.push(`/create/${p.type}?projectId=${p.uuid}`)
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>
          <History size={16} style={{ marginRight: 6 }} />
          历史项目
        </h4>
        <button className="sidebar-new-btn" title="新建项目" onClick={() => router.push('/')}>
          <Plus size={16} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="sidebar-empty">
          <Loader2 size={24} className="spin-icon" />
          <p>加载中…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="sidebar-empty" style={{ color: 'var(--error, #dc2626)' }}>
          <AlertCircle size={24} />
          <p>{error}</p>
          <button className="tool-btn" style={{ marginTop: 8, fontSize: 12 }} onClick={fetchProjects}>
            重试
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && projects.length === 0 && (
        <div className="sidebar-empty">
          <History size={32} />
          <p>暂无项目</p>
          <p style={{ fontSize: 12 }}>返回首页开始创建</p>
        </div>
      )}

      {/* List */}
      {!loading && !error && projects.length > 0 && (
        <ul className="sidebar-list">
          {projects.map((p) => (
            <li
              key={p.uuid}
              className={`project-item${p.uuid === activeProjectId ? ' active' : ''}`}
              onClick={() => goToProject(p)}
            >
              <div className={`project-item-thumb ${p.type}`}>
                {p.type === 'image' ? <Image size={20} /> : <Code2 size={20} />}
              </div>
              <div className="project-item-info">
                <div className="project-item-name">{p.title}</div>
                <div className="project-item-mode">{modeLabel[p.type]}</div>
                <div className="project-item-time">{formatDate(p.created_at)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
