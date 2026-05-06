import { useState } from 'react'
import '../App.css'
import { SubjectSelector } from './SubjectSelector';
import { CustomButton } from './customButton';
import { useNavigate } from 'react-router-dom';
export default function CreateRoomSettings() {
    const navigate = useNavigate()
    const [roomName, setRoomName] = useState('');
    const [roomSize, setRoomSize] = useState(15);
    const [jointWorkspace, setJointWorkspace] = useState(false);

    const CreateNewRoom = async (e) => {
        e.preventDefault();


        if (!pinPosition) {
            alert("Please click on the map to choose a location first!");
            return;
        }
        const newRoomData = {
            name: roomName,
            max_capacity: parseInt(roomSize),
            is_silent: !jointWorkspace,
            x: pinPosition.x, 
            y: pinPosition.y

            //created_by: localStorage.getItem('token')
        };

        try {
            const response = await fetch('http://localhost:3000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRoomData)
            });

            if (response.ok) {
                const savedRoom = await response.json();
                alert(`Succé! Rummet "${savedRoom.name}" har skapats.`);
                navigate('/join-virtual-room');
            } else {
                const errorData = await response.json();
                alert(`Kunde inte skapa rummet: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Nätverksfel:", error);
            alert("Kunde inte nå servern");
        }
    };

    return (
        <form className="CreateRoomForm" onSubmit={CreateNewRoom}>
            <div className="input-new-room-name">
                <h4>Name</h4>
                <input className='Input'
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)} />
            </div>

            <div className="input-room-size">
                <h4>Room size</h4>
                <input className='input'
                    type="Number"
                    value={roomSize}
                    onChange={(e) => setRoomSize(e.target.value)}
                />
                <span>max 50</span>
            </div>
            <SubjectSelector />
            <div className="workspace-checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={jointWorkspace}
                        onChange={(e) => setJointWorkspace(e.target.checked)}
                    />
                    Joint workspace
                </label>
                <p className="hint-text">
                    Clicking this box enables: <br />
                    Chat box, Voice chat, Whiteboard
                </p>
            </div>
            <CustomButton
                className='Create-room-button'
                text="CreateRoom"
            />
        </form>
    )
}
