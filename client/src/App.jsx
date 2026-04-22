import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import VirtualRoom from './pages/VirtualRoom';
import SignUpPage from './pages/SignUpPage';
import JoinVirtualRoomPage from './pages/JoinVirtualRoomPage';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/createroom" element={<CreateRoomPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/joinvirtualroom" element={<JoinVirtualRoomPage/>} />
        <Route path="/virtual-room" element={<VirtualRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
