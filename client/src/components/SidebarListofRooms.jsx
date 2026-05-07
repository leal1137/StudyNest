import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import RoomButton from './RoomButton';
import { useNavigate } from 'react-router-dom';
export default function SidebarListofRooms({ rooms }) {
    const navigate = useNavigate()



    const expandsubjectlist = () => { }

    return (
        <div className='sidebar-listofrooms'>
            <div className="sidebar-header">
                <span className="menu-icon">≡</span>
                <h2>StudyNest</h2>
            </div>
            <h1 className="sidebar-title">List of rooms</h1>

            <div className="rooms-scroll-container">
                {rooms.map((room) => (
                    <RoomButton
                        key={room.id}
                        id={room.id}
                        name={room.name}
                        subject={room.subject}
                        inRoom={room.inRoom}
                        size={room.size}
                        isPrivate={room.isPrivate}
                    />
                ))}
            </div>

            <div className="sidebar-footer">
                <button className="choose-type-button" onClick={expandsubjectlist}>
                    Choose room type <span className="plus-icon">+</span>
                </button>
                <button className="create-room-green-button" onClick={() => navigate('/create-virtual-room')}>
                    Create room
                </button>
            </div>
        </div>

    )
}
