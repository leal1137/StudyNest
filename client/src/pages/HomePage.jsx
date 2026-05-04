import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { CustomButton } from '../components/CustomButton'
import heroImg from '../assets/vine.png'
import { useNavigate } from 'react-router-dom'
import UserDisplay from '../components/UserDisplay'
import { connect, logoutDisconnect } from '../script/socketConection';
import { useEffect } from 'react'

export default function HomePage({ socket, setSocket }) {
  const navigate = useNavigate()

  const handleClick1 = () => alert("Button 1 clicked!");
  const handleClick2 = () => alert("Button 2 clicked!");
  const handleClick3 = () => {
    navigate('/virtual-room');
  };
  const logout = () => {
    logoutDisconnect(socket);
    setSocket(null);
    console.log("SOCKET IN HOMEPAGE:", socket ? socket.id : 'null');
    navigate('/');
  };
  
  //for testing purposes, to see if socket is properly passed down to homepage
  useEffect(() => {
    connect(); // Test for first time connection
    console.log("SOCKET IN HOMEPAGE:", socket ? socket.id : 'null');
  }, [socket]);



  
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
              <CustomButton 
                text="Join a joint workspace" 
                caption="Work together with others in a virtual study room"
                onClick={handleClick3} 
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
