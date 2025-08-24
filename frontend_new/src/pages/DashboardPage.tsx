import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string, email_id?: string) => {
    if (page === 'chatrooms' && email_id) {
      navigate(`/chatrooms/${email_id}`);
    } else {
      navigate(`/${page.toLowerCase()}`);
    }
  };

  return <Dashboard onNavigate={handleNavigate} />;
};

export default DashboardPage;
