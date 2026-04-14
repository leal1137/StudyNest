import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { CustomButton } from '../components/customButton'
import heroImg from '../assets/vine.png'
import { NavLink, useNavigate } from 'react-router-dom';


export default function HomePage() {

  const handleClick1 = () => alert("Button 1 clicked!");
  const handleClick2 = () => alert("Button 2 clicked!");
  const handleClick3 = () => alert("Button 3 clicked!");
  const navigate = useNavigate();   

  return (
    <div className="HomePage">
      <Sidebar />
      <main className="main-content">
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1 className="home-title">StudyNest</h1>
          <p>What would you like to do?</p>
          <img src={heroImg} alt="vine" className="vine-img" />

            <div className="button-group">
              <CustomButton 
                text="Join a virtual study room" 
                caption="Silent study rooms" 
                onClick={() => navigate('/createroom')}
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
            </div>
        </div>
      </main>
    </div>
  )
}
