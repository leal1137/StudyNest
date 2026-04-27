import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { io } from 'socket.io-client'
import { ParticipantCard } from '../components/ParticipantCard'
import { RoomChatPanel } from '../components/RoomChatPanel'
import { RoomSidebar } from '../components/RoomSidebar'
import { RoomTools } from '../components/RoomTools'
import { VirtualRoomHeader } from '../components/VirtualRoomHeader'

const initialParticipants = [
  { id: 1, name: 'Olle', status: 'studying', micMuted: false, speaking: true },
  { id: 2, name: 'Andreas', status: 'studying', micMuted: true, speaking: true },
  { id: 3, name: 'Måns', status: 'studying', micMuted: false, speaking: true },
  { id: 4, name: 'Mille', status: 'studying', micMuted: false, speaking: true },
  { id: 5, name: 'Ebba', status: 'studying', micMuted: false, speaking: true },
  { id: 6, name: 'Leo', status: 'studying', micMuted: false, speaking: false },
  { id: 7, name: 'Edward', status: 'studying', micMuted: false, speaking: true },
  { id: 8, name: 'Samir', status: 'break', micMuted: false, speaking: false },
]

const roomTools = ['Chatroom', 'Whiteboard']
const roomName = 'study-room-1'

function createMessage(author, text, type = 'chat') {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    text,
    type,
  }
}

export default function VirtualRoom() {
  const navigate = useNavigate()
  const [participants, setParticipants] = useState(initialParticipants)
  const [messages, setMessages] = useState([
    createMessage('System', 'Log in and join the room to start chatting.', 'system'),
  ])
  const [messageInput, setMessageInput] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('Checking login...')
  const socketRef = useRef(null)

  function handleToggleMute(participantId) {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) =>
        participant.id === participantId
          ? { ...participant, micMuted: !participant.micMuted }
          : participant
      )
    )
  }

  function appendMessage(author, text, type = 'chat') {
    setMessages((currentMessages) => [...currentMessages, createMessage(author, text, type)])
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username') || 'Unknown user'

    if (!token) {
      setConnectionStatus('Log in first to use the live chat.')
      setMessages([createMessage('System', 'You need to sign in before joining the live room.', 'system')])
      return undefined
    }

    const socket = io({
      auth: { token },
      transports: ['websocket'],
    })

    socketRef.current = socket
    setConnectionStatus(`Connecting as ${username}...`)

    socket.on('connect', () => {
      setConnectionStatus(`Connected as ${username}`)
      socket.emit('join_room', roomName)
    })

    socket.on('joined_room', ({ room }) => {
      appendMessage('System', `You joined ${room}.`, 'system')
    })

    socket.on('user_joined', (joinedUsername) => {
      appendMessage('System', `${joinedUsername} joined the room.`, 'system')
    })

    socket.on('user_left', (leftUsername) => {
      appendMessage('System', `${leftUsername} left the room.`, 'system')
    })

    socket.on('receive_message', ({ username: messageAuthor, message }) => {
      appendMessage(messageAuthor, message)
    })

    socket.on('connect_error', (error) => {
      setConnectionStatus(error.message || 'Could not connect to chat.')
    })

    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected from chat.')
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  function handleSendMessage(event) {
    event.preventDefault()

    const trimmedMessage = messageInput.trim()

    if (!trimmedMessage || !socketRef.current?.connected) {
      return
    }

    socketRef.current.emit('send_message', trimmedMessage)
    setMessageInput('')
  }

  function handleLeaveRoom() {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    navigate('/')
  }

  return (
    <div className="virtual-room-page">
      <RoomSidebar onLeaveRoom={handleLeaveRoom} />

      <main className="virtual-room-main">
        <VirtualRoomHeader roomName="Study room 1" studyingCount={548} />

        <section className="participant-grid">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              {...participant}
              onToggleMute={() => handleToggleMute(participant.id)}
            />
          ))}
        </section>

        <section className="virtual-room-lower">
          <RoomChatPanel
            messages={messages}
            messageInput={messageInput}
            connectionStatus={connectionStatus}
            onMessageInputChange={setMessageInput}
            onSendMessage={handleSendMessage}
            isConnected={Boolean(socketRef.current?.connected)}
          />
          <RoomTools tools={roomTools} />
        </section>
      </main>
    </div>
  )
}
