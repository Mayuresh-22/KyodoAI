import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const handleScanMailBox = () => {
    onNavigate('dashboard');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Decorative Sparkles */}
      <div className="absolute top-1/4 left-1/4 text-orange-400 sparkle">
        <Sparkles size={32} />
      </div>
      <div className="absolute top-1/3 right-1/4 text-pink-400 sparkle" style={{ animationDelay: '1s' }}>
        <Sparkles size={24} />
      </div>
      <div className="absolute bottom-1/3 left-1/3 text-orange-300 sparkle" style={{ animationDelay: '2s' }}>
        <Sparkles size={28} />
      </div>
      <div className="absolute top-1/2 right-1/3 text-pink-300 sparkle" style={{ animationDelay: '0.5s' }}>
        <Sparkles size={20} />
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Let's Check what you got there!
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
          scans through your mail box to find mails
          <br />
          related to brand deals!!
        </p>
        
        <button
          onClick={handleScanMailBox}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-3 mx-auto transition-all duration-300 button-bounce shadow-xl hover:shadow-2xl"
        >
          <Search size={24} />
          <span>Scan Mail Box</span>
        </button>
      </div>

      {/* Background Gradient Circle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] rounded-full gradient-bg opacity-60 blur-3xl -z-10"></div>
    </div>
  );
};

export default HomePage;