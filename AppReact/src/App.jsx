import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import SettingPage from './pages/SettingPage';
import InfoPage from './pages/InfoPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/Info" element={<InfoPage/>} />
      </Routes>
    </Router>
  );
}