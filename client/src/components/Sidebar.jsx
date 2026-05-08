import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { avatars, defaultAvatar } from '../assets/avatars'
import { logoutDisconnect } from '../script/socketConection'
import logoutIcon from '../assets/logout.svg'

export function Sidebar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('avatar') || defaultAvatar);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUsername(localStorage.getItem('username') || '');
      setSelectedAvatar(localStorage.getItem('avatar') || defaultAvatar);
    };

    window.addEventListener("storage", checkToken);
    window.addEventListener("userLoggedIn", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("userLoggedIn", checkToken);
    };
  }, []);

  async function handleAvatarChange(avatar) {
    const previousAvatar = selectedAvatar;

    setSelectedAvatar(avatar);
    setAvatarError('');
    localStorage.setItem('avatar', avatar);
    window.dispatchEvent(new CustomEvent('avatarChanged', { detail: { avatar } }));

    try {
      const response = await fetch('/api/users/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ avatar }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not update avatar');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    } catch (error) {
      setSelectedAvatar(previousAvatar);
      localStorage.setItem('avatar', previousAvatar);
      window.dispatchEvent(new CustomEvent('avatarChanged', { detail: { avatar: previousAvatar } }));
      setAvatarError(error.message);
    }
  }

  function handleSignOut() {
    logoutDisconnect();
    setIsLoggedIn(false);
    setUsername('');
    setIsAvatarPickerOpen(false);
    window.dispatchEvent(new Event('userLoggedOut'));
    navigate('/');
  }

  return (
    <nav className={`sidebar ${isAvatarPickerOpen ? 'is-avatar-picker-open' : ''}`}>
      <div className="menu-icon">≡</div>

      <ul className="menu">
        <li>
          <Link to="/">
            <span className="icon">🔐</span>
            <span className="text">Login</span>
          </Link>
        </li>

        {isLoggedIn && (
          <li>
            <Link to="/home">
              <span className="icon">🏠</span>
              <span className="text">HomePage</span>
            </Link>
          </li>
        )}
      </ul>

      {isLoggedIn && (
        <div className="sidebar-account">
          <p className="sidebar-account-label">
            <span className="text sidebar-account-text">
              Logged in as:
              <span className="sidebar-account-username">{username}</span>
            </span>
          </p>

          <div className="sidebar-avatar-item">
            <button
              className="sidebar-avatar-button"
              type="button"
              onClick={() => setIsAvatarPickerOpen((isOpen) => !isOpen)}
              aria-expanded={isAvatarPickerOpen}
              aria-label="Choose avatar"
            >
              <img
                className="icon sidebar-avatar-preview"
                src={avatars.find((avatar) => avatar.id === selectedAvatar)?.src}
                alt=""
              />
              <span className="text sidebar-avatar-text">Change avatar</span>
            </button>

            {isAvatarPickerOpen && (
              <div className="sidebar-avatar-picker" aria-label="Avatar options">
                {avatars.map((avatarOption) => (
                  <button
                    className={`sidebar-avatar-option ${selectedAvatar === avatarOption.id ? 'is-selected' : ''}`}
                    key={avatarOption.id}
                    type="button"
                    onClick={() => {
                      handleAvatarChange(avatarOption.id);
                      setIsAvatarPickerOpen(false);
                    }}
                    aria-label={avatarOption.label}
                    aria-pressed={selectedAvatar === avatarOption.id}
                  >
                    <img src={avatarOption.src} alt="" />
                  </button>
                ))}
                {avatarError && <p className="sidebar-avatar-error">{avatarError}</p>}
              </div>
            )}
          </div>

          <button className="sidebar-sign-out-button" type="button" onClick={handleSignOut}>
            <img className="icon sidebar-sign-out-icon" src={logoutIcon} alt="" />
            <span className="text">Sign out</span>
          </button>
        </div>
      )}
    </nav>
  );
}
