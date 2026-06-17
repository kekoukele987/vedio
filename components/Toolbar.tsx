export default function Toolbar() {
  return (
    <div className="toolbar">
      <div className="left-tools">
        <label className="switch">
          字幕 <input type="checkbox" />
        </label>
      </div>
      <div className="right-tools">
        <button className="tool">全屏</button>
        <button className="tool primary">录屏导出</button>
      </div>
    </div>
  )
}
