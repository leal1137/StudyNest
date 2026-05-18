import '../App.css'
import { getAvatarSrc } from '../assets/avatars'

export function ParticipantCard({ username, status, micMuted, speaking, onToggleMute, isCurrentUser, voiceEnabled = true, avatar }) {

  const avatarSrc = getAvatarSrc(avatar)

  return (
    <article className="participant-card">
      <div className="participant-info">
        <img className="participant-avatar" src={avatarSrc} alt={`${username}'s avatar`} />

        <span className="participant-name">{username}</span>
        {voiceEnabled && (
          <button
            className={`participant-mic-button ${micMuted ? 'muted' : ''} ${isCurrentUser ? '' : 'is-disabled'}`}
            type="button"
            onClick={onToggleMute}
            disabled={!isCurrentUser}
            aria-label={micMuted ? `Unmute ${username}` : `Mute ${username}`}
          >
            <span className="participant-mic-icon">
              {micMuted ? <>&#127908;&#8416;</> : <>&#127908;</>}
            </span>
            <span className="participant-speaker-icon">
              {speaking ? <>&#128266;</> : <>&#128264;</>}
            </span>
          </button>
        )}
      </div>
      <span className={`participant-status participant-status-${status}`} aria-hidden="true" />
    </article>
  )
}
