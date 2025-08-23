import React, { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import ChatRooms from './components/ChatRooms';
import Navigation from './components/Navigation';
import RegistrationForm from './components/RegistrationForm'; // Add this import

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === 'chatrooms' && <ChatRooms onNavigate={setCurrentPage} />}
      {currentPage === 'register' && <RegistrationForm onNavigate={setCurrentPage} />}
    </div>
  );
}

export default App;
