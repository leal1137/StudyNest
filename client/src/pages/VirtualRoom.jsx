import { useEffect, useRef, useState, useMemo } from 'react'
import { useBlocker, useNavigate, useParams, useLocation } from 'react-router-dom'
import '../App.css'
import { ParticipantCard } from '../components/ParticipantCard'
import { RoomChatPanel } from '../components/RoomChatPanel'
import { RoomSidebar } from '../components/RoomSidebar'
import { RoomTools } from '../components/RoomTools'
import { VirtualRoomHeader } from '../components/VirtualRoomHeader'
import { changeVirtualRoomAvatar, joinVirtualRoom, leaveVirtualRoom } from '../script/virtualRoomConnection';
import Whiteboard from "../components/Whiteboard";

const initialParticipants = [
  { userId: 1, username: 'Olle', status: 'studying', micMuted: false, speaking: true },
  { userId: 2, username: 'Andreas', status: 'studying', micMuted: true, speaking: true },
  { userId: 3, username: 'Måns', status: 'studying', micMuted: false, speaking: true },
  { userId: 4, username: 'Mille', status: 'studying', micMuted: false, speaking: true },
  { userId: 5, username: 'Ebba', status: 'studying', micMuted: false, speaking: true },
  { userId: 6, username: 'Leo', status: 'studying', micMuted: false, speaking: false },
  { userId: 7, username: 'Edvard', status: 'studying', micMuted: false, speaking: true },
]

function createMessage(author, text, type = 'chat') {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    text,
    type,
  }
}

function mergeParticipantsWithLocalState(incomingParticipants, currentParticipants) {
  return incomingParticipants.map((participant) => {
    const existingParticipant = currentParticipants.find(
      (currentParticipant) => currentParticipant.username === participant.username
    )

    return {
      ...participant,
      micMuted: existingParticipant?.micMuted ?? false,
      speaking: existingParticipant?.speaking ?? false,
      avatar: participant.avatar || existingParticipant?.avatar || '0.svg',
    }
  })
}

