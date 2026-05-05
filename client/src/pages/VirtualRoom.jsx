import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { io } from 'socket.io-client'
import { ParticipantCard } from '../components/ParticipantCard'
import { RoomChatPanel } from '../components/RoomChatPanel'
import { RoomSidebar } from '../components/RoomSidebar'
import { RoomTools } from '../components/RoomTools'
import { VirtualRoomHeader } from '../components/VirtualRoomHeader'
import { joinVirtualRoom, leaveVirtualRoom } from '../script/virtualRoomConnection';

const initialParticipants = [
  { userId: 1, username: 'Olle', status: 'studying', micMuted: false, speaking: true },
  { userId: 2, username: 'Andreas', status: 'studying', micMuted: true, speaking: true },
  { userId: 3, username: 'Måns', status: 'studying', micMuted: false, speaking: true },
  { userId: 4, username: 'Mille', status: 'studying', micMuted: false, speaking: true },
  { userId: 5, username: 'Ebba', status: 'studying', micMuted: false, speaking: true },
  { userId: 6, username: 'Leo', status: 'studying', micMuted: false, speaking: false },
  { userId: 7, username: 'Edvard', status: 'studying', micMuted: false, speaking: true },
]

const roomTools = ['Chatroom', 'Whiteboard']
let socket_room;

function createMessage(author, text, type = 'chat') {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    text,
    type,
  }
}

export default function VirtualRoom({ socket }) {
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
        participant.userId === participantId
          ? { ...participant, micMuted: !participant.micMuted }
          : participant
      )
    )
  }

  function appendMessage(author, text, type = 'chat') {
    setMessages((currentMessages) => [...currentMessages, createMessage(author, text, type)])
  }

  useEffect(() => {
    // For testing purposes, to see if socket is properly passed down to virtual room
    console.log("SOCKET IN ROOM:", socket ? socket.id : 'null');

    //for testing once joined room.
    socket?.on('user_already_in_room', (room) => {
      console.log(`User is already in the room: ${room}`);
    });

    socket?.on('user_joined_room', (displayName) => {
      appendMessage('System', `${displayName} joined the room.`, 'system')
      console.log(`User ${displayName} joined the room!`);//uppdata chat
    });

    socket?.on('list_participants_in_room', (list) => {
      const currentParticipants = list.participants_List;
      setParticipants(currentParticipants);
    });

    socket?.on('user_left_room', (data) => {
      const currentParticipants = data.participants_List;
      const displayName = data.name;
      setParticipants(currentParticipants);
      appendMessage('System', `${displayName} left the room.`, 'system');
    });

    socket?.on('receive_message', ({ username: messageAuthor, message }) => {
      appendMessage(messageAuthor, message)
    })

    socket?.on('timer_ended', () => {
      appendMessage('System', 'Timern har nått noll! Dags för en paus!', 'system');
    });

    //acctually join the room
    socket_room = 'test-room';
    joinVirtualRoom(socket_room, socket);

    return () => {      socket?.off('user_already_in_room');
      socket?.off('user_joined_room');
      socket?.off('list_participants_in_room');
      socket?.off('user_left_room');
      socket?.off('receive_message');
      socket?.off('timer_ended');
    }
  }, [socket]);


  function handleSendMessage(event) {
    event.preventDefault()
  
    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage || !socket?.connected) {
      return
    }
   
    socket.emit('send_message', trimmedMessage, socket_room);
    setMessageInput('')
  }

 function handleleaveRoom() {
    leaveVirtualRoom(socket_room, socket);
    navigate('/home');
 }


  return (
    <div className="virtual-room-page">
      <RoomSidebar onLeaveRoom={() => handleleaveRoom()} socket={socket} roomName={socket_room} />

      <main className="virtual-room-main">
        <VirtualRoomHeader roomName={socket_room} studyingCount={548} />

        <section className="participant-grid">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.userId}
              {...participant}
              onToggleMute={() => handleToggleMute(participant.userId)}
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
            isConnected={Boolean(socket?.connected)}
          />
          <RoomTools tools={roomTools} />
        </section>
      </main>
    </div>
  )
}
