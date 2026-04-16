import { useState } from 'react'
import '../App.css'
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

export default function VirtualRoom() {
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
