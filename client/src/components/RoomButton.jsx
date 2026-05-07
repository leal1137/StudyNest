import { useNavigate } from 'react-router-dom';
import '../CSSfiles/JoinRoomPage.css';

export default function RoomButton({ id, name, subject, size, lat, lng, inRoom, isPrivate }) {
    const navigate = useNavigate();

    const handleJoinClick = async () => {
        if (isPrivate) {
            const password = window.prompt(`Enter password for "${name}"`);

            if (password === null) return;

            const response = await fetch(`/api/rooms/${id}/verify-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await response.json();

            if (!response.ok || !data.valid) {
                alert('Incorrect room password.');
                return;
            }
        }

        navigate(`/virtual-room/${name}`, { state: { roomName: name } });
    };

    return (
        <button className={`room-button ${isPrivate ? 'private-room' : ''}`} onClick={handleJoinClick}>
            <span className="room-name">{name}</span>
            {isPrivate && <span className="room-private-label">Private</span>}
            <span className="room-stats">{inRoom || 0}/{size}</span>
            <span className="room-subject">{subject}</span>
        </button>
    );
}
