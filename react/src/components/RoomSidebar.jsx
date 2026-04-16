import '../App.css'

const statusOptions = [
  { label: 'Studying', modifier: 'study' },
  { label: 'Taking a break', modifier: 'break' },
]

export function RoomSidebar() {
  return (
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
        {statusOptions.map((option) => (
          <div className="room-status-option" key={option.label}>
            <span>{option.label}</span>
            <span className={`room-status-pill room-status-pill-${option.modifier}`} />
          </div>
        ))}
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
  )
}
