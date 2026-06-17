export default function Sidebar() {
  const projects = [
    { id: 'p1', name: '项目 1', mode: '图片轮播' },
    { id: 'p2', name: '项目 2', mode: 'HTML 视频' }
  ]

  return (
    <div className="sidebar">
      <h4>历史项目</h4>
      <ul>
        {projects.map((p) => (
          <li key={p.id} className="project-item">
            <div className="proj-name">{p.name}</div>
            <div className="proj-mode">{p.mode}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
