import React from 'react';
import { User } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-md rounded-full border border-gray-200 px-8 py-4 flex items-center justify-between shadow-lg">
          <button
            className="text-2xl font-bold text-orange-500 focus:outline-none"
            onClick={() => onNavigate('home')}
            aria-label="Go to Home"
          >
            Kyodo AI
          </button>
        
        <div className="flex items-center space-x-8">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              currentPage === 'home'
                ? 'text-orange-500 bg-orange-50'
                : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              currentPage === 'dashboard'
                ? 'text-orange-500 bg-orange-50'
                : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('chatrooms')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              currentPage === 'chatrooms'
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            ChatRooms
          </button>
          
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-orange-600 transition-colors duration-200">
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;