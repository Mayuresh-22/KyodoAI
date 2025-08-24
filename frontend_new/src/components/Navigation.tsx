// Devangs Changes
import React from 'react';
import { User } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    // Outer nav wrapper centers content and constrains max width
    <nav className={` transition-all duration-300 ${
      currentPage === 'chatrooms' 
        ? 'hidden' 
        : 'transform-none'
    }`}>
      {/* Glassy pill container with subtle border and shadow */}
      <div className="max-w-4xl mx-auto mt-2 px-4">
        <div className={`bg-white/95 backdrop-blur-md rounded-full border border-gray-200/50 px-6 py-3 flex items-center justify-between shadow-lg transition-all duration-300 ${
          currentPage === 'chatrooms' ? 'hover:shadow-xl' : ''
        }`}>
          {/* Brand/Logo button: navigates to 'home' */}
          <button
            className="text-lg font-bold text-orange-500 hover:text-orange-600 focus:outline-none transition-colors duration-200"
            onClick={() => onNavigate('')}
            aria-label="Go to Home"
          >
            Kyodo AI
          </button>

          {/* Right-side nav cluster: primary links + user avatar */}
          <div className="flex items-center space-x-4">
          {/* Home nav item (active when currentPage === 'home') */}
          <button
            onClick={() => onNavigate('')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              currentPage === 'home'
                ? 'text-orange-500 bg-orange-50' // active state
                : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50' // inactive + hover
            }`}
            // Optional a11y improvement:
            // aria-current={currentPage === 'home' ? 'page' : undefined}
          >
            Home
          </button>

          {/* Dashboard nav item */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              currentPage === 'dashboard'
                ? 'text-orange-500 bg-orange-50'
                : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
            }`}
            // aria-current={currentPage === 'dashboard' ? 'page' : undefined}
          >
            Dashboard
          </button>

          {/* ChatRooms nav item */}
          <button
            onClick={() => onNavigate('chatrooms')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              currentPage === 'chatrooms'
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            // aria-current={currentPage === 'chatrooms' ? 'page' : undefined}
          >
            ChatRooms
          </button>

          {/* User/avatar button (currently decorative) 
             - Replace with an actual <button> plus onClick to open user menu/profile
             - Could render user's initial/photo if available from auth context
          */}
          <div
            className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-orange-600 transition-colors duration-200"
            role="button"
            tabIndex={0}
            onClick={() => onNavigate('profile')}
            aria-label="Open user menu"
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('profile')}
          >
            <User size={18} />
          </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
