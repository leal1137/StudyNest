import { useState } from 'react'
import '../App.css'
import { Sidebar } from '../components/Sidebar'

export default function CreateRoomPage() {
  const [Roomname, setRoomname] = useState('');
    


    return(
        <div className="CreateRoomPage">
          <Sidebar/>
          <main className="main-content">
            <form className='NewRoomName'>
            <div className="input-new-room-name">
              <h2>Name of room</h2>
                <label>Name of room</label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
                </div>
                



            </form>
          </main>
        
        </div>
    );

}
