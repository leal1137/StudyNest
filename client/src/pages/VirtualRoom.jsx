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
  { userId: 1, username: 'Olle', status: 'studying', micMuted: false, speaking: true },
  { userId: 2, username: 'Andreas', status: 'studying', micMuted: true, speaking: true },
  { userId: 3, username: 'Måns', status: 'studying', micMuted: false, speaking: true },
  { userId: 4, username: 'Mille', status: 'studying', micMuted: false, speaking: true },
  { userId: 5, username: 'Ebba', status: 'studying', micMuted: false, speaking: true },
  { userId: 6, username: 'Leo', status: 'studying', micMuted: false, speaking: false },
  { userId: 7, username: 'Edvard', status: 'studying', micMuted: false, speaking: true },
  { userId: 8, username: 'Samir', status: 'break', micMuted: false, speaking: false },
]

const roomTools = ['Chatroom', 'Whiteboard']

export default function VirtualRoom({ socket }) {
  const [participants, setParticipants] = useState(initialParticipants)

  function handleToggleMute(participantId) {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) =>
        participant.userId === participantId
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
      console.log(`User ${displayName} joined the room!`);//uppdata chat
    });

    socket.on('list_participants_in_room', (list) => {
      const currentParticipants = list.participants_List;
      setParticipants(currentParticipants);
    });
    socket.on('user_left_room', (data) => {
      const currentParticipants = data.participants_List;
      const displayName = data.name;
      setParticipants(currentParticipants);
      console.log(`User ${displayName} left the room!`);//uppdata chat
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
              key={participant.userId}
              {...participant}
              onToggleMute={() => handleToggleMute(participant.userId)}
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
