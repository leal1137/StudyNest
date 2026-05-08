import { useState } from 'react'
import '../App.css'
import { Sidebar } from '../components/Sidebar'
import { useNavigate } from 'react-router-dom';
import { signup } from '../script/signup';
import { } from '../script/socketConection';
import { avatars, defaultAvatar } from '../assets/avatars';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {

    e.preventDefault();
      console.log("sign up clicked");
      console.log("Email:", email);
      console.log("Username:", username);
      console.log("Password:", password);
    
      const resultConstanst = await signup({ email, username, password, avatar });
    
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
        <form className="auth-box" onSubmit={handleSignUp}>
          <h2>Create Account</h2>

          <div className="input-group">
            <label htmlFor="signup-email">
              Email
              <span className="email-tooltip" tabIndex="0" aria-label="Only student emails are allowed">?</span>
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="avatar-picker avatar-picker-compact">
            <span className="avatar-picker-label">Choose avatar</span>
            <div className="avatar-picker-control">
              <button
                className="avatar-current-button"
                type="button"
                onClick={() => setIsAvatarPickerOpen((isOpen) => !isOpen)}
                aria-expanded={isAvatarPickerOpen}
                aria-label="Choose avatar"
              >
                <img src={avatars.find((avatarOption) => avatarOption.id === avatar)?.src} alt="" />
              </button>

              {isAvatarPickerOpen && (
                <div className="avatar-grid avatar-grid-popup" aria-label="Avatar options">
                  {avatars.map((avatarOption) => (
                    <button
                      className={`avatar-option ${avatar === avatarOption.id ? 'is-selected' : ''}`}
                      key={avatarOption.id}
                      type="button"
                      onClick={() => {
                        setAvatar(avatarOption.id);
                        setIsAvatarPickerOpen(false);
                      }}
                      aria-label={avatarOption.label}
                      aria-pressed={avatar === avatarOption.id}
                    >
                      <img src={avatarOption.src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="auth-actions">
            <button className="auth-button auth-button-primary" type="submit">
              Create Account
            </button>
            <button className="auth-button" type="button" onClick={() => navigate('/')}>
              Back to Login
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
