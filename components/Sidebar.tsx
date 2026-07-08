import { Image, Code2, Plus, History } from 'lucide-react'

type Project = {
  id: string
  name: string
  mode: 'image' | 'html'
  createdAt: string
}

const mockProjects: Project[] = [
  { id: 'p1', name: '产品宣传片', mode: 'image', createdAt: '2026-07-08' },
  { id: 'p2', name: '节日祝福动画', mode: 'html', createdAt: '2026-07-07' },
  { id: 'p3', name: '教学演示视频', mode: 'image', createdAt: '2026-07-05' },
  { id: 'p4', name: '品牌故事短片', mode: 'html', createdAt: '2026-07-03' },
]

const modeLabel: Record<string, string> = {
  image: '图片轮播',
  html: 'HTML 视频',
}

export default function Sidebar() {
  const projects = mockProjects

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>
          <History size={16} style={{ marginRight: 6 }} />
          历史项目
        </h4>
        <button className="sidebar-new-btn" title="新建项目">
          <Plus size={16} />
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="sidebar-empty">
          <History size={32} />
          <p>暂无项目</p>
          <p style={{ fontSize: 12 }}>点击 + 开始创建</p>
        </div>
      ) : (
        <ul className="sidebar-list">
          {projects.map((p) => (
            <li key={p.id} className="project-item">
              <div className={`project-item-thumb ${p.mode}`}>
                {p.mode === 'image' ? <Image size={20} /> : <Code2 size={20} />}
              </div>
              <div className="project-item-info">
                <div className="project-item-name">{p.name}</div>
                <div className="project-item-mode">{modeLabel[p.mode]}</div>
                <div className="project-item-time">{p.createdAt}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
