import { useState } from 'react'
import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    alert(`Account created for ${username}`);

    navigate('/login');
  };

  return (
    <div className="SignUpPage">
      <Sidebar />

      <main className="main-content">
        <form className="Login-box" onSubmit={handleSignUp}>
          <h2>Create Account</h2>

          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Create Account
          </button>

        </form>
      </main>
    </div>
  );
}