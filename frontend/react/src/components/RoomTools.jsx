import '../App.css'

export function RoomTools({ tools }) {
  return (
    <div className="room-tools">
      {tools.map((tool) => (
        <button className="room-tool-button" type="button" key={tool}>
          {tool}
        </button>
      ))}
    </div>
  )
}
