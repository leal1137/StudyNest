import '../App.css'

export function ParticipantCard({ username, status, micMuted, speaking, onToggleMute }) {
  return (
    <article className="participant-card">
      <div className="participant-info">
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
