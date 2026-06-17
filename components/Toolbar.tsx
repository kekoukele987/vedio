export default function Toolbar() {
  return (
    <div className="toolbar">
      <div className="left-tools">
        <label className="switch">
          <input type="checkbox" defaultChecked />
          <span>字幕</span>
        </label>
        <label className="switch">
          <input type="checkbox" />
          <span>水印</span>
        </label>
      </div>
      <div className="right-tools">
        <button className="tool" title="全屏">
          ⛶ 全屏
        </button>
        <button className="tool primary" title="导出视频">
          ⬇ 导出
        </button>
        <button className="tool" title="分享">
          ↗ 分享
        </button>
      </div>
    </div>
  )
}
