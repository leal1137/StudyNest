import '../App.css'
import { Link } from 'react-router-dom'

export function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="menu-icon">≡</div>

      <ul className="menu">
        <li><Link to="/">Login</Link></li>
        <li><Link to="/home">HomePage</Link></li>
      </ul>
    </nav>  
  );
}