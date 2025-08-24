import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomePageComponent from '../components/HomePage';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    navigate(`/${page.toLowerCase()}`);
  };

  return <HomePageComponent onNavigate={handleNavigate} />;
};

export default HomePage;
