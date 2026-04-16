import '../App.css'

const participants = [
  { name: 'Olle', status: 'studying', micMuted: false, speaking: true },
  { name: 'Andreas', status: 'studying', micMuted: true, speaking: true },
  { name: 'Måns', status: 'studying', micMuted: false, speaking: true },
  { name: 'Mille', status: 'studying', micMuted: false, speaking: true },
  { name: 'Ebba', status: 'studying', micMuted: false, speaking: true },
  { name: 'Leo', status: 'studying', micMuted: false, speaking: false },
  { name: 'Edward', status: 'studying', micMuted: false, speaking: true },
  { name: 'Samir', status: 'break', micMuted: false, speaking: false },
]

function ParticipantCard({ name, status, micMuted, speaking }) {
  return (
    <article className="participant-card">
      <div className="participant-info">
        <span className="participant-name">{name}</span>
        <span className={`participant-mic ${micMuted ? 'muted' : ''}`}>
          {micMuted ? '🎙︎̸' : '🎙︎'} {speaking ? '🔊' : '🔈'}
        </span>
      </div>
      <span className={`participant-status participant-status-${status}`} aria-hidden="true" />
    </article>
  )
}

export default function VirtualRoom() {
  return (
    <div className="virtual-room-page">
      <aside className="room-sidebar">
        <div className="room-brand">
          <button className="room-menu-button" type="button" aria-label="Open menu">
            ☰
          </button>
          <span>StudyNest</span>
        </div>

        <section className="room-sidebar-section">
          <p className="room-sidebar-label">Status</p>
          <div className="room-timer-display">
            <span className="room-status-pill room-status-pill-study" />
            <span>50:23</span>
          </div>
        </section>

        <section className="room-sidebar-section">
          <p className="room-sidebar-label">Choose a status</p>
          <div className="room-status-option">
            <span>Studying</span>
            <span className="room-status-pill room-status-pill-study" />
          </div>
          <div className="room-status-option">
            <span>Taking a break</span>
            <span className="room-status-pill room-status-pill-break" />
          </div>
        </section>

        <section className="room-sidebar-section">
          <p className="room-sidebar-label">Timer</p>
          <div className="room-timer-controls">
            <div className="room-time-input">
              <span>10 min</span>
              <span className="room-status-pill room-status-pill-break" />
            </div>
            <button className="room-add-button" type="button">
              +
            </button>
          </div>
        </section>

        <button className="room-break-button" type="button">
          Suggest a break
        </button>
        <button className="room-switch-button" type="button">
          Choose another room
        </button>
      </aside>

      <main className="virtual-room-main">
        <div className="virtual-room-header">
          <div className="room-chip">Study room 1</div>
          <div className="room-people-count">
            <span>Number of people studying:</span>
            <span className="room-people-badge">548</span>
          </div>
        </div>

        <section className="participant-grid">
          {participants.map((participant) => (
            <ParticipantCard key={participant.name} {...participant} />
          ))}
        </section>

        <section className="virtual-room-lower">
          <div className="room-chat-panel">
            <div className="room-chat-feed">Andreas: Temporary text</div>
            <div className="room-chat-input">Type a message...</div>
          </div>

          <div className="room-tools">
            <button className="room-tool-button" type="button">
              Chatroom
            </button>
            <button className="room-tool-button" type="button">
              Whiteboard
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
