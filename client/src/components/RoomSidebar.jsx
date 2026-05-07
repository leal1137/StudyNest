import { useState, useEffect } from 'react';
import '../App.css'

const statusOptions = [
  { label: 'Studying', modifier: 'study' },
  { label: 'Taking a break', modifier: 'break' },
]

export function RoomSidebar({ onLeaveRoom, socket, roomName, onStatusChange }) {
  // Sätter initialt state till 25 minuter (1500 sekunder)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [myStatus, setMyStatus] = useState('studying');

  useEffect(() => {
    if (!socket) return;
    
    socket.on('timer_update', (data) => {
      setTimeLeft(data.timeLeft);
      setIsActive(data.isActive);
    });

    return () => socket.off('timer_update');
  }, [socket]);

  const toggleTimer = () => {
    if (!socket || !roomName) return;
    socket.emit('timer_action', { 
      room: roomName, 
      action: isActive ? 'pause' : 'start' 
    });
  };

  // NYA FUNKTIONER FÖR POMODORO
  const setStudyTime = () => {
    if (!socket || !roomName) return;
    socket.emit('timer_action', { room: roomName, action: 'pomodoro_study' });
    
    // Autobyter din status till "studying" när du sätter en studietimer
    handleStatusChange('study'); 
  };

  const setBreakTime = () => {
    if (!socket || !roomName) return;
    socket.emit('timer_action', { room: roomName, action: 'pomodoro_break' });
    
    // Autobyter din status till "break" när du sätter en paustimer
    handleStatusChange('break');
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

      {/* NY LAYOUT FÖR POMODORO TIMERN */}
      <section className="room-sidebar-section">
        <p className="room-sidebar-label">Pomodoro Timer</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div 
            className="room-time-input" 
            onClick={toggleTimer}
            style={{ cursor: 'pointer', justifyContent: 'center' }}
            title={isActive ? "Pausa timer" : "Starta timer"}
          >
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
            <span
              className={`room-status-pill ${isActive ? 'room-status-pill-study' : 'room-status-pill-pomodoro'}`}
              style={{ marginLeft: '12px' }}
            />
          </div>
          
          {/* Knapparna under timern */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="room-break-button" 
              type="button" 
              onClick={setStudyTime}
              style={{ flex: 1, padding: '8px', margin: 0, fontSize: '0.85rem' }}
            >
              🍅 25 min
            </button>
            <button 
              className="room-break-button" 
              type="button" 
              onClick={setBreakTime}
              style={{ flex: 1, padding: '8px', margin: 0, fontSize: '0.85rem', background: '#d6a848', color: '#111' }}
            >
              ☕ 5 min
            </button>
          </div>

        </div>
      </section>

      <button className="room-switch-button" style={{ marginTop: 'auto' }} type="button" onClick={onLeaveRoom}>
        Choose another room
      </button>
    </aside>
  );
}
