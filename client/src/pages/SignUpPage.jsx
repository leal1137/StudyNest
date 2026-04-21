import { useState } from 'react'
import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { useNavigate } from 'react-router-dom';
import { signup } from '../script/signup';
import { } from '../script/socketConection';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {

    e.preventDefault();
      console.log("sign up clicked");
      console.log("Email:", email);
      console.log("Username:", username);
      console.log("Password:", password);
    
      const resultConstanst = await signup({ email, username, password });
    
      if (resultConstanst.success) { 
        alert(`Sign up success!`);
        navigate('/');
      }
      
      else {
        alert(resultConstanst.message);
      }
  };

  return (
    <div className="SignUpPage">
      <Sidebar />

      <main className="main-content">
        <form className="Login-box" onSubmit={handleSignUp}>
          <h2>Create Account</h2>

          <div className="input-group">
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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