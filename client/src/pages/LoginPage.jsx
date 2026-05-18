import { useState } from 'react'
import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { useNavigate } from 'react-router-dom';
import { login } from '../script/login';
import { connect } from '../script/socketConection';

export default function LogInPage({ socket, setSocket }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');

    const result = await login(email, password);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const soc = connect(); // Test for first time connection
    setSocket(soc);
    navigate('/home');
  };

  return (
    <div className="LoginPage">
      <Sidebar />
      <main className="main-content">
        <form className="auth-box" onSubmit={handleLogin}>
          <h2>Sign in</h2>

          <div className="input-group">
            <label htmlFor="login-email">
              Email
              <span className="email-tooltip" tabIndex="0" aria-label="Only student emails are allowed">?</span>
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-actions">
            <button className="auth-button auth-button-primary" type="submit">
              Login
            </button>

            <button
              className="auth-button"
              type="button"
              onClick={() => navigate('/sign-up')}
            >
              Sign Up
            </button>
          </div>
          {error ? <p className="auth-error">{error}</p> : null}

        </form>
      </main>
    </div>
  );
}
