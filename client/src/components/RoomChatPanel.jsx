import '../App.css'

export function RoomChatPanel({ message, placeholder }) {
  return (
    <div className="room-chat-panel">
      <div className="room-chat-feed">{message}</div>
      <div className="room-chat-input">{placeholder}</div>
    </div>
  )
}
