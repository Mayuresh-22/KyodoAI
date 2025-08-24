import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    navigate(`/${page.toLowerCase()}`);
  };

  return <Dashboard onNavigate={handleNavigate} />;
};

export default DashboardPage;