export default function VirtualRoom({ socket }) {
  const { roomName } = useParams();
  const location = useLocation()
  const navigate = useNavigate()
  const currentUsername = localStorage.getItem('username') || ''
  const socketRoom = useMemo(
    () => location.state?.roomName || roomName || `room-${location.state?.roomId || 'general'}`,
    [location.state, roomName]
  )
  const roomFeatures = useMemo(
    () => ({
      chatEnabled: location.state?.chatEnabled ?? true,
      voiceEnabled: location.state?.voiceEnabled ?? true,
      whiteboardEnabled: location.state?.whiteboardEnabled ?? true,
    }),
    [location.state]
  )
  const roomTools = useMemo(
    () => [
      roomFeatures.chatEnabled ? 'Chatroom' : null,
      roomFeatures.whiteboardEnabled ? 'Whiteboard' : null,
    ].filter(Boolean),
    [roomFeatures]
  )
  const [participants, setParticipants] = useState(initialParticipants)
  const [messages, setMessages] = useState([
    createMessage('System', 'Log in and join the room to start chatting.', 'system'),
  ])
  const [messageInput, setMessageInput] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('Checking login...')
  const [visibleTools, setVisibleTools] = useState({
    Chatroom: roomFeatures.chatEnabled,
    Whiteboard: roomFeatures.whiteboardEnabled,
  })

  useEffect(() => {
    setVisibleTools({
      Chatroom: roomFeatures.chatEnabled,
      Whiteboard: roomFeatures.whiteboardEnabled,
    })
  }, [roomFeatures])

  function handleToggleMute(participantId) {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) =>
        participant.userId === participantId
          ? { ...participant, micMuted: !participant.micMuted }
          : participant
      )
    )
  }

  function appendMessage(author, text, type = 'chat') {
    setMessages((currentMessages) => [...currentMessages, createMessage(author, text, type)])
  }

  function isCurrentParticipant(participant) {
    return participant.username === currentUsername
  }

    
  function handleLocalStatusChange(newStatus) {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) =>
        isCurrentParticipant(participant)
          ? { ...participant, status: newStatus }
          : participant
      )
    )
  }

  const isMountedRef = useRef(true);
  useEffect(() => {
    if (!socket) {
      setConnectionStatus('Socket not connected.')
      return undefined
    }
    
    isMountedRef.current = true;
    // For testing purposes, to see if socket is properly passed down to virtual room
    console.log("SOCKET IN ROOM:", socket ? socket.id : 'null');

    setConnectionStatus(`Joining ${socketRoom}...`)

    const handleAlreadyInRoom = (room) => {
      setConnectionStatus(`Already connected to ${room}`)
    }

    const handleUserJoinedRoom = (displayName) => {
      setConnectionStatus(`Connected to ${socketRoom}`)
      appendMessage('System', `${displayName} joined the room.`, 'system')
    }

    const handleParticipantList = (list) => {
      setParticipants((currentParticipants) =>
        mergeParticipantsWithLocalState(list.participants_List, currentParticipants)
      )
    }

    const handleUserLeftRoom = (data) => {
      setParticipants((currentParticipants) =>
        mergeParticipantsWithLocalState(data.participants_List, currentParticipants)
      )
      appendMessage('System', `${data.name} left the room.`, 'system')
    }

    const handleReceiveMessage = ({ username: messageAuthor, message }) => {
      appendMessage(messageAuthor, message)
    }

    const handleTimerEnded = () => {
      appendMessage('System', 'Timern har nått noll! Dags för en paus!', 'system')
    }

    const handleDisconnect = () => {
      setConnectionStatus('Disconnected from room.')
    }

    socket.on('user_already_in_room', handleAlreadyInRoom)
    socket.on('user_joined_room', handleUserJoinedRoom)
    socket.on('list_participants_in_room', handleParticipantList)
    socket.on('user_left_room', handleUserLeftRoom)
    socket.on('receive_message', handleReceiveMessage)
    socket.on('timer_ended', handleTimerEnded)
    socket.on('disconnect', handleDisconnect)

    joinVirtualRoom(socketRoom, socket)

    return () => {
      leaveVirtualRoom(socketRoom, socket)
      console.log("EXIT ROOM PAGE");
      socket.off('user_already_in_room', handleAlreadyInRoom)
      socket.off('user_joined_room', handleUserJoinedRoom)
      socket.off('list_participants_in_room', handleParticipantList)
      socket.off('user_left_room', handleUserLeftRoom)
      socket.off('receive_message', handleReceiveMessage)
      socket.off('timer_ended', handleTimerEnded)
      socket.off('disconnect', handleDisconnect)
    }
  }, [socket, socketRoom]);

  useEffect(() => {
    const handleAvatarChanged = (event) => {
      const newAvatar = event.detail?.avatar || localStorage.getItem('avatar') || '0.svg'

      setParticipants((currentParticipants) =>
        currentParticipants.map((participant) =>
          isCurrentParticipant(participant)
            ? { ...participant, avatar: newAvatar }
            : participant
        )
      )

      changeVirtualRoomAvatar(socketRoom, socket, newAvatar)
    }

    window.addEventListener('avatarChanged', handleAvatarChanged)

    return () => {
      window.removeEventListener('avatarChanged', handleAvatarChanged)
    }
  }, [socket, socketRoom, currentUsername])


  function handleSendMessage(event) {
    event.preventDefault()
  
    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage || !socket?.connected) {
      return
    }
   
    socket.emit('send_message', trimmedMessage, socketRoom);
    setMessageInput('')
  }

  function handleLeaveRoom() {
    leaveVirtualRoom(socketRoom, socket);
    navigate('/join-virtual-room');
  }

  function handleToolToggle(tool) {
    setVisibleTools((currentTools) => ({
      ...currentTools,
      [tool]: !currentTools[tool],
    }))
  }

  return (
    <div className="virtual-room-page">
      <RoomSidebar
        onLeaveRoom={handleLeaveRoom}
        socket={socket}
        roomName={socketRoom}
        onStatusChange={handleLocalStatusChange}
      />

      <main className="virtual-room-main">
        <VirtualRoomHeader roomName={socketRoom} studyingCount={participants.length} />

        <section className="participant-grid">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.userId}
              {...participant}
              isCurrentUser={isCurrentParticipant(participant)}
              onToggleMute={
                roomFeatures.voiceEnabled && isCurrentParticipant(participant)
                  ? () => handleToggleMute(participant.userId)
                  : undefined
              }
              voiceEnabled={roomFeatures.voiceEnabled}
            />
          ))}
        </section>

        <section className="virtual-room-lower">
          <div className="room-panel-area">
            {roomFeatures.chatEnabled && visibleTools.Chatroom && (
              <RoomChatPanel
                messages={messages}
                messageInput={messageInput}
                connectionStatus={connectionStatus}
                onMessageInputChange={setMessageInput}
                onSendMessage={handleSendMessage}
                isConnected={Boolean(socket?.connected)}
              />
            )}
            {roomFeatures.whiteboardEnabled && visibleTools.Whiteboard && (
              <Whiteboard socket={socket} room={socketRoom} />
            )}
          </div>
          {roomTools.length > 0 && (
            <RoomTools
              tools={roomTools}
              activeTools={roomTools.filter((tool) => visibleTools[tool])}
              onToolToggle={handleToolToggle}
            />
          )}
        </section>
      </main>
    </div>
  )
}
