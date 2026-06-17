import { useEffect, useState } from 'react'

type Project = {
  uuid: string
  title: string
  createdAt: string
  type: string
  outline: string
  sourceCode: string
}

export default function Sidebar() {
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
          projects.map((project) => (
            <li key={project.uuid} className="project-item">
              <div>
                <div className="proj-name">{project.title}</div>
                <div className="proj-mode">{project.type}</div>
              </div>
              <div className="proj-time">
                {new Date(project.createdAt).toLocaleString()}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
