// Devangs Changes
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import { AuthProvider } from './components/auth/AuthContext';
import Auth from './components/auth/Auth';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ChatRoomsPage from './pages/ChatRoomsPage';

const NavigationWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname.slice(1) || 'home';
  
  const handleNavigate = (page: string) => {
    navigate(`/${page.toLowerCase()}`);
  };

  return <Navigation currentPage={currentPage} onNavigate={handleNavigate} />;
};

const AppContent = () => {
  const navigate = useNavigate();

  const handlePageChange = (page: string) => {
    navigate(`/${page.toLowerCase()}`);
  };

  return (
    <AuthProvider setCurrentPage={handlePageChange}>
      <div>
        <NavigationWrapper />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chatrooms" element={<ChatRoomsPage />} />
          <Route path="/chatrooms/:email_id" element={<ChatRoomsPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
