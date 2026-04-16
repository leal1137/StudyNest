import '../App.css'

export function VirtualRoomHeader({ roomName, studyingCount }) {
  return (
    <div className="virtual-room-header">
      <div className="room-chip">{roomName}</div>
      <div className="room-people-count">
        <span>Number of people studying:</span>
        <span className="room-people-badge">{studyingCount}</span>
      </div>
    </div>
  )
}
