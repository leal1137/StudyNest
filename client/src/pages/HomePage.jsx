import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { CustomButton } from '../components/CustomButton'
import heroImg from '../assets/vine.png'
import { useNavigate } from 'react-router-dom'
import { connect } from '../script/socketConection';
import { useEffect } from 'react'

export default function HomePage({ socket, setSocket}) {
  const navigate = useNavigate()


  
  const joinVirtualRoom = () => {
    navigate(`/join-virtual-room`); 
  };
  
  const joinLocation = () => {
    navigate('/find-location-map');
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
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1 className="home-title">StudyNest</h1>
          <p>The place you study the best</p>
          <img src={heroImg} alt="vine" className="vine-img" />

            <div className="button-group">
              <CustomButton 
                text="Join a virtual study room" 
                caption="Silent study rooms" 
                onClick={joinVirtualRoom}
              />
              <CustomButton 
                text="Find a study location" 
                caption="Find real world locations" 
                onClick={joinLocation}
              />
            </div>
        </div>
      </main>
    </div>
  )
}
