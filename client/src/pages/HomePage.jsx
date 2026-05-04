import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { CustomButton } from '../components/CustomButton'
import heroImg from '../assets/vine.png'
import { useNavigate } from 'react-router-dom'
import UserDisplay from '../components/UserDisplay'
import {socket, logoutDisconnect, connect } from '../script/socketConection';
import { useEffect } from 'react'

export default function HomePage() {
  const navigate = useNavigate()

  const handleClick2 = () => navigate('/find-location-map');
  const handleClick1 = () => navigate('/virtual-room');
  const logout = () => {
    alert("logout button clicked!!!!!!");
  };

  return (
    <div className="HomePage">
      <Sidebar />
      <main className="main-content">
        <UserDisplay />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1 className="home-title">StudyNest</h1>
          <p>What would you like to do?</p>
          <img src={heroImg} alt="vine" className="vine-img" />

            <div className="button-group">
              <CustomButton 
                text="Join a virtual study room" 
                caption="Silent study rooms" 
                onClick={handleClick1}
              />
              <CustomButton 
                text="Find a study location" 
                caption="Find real world locations" 
                onClick={handleClick2}
              />
              <button
                className="Sign-out-button"
                type="button"
                onClick={logout}
              >
                Sign Out
              </button>
            </div>
        </div>
      </main>
    </div>
  )
}
