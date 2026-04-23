import { useState } from 'react'
import '../App.css'
import { ParticipantCard } from '../components/ParticipantCard'
import { RoomChatPanel } from '../components/RoomChatPanel'
import { RoomSidebar } from '../components/RoomSidebar'
import { RoomTools } from '../components/RoomTools'
import { VirtualRoomHeader } from '../components/VirtualRoomHeader'
import { useEffect } from 'react';
import { joinVirtualRoom } from '../script/virtualRoomConnection';

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

export default function VirtualRoom({ socket }) {
  const [participants, setParticipants] = useState(initialParticipants)

  function handleToggleMute(participantId) {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) =>
        participant.id === participantId
          ? { ...participant, micMuted: !participant.micMuted }
          : participant
      )
    )
  }

  useEffect(() => {
    // For testing purposes, to see if socket is properly passed down to virtual room
    console.log("SOCKET IN ROOM:", socket ? socket.id : 'null');

    //for testing once joined room.
    socket.on('user_already_in_room', (room) => {
      console.log(`User is already in the room: ${room}`);
    });
    socket.on('user_joined_room', (displayName) => {
      console.log(`User ${displayName} joined the room!`);
    });

    //acctually join the room
    joinVirtualRoom('test-room', socket);
  }, [socket]);


  return (
    <div className="virtual-room-page">
      <RoomSidebar />

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
          <RoomChatPanel message="Andreas: Temporary text" placeholder="Type a message..." />
          <RoomTools tools={roomTools} />
        </section>
      </main>
    </div>
  )
}
