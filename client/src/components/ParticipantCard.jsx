import '../App.css'

export function ParticipantCard({ username, status, micMuted, speaking, onToggleMute }) {

  const dotColorClass = status === 'studying' ? 'study' : 'break';

  return (
    <article className="participant-card">
      <div className="participant-info">

        <span 
          className={`room-status-pill room-status-pill-${dotColorClass}`} 
          style={{ width: '18px', height: '18px', borderRadius: '50%', boxShadow: 'none', marginRight: '8px' }}
        />

        <span className="participant-name">{username}</span>
        <button
          className={`participant-mic-button ${micMuted ? 'muted' : ''}`}
          type="button"
          onClick={onToggleMute}
          aria-label={micMuted ? `Unmute ${username}` : `Mute ${username}`}
        >
          <span className="participant-mic-icon">{micMuted ? '🎙︎̸' : '🎙︎'}</span>
          <span className="participant-speaker-icon">{speaking ? '🔊' : '🔈'}</span>
        </button>
      </div>
      <span className={`participant-status participant-status-${status}`} aria-hidden="true" />
    </article>
  )
}
