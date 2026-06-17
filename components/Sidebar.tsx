export default function Sidebar() {
  const projects = [
    { id: 'p1', name: '蓝色巨人的崛起', mode: 'HTML 视频' },
    { id: 'p2', name: 'Marvis 与同类工具深度对比', mode: '图片轮播' },
    { id: 'p3', name: '一只小猫在黑板前讲解动画', mode: 'HTML 视频' },
    { id: 'p4', name: '揭秘大模型原理：让AI快学会', mode: '图片轮播' }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>历史创作</h4>
        <button className="tool">新建</button>
      </div>
      <ul>
        {projects.map((p) => (
          <li key={p.id} className="project-item">
            <div>
              <div className="proj-name">{p.name}</div>
              <div className="proj-mode">{p.mode}</div>
            </div>
            <div className="proj-time">5月19日</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
