import { useEffect, useState } from 'react'

type Project = {
  uuid: string
  title: string
  createdAt: string
  type: string
  outline: string
  sourceCode: string
}

const gradients = [
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#30cfd0 0%,#330867 100%)',
]

export default function Sidebar({ selectedProject, onSelectProject }: { selectedProject?: string | null; onSelectProject?: (id: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        setProjects(data.projects || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const getGradient = (index: number) => {
    return gradients[index % gradients.length]
  }

  const getProjectIcon = (type: string) => {
    return type.includes('HTML') ? '🎨' : '🎬'
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>历史创作</h4>
        <button className="tool">新建</button>
      </div>
      <ul>
        {loading ? (
          <li className="project-item">加载中...</li>
        ) : projects.length === 0 ? (
          <li className="project-item">暂无历史项目</li>
        ) : (
          projects.map((project, index) => (
            <li key={project.uuid} className={`project-item${selectedProject === project.uuid ? ' selected' : ''}`} onClick={() => onSelectProject?.(project.uuid)}>
              <div className="project-thumb" style={{ background: getGradient(index) }}>
                {getProjectIcon(project.type)}
              </div>
              <div className="project-meta">
                <div className="proj-name" title={project.title}>{project.title}</div>
                <div className="proj-mode">{project.type}</div>
              </div>
              <div className="proj-time">
                {new Date(project.createdAt).toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
