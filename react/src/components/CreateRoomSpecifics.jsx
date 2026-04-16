import { useState } from 'react'
import '../App.css'
import { SubjectSelector } from './SubjectSelector';
import { CustomButton } from './customButton';

export default function CreateRoomSettings() {
    const [roomName, setRoomName] = useState('');
    const [roomSize, setRoomSize] = useState(15);
    const [jointWorkspace, setJointWorkspace] = useState(false);

    const CreateNewRoom = (e) => {
        e.preventDefault();
        alert("Creating a new room");
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
