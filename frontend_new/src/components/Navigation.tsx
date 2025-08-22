import React from 'react';
import { User } from 'lucide-react';

/**
 * Props for the Navigation component
 * - currentPage: the active route/page key used to visually highlight the active nav item
 * - onNavigate: handler to request navigation to a given page key (parent handles actual routing/state)
 */
interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

/**
 * Top-level site navigation bar
 * - Renders brand/logo button
 * - Renders primary nav links (Home, Dashboard, ChatRooms)
 * - Renders a user avatar button (currently icon-only)
 * - Uses Tailwind for layout, blur, rounded pill background, and active/hover states
 *
 * Notes:
 * - This is a presentational component: it does not own routing; it delegates via onNavigate
 * - Active link styles are computed by comparing 'currentPage' against each page key
 * - Accessible: brand has aria-label; consider adding aria-current for active links
 */
const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    // Outer nav wrapper centers content and constrains max width
    <nav className="w-full max-w-6xl mx-auto p-6">
      {/* Glassy pill container with subtle border and shadow */}
      <div className="bg-white/80 backdrop-blur-md rounded-full border border-gray-200 px-8 py-4 flex items-center justify-between shadow-lg">
        {/* Brand/Logo button: navigates to 'home' */}
        <button
          className="text-2xl font-bold text-orange-500 focus:outline-none"
          onClick={() => onNavigate('home')}
          aria-label="Go to Home"
        >
          Kyodo AI
        </button>

        {/* Right-side nav cluster: primary links + user avatar */}
        <div className="flex items-center space-x-8">
          {/* Home nav item (active when currentPage === 'home') */}
          <button
            onClick={() => onNavigate('home')}
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
            className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-orange-600 transition-colors duration-200"
            // onClick={openUserMenu}
            // aria-label="Open user menu"
            role="button"
            tabIndex={0}
            // onKeyDown={(e) => e.key === 'Enter' && openUserMenu()}
          >
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
