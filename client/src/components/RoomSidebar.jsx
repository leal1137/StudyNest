import { useState, useEffect } from 'react';
import '../App.css'

const statusOptions = [
  { label: 'Studying', modifier: 'study' },
  { label: 'Taking a break', modifier: 'break' },
]

// Ta emot socket och roomName som props från VirtualRoom.jsx
export function RoomSidebar({ onLeaveRoom, socket, roomName, onStatusChange }) {
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);

  const [myStatus, setMyStatus] = useState('studying');

  useEffect(() => {
    // Om ingen socket finns laddad än, gör ingenting
    if (!socket) return;
    
    // Lyssna på tidsuppdateringar från servern
    socket.on('timer_update', (data) => {
      setTimeLeft(data.timeLeft);
      setIsActive(data.isActive);
    });

    // Städa upp lyssnaren när komponenten tas bort
    return () => socket.off('timer_update');
  }, [socket]);

  // Skicka till servern att vi vill starta eller pausa
  const toggleTimer = () => {
    if (!socket || !roomName) return;
    socket.emit('timer_action', { 
      room: roomName, 
      action: isActive ? 'pause' : 'start' 
    });
  };

  // Skicka till servern att vi vill lägga till tid
  const addTime = () => {
    if (!socket || !roomName) return;
    socket.emit('timer_action', { 
      room: roomName, 
      action: 'add' 
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStatusChange = (modifier) => {
    const newStatus = modifier === 'study' ? 'studying' : 'break';
    setMyStatus(newStatus);

    if (onStatusChange) {
      onStatusChange(newStatus);
    }
    
    if (socket && roomName) {
      socket.emit('change_status', { room: roomName, status: newStatus });
    }
  };

  return (
    <aside className="room-sidebar">
      <div className="room-brand">
        <button className="room-menu-button" type="button" aria-label="Open menu"></button>
        <span>StudyNest</span>
      </div>

      <section className="room-sidebar-section">
        <p className="room-sidebar-label">Status</p>
        <div className="room-timer-display">
          <span className={`room-status-pill room-status-pill-${myStatus === 'studying' ? 'study' : 'break'}`} />
          <span>{myStatus === 'studying' ? 'Studying' : 'Taking a break'}</span>
        </div>
      </section>

      <section className="room-sidebar-section">
        <p className="room-sidebar-label">Choose a status</p>
        {statusOptions.map((option) => (
          <div 
            className="room-status-option" 
            key={option.label}
            onClick={() => handleStatusChange(option.modifier)}
            style={{ cursor: 'pointer' }}
          >
            <span>{option.label}</span>
            <span className={`room-status-pill room-status-pill-${option.modifier}`} />
          </div>
        ))}
      </section>

      <section className="room-sidebar-section">
        <p className="room-sidebar-label">Timer</p>
        <div className="room-timer-controls">
          
          <div 
            className="room-time-input" 
            onClick={toggleTimer}
            style={{ cursor: 'pointer' }}
            title={isActive ? "Pausa timer" : "Starta timer"}
          >
            <span>{formatTime(timeLeft)}</span>
            <span className={`room-status-pill ${isActive ? 'room-status-pill-study' : 'room-status-pill-break'}`} />
          </div>
          
          <button className="room-add-button" type="button" onClick={addTime}>
            +
          </button>
        </div>
      </section>

      <button className="room-break-button" type="button">
        Suggest a break
      </button>
      <button className="room-switch-button" type="button" onClick={onLeaveRoom}>
        Choose another room
      </button>
    </aside>
  );
}
