import React from 'react';
// ...existing code...

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Landing page, no scan logic here

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Gradient Orb at Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] rounded-t-full z-0"
        style={{
          background: 'radial-gradient(circle at 60% 40%, #ffb86c 0%, #ff7e5f 60%, #ff6a00 100%)',
          filter: 'blur(40px)',
          opacity: 0.7,
          boxShadow: '0 0 80px 10px #ffb86c44',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      {/* Decorative Sparkles */}
      <div className="absolute top-1/4 left-1/4 sparkle">
        <img src="/stars.svg" alt="Stars" width={32} height={32} />
      </div>
      <div className="absolute top-1/3 right-1/4 sparkle" style={{ animationDelay: '1s' }}>
        <img src="/stars.svg" alt="Stars" width={24} height={24} />
      </div>
      <div className="absolute bottom-1/3 left-1/3 sparkle" style={{ animationDelay: '2s' }}>
        <img src="/stars.svg" alt="Stars" width={28} height={28} />
      </div>
      <div className="absolute top-1/2 right-1/3 sparkle" style={{ animationDelay: '0.5s' }}>
        <img src="/stars.svg" alt="Stars" width={20} height={20} />
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-2xl pb-32">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">Welcome to Kyodo AI</h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-xl mx-auto leading-relaxed">
          Your AI-powered brand deals assistant. Get started to discover, manage, and chat about your deals.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Get Started Now
          </button>
          <button
            onClick={() => alert('Login page coming soon!')}
            className="bg-white border border-orange-500 text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow hover:bg-orange-50"
          >
            Login
          </button>
          <button
            onClick={() => alert('Register page coming soon!')}
            className="bg-white border border-orange-500 text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow hover:bg-orange-50"
          >
            Register
          </button>
        </div>
      </div>

      {/* Background Gradient Circle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] rounded-full gradient-bg opacity-60 blur-3xl -z-10"></div>
    </div>
  );
};

export default HomePage;