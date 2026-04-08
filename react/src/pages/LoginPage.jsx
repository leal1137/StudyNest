import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

import '../App.css'
import { Sidebar } from '../components/Sidebar'


export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logging in as ${username}`);
  };

    return (
        <div className="LoginPage"> 
        <Sidebar />

        <main className="main-content">
            <form className="Login-box" onSubmit={handleLogin}>
                <h2> Sign in</h2>
                
                <div className="input-group">
                    <label>Username:</label>
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    
                <div className="input-group">
                <label>Password:</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" style={{padding: '10px 20px', fontSize: '18px',
                                              cursor: 'pointer', margintop: '201px'}}>
                    Login
                </button>
            </form>
        </main>            
    </div> 
    );
}
