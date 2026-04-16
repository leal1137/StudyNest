import '../App.css'
import { Link } from 'react-router-dom'

export function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="menu-icon">≡</div>

      <ul className="menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>  
  );
}