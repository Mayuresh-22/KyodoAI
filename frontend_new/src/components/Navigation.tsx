// Devangs Changes
import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onNavigate(''); // Navigate to home page
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);
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

          {/* Dashboard nav item - only show if user is authenticated */}
          {user && (
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
          )}

          {/* ChatRooms nav item - only show if user is authenticated */}
          {user && (
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
          )}

          {/* Authentication section */}
          {user ? (
            /* User menu for authenticated users */
            <div className="relative">
              <div
                className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-orange-600 transition-colors duration-200"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                aria-label="Open user menu"
                onKeyDown={(e) => e.key === 'Enter' && setShowUserMenu(!showUserMenu)}
              >
                <User size={18} />
              </div>
              
              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login button for unauthenticated users */
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors duration-200"
            >
              Sign In
            </button>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
