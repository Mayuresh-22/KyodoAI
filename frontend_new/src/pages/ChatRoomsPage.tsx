import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRooms from '../components/ChatRooms';

const ChatRoomsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    navigate(`/${page.toLowerCase()}`);
  };

  return <ChatRooms onNavigate={handleNavigate} />;
};

export default ChatRoomsPage;
