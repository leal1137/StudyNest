import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  return (
    <nav className="sidebar">
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
    </nav>
  );
}