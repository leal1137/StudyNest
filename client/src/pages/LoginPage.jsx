import { useState } from 'react'
import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { useNavigate } from 'react-router-dom';
import { login } from '../script/login'

export default function LogInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    //alert(`Logging in as ${username}`);
    //navigate('/');
  };

  return (
    <div className="LoginPage">
      <Sidebar />

      <main className="main-content">
        <form className="Login-box" onSubmit={handleLogin}>
          <h2>Sign in</h2>

          <div className="input-group">
            <label>Email:</label>
            <input
              id='email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Username:</label>
            <input
              id='username'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              id='password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              Login
            </button>

            <button
              type="button"
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/sign-up')}
            >
              Sign Up
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}