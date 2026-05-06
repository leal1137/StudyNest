import { useNavigate } from 'react-router-dom';
import '../CSSfiles/JoinRoomPage.css';

export default function RoomButton({ id, name, subject, size, lat, lng, inRoom }) {
    const navigate = useNavigate();

    const handleJoinClick = () => {
        // Navigate to the VirtualRoom page and pass the room name in the state
        navigate(`/virtual-room/${name}`, { state: { roomName: name } });
    };

    return (
        <button className='room-button' onClick={handleJoinClick}>
            <span className="room-name">{name}</span>
            <span className="room-stats">{inRoom || 0}/{size}</span>
            <span className="room-subject">{subject}</span>
        </button>
    );
}