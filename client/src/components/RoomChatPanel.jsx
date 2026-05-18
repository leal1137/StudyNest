import { useEffect, useRef } from 'react'
import '../App.css'

export function RoomChatPanel({
  messages,
  messageInput,
  connectionStatus,
  onMessageInputChange,
  onSendMessage,
  isConnected,
}) {
  const messageListRef = useRef(null)

  useEffect(() => {
    const listElement = messageListRef.current

    if (!listElement) {
      return
    }

    listElement.scrollTop = listElement.scrollHeight
  }, [messages])

  return (
    <div className="room-chat-panel">
      <div className="room-chat-status">{connectionStatus}</div>

      <div className="room-chat-feed" ref={messageListRef}>
        {messages.map((message) => (
          <div
            className={`room-chat-message room-chat-message-${message.type}`}
            key={message.id}
          >
            <span className="room-chat-author">{message.author}:</span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>

      <form className="room-chat-form" onSubmit={onSendMessage}>
        <input
          className="room-chat-input"
          type="text"
          value={messageInput}
          onChange={(event) => onMessageInputChange(event.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button className="room-chat-send" type="submit" disabled={!isConnected || !messageInput.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
