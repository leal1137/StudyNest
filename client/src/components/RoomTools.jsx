import '../App.css'

export function RoomTools({ tools, activeTools = [], activeTool, onToolToggle }) {
  return (
    <div className="room-tools">
      {tools.map((tool) => (
        <button
          className={`room-tool-button ${
            activeTools.includes(tool) || activeTool === tool ? 'is-active' : ''
          }`}
          type="button"
          key={tool}
          onClick={() => onToolToggle(tool)}
        >
          {tool}
        </button>
      ))}
    </div>
  )
}
