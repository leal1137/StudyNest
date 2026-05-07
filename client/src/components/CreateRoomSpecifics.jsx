import { useState } from 'react';
import '../App.css';
import { SubjectSelector } from './SubjectSelector';
import { CustomButton } from './CustomButton';
import { useNavigate } from 'react-router-dom';

export default function CreateRoomSettings({ pinPosition }) {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState('');
    const [roomSize, setRoomSize] = useState(15);
    const [isPrivate, setIsPrivate] = useState(false);
    const [roomPassword, setRoomPassword] = useState('');
    const [chatEnabled, setChatEnabled] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [whiteboardEnabled, setWhiteboardEnabled] = useState(true);

    const CreateNewRoom = async (e) => {
        e.preventDefault();

        if (!pinPosition) {
            alert("Please click on the map to choose a location first!");
            return;
        }

        const newRoomData = {
            name: roomName,
            size: parseInt(roomSize),
            x: pinPosition.x,
            y: pinPosition.y,
            isPrivate,
            password: isPrivate ? roomPassword : '',
            chatEnabled,
            voiceEnabled,
            whiteboardEnabled
        };

        try {
            const response = await fetch('/api/virtual-rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRoomData)
            });

            if (response.ok) {
                const createdRoom = await response.json();
                alert(`Success! The room "${createdRoom.name}" has been created.`);
                navigate(`/virtual-room/${encodeURIComponent(createdRoom.name)}`, {
                    state: {
                        roomName: createdRoom.name,
                        chatEnabled: createdRoom.chatEnabled,
                        voiceEnabled: createdRoom.voiceEnabled,
                        whiteboardEnabled: createdRoom.whiteboardEnabled
                    }
                });
            } else {
                const error = await response.json();
                alert(error.error || "Could not create the room.");
            }
        } catch (error) {
            alert("Could not reach the server.");
        }
    };

    return (
        <form className="CreateRoomForm" onSubmit={CreateNewRoom}>
            <div className="input-new-room-name">
                <h4>Name</h4>
                <input className='Input'
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                />
            </div>
            <div className="input-room-size">
                <h4>Room size</h4>
                <input className='input'
                    type="Number"
                    value={roomSize}
                    onChange={(e) => setRoomSize(e.target.value)}
                    max="50" min="1"
                />
                <span>max 50</span>
            </div>
            <SubjectSelector />
            <div className="workspace-checkbox private-room-settings">
                <label>
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    Private room
                </label>
                {isPrivate && (
                    <input
                        className="Input"
                        type="password"
                        value={roomPassword}
                        onChange={(e) => setRoomPassword(e.target.value)}
                        placeholder="Room password"
                        required
                    />
                )}
            </div>
            <div className="workspace-checkbox workspace-feature-settings">
                <h4>Room tools</h4>
                <label>
                    <input
                        type="checkbox"
                        checked={chatEnabled}
                        onChange={(e) => setChatEnabled(e.target.checked)}
                    />
                    Chat box
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={voiceEnabled}
                        onChange={(e) => setVoiceEnabled(e.target.checked)}
                    />
                    Voice chat
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={whiteboardEnabled}
                        onChange={(e) => setWhiteboardEnabled(e.target.checked)}
                    />
                    Whiteboard
                </label>
            </div>
            <CustomButton className='Create-room-button' text="CreateRoom" />
        </form>
    );
}
