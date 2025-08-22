import React, { useState } from 'react';
import { Search, User, Sparkles, Send, Rocket } from 'lucide-react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const HomePage = () => (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 rounded-full border border-gray-300 px-6 sm:px-8 py-4 flex items-center justify-between">
            <div className="text-xl sm:text-2xl font-medium text-orange-500">Kyodo AI</div>
            <div className="flex items-center space-x-4 sm:space-x-8">
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-200 text-sm sm:text-base"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('chatrooms')}
                className="text-black font-medium hover:text-gray-700 transition-colors duration-200 text-sm sm:text-base"
              >
                ChatRooms
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                <User size={16} className="text-white sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative Sparkles */}
        <div className="absolute top-1/4 left-1/4 text-orange-400 animate-pulse hidden sm:block">
          <Sparkles size={32} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-pink-400 animate-pulse hidden sm:block" style={{ animationDelay: '1s' }}>
          <Sparkles size={24} />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-orange-300 animate-pulse hidden lg:block" style={{ animationDelay: '2s' }}>
          <Sparkles size={28} />
        </div>
        <div className="absolute top-1/2 right-1/3 text-pink-300 animate-pulse hidden lg:block" style={{ animationDelay: '0.5s' }}>
          <Sparkles size={20} />
        </div>

        <div className="text-center max-w-4xl mx-auto fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
            Let's Check what you got there!
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
            scans through your mail box to find mails<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>related to brand deals!!
          </p>
          
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium flex items-center space-x-3 mx-auto transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Search size={20} />
            <span>Scan Mail Box</span>
          </button>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-full border border-gray-300 px-6 sm:px-8 py-4 flex items-center justify-between">
            <div className="text-xl sm:text-2xl font-medium text-orange-500">Kyodo AI</div>
            <div className="flex items-center space-x-4 sm:space-x-8">
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-200 text-sm sm:text-base"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('chatrooms')}
                className="text-black font-medium hover:text-gray-700 transition-colors duration-200 text-sm sm:text-base"
              >
                ChatRooms
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                <User size={16} className="text-white sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        {/* Rescan Button */}
        <div className="text-center mb-8 sm:mb-12">
          <button className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium flex items-center space-x-3 mx-auto transition-all duration-300 transform hover:scale-105">
            <Search size={20} />
            <span>Rescan Mails</span>
          </button>
        </div>

        {/* Rocket */}
        <div className="mb-8 sm:mb-12 flex justify-start max-w-7xl mx-auto">
          <div className="ml-4 sm:ml-12">
            <Rocket size={48} className="text-orange-500 sm:w-16 sm:h-16 hover:text-orange-600 transition-colors duration-300" />
          </div>
        </div>

        {/* Deal Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 - AI Activated */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 fade-in">
            <div className="text-sm text-gray-500 mb-3">02 Aug 2025</div>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">Deal Title</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed break-words">
              deal summary....................................................................................................
            </p>
            <div className="mb-6">
              <div className="font-semibold text-black">Company Name</div>
              <div className="text-gray-600">Budget</div>
            </div>
            <button 
              onClick={() => setCurrentPage('chatrooms')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              AI Activated
            </button>
          </div>

          {/* Card 2 - Active AI */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-sm text-gray-500 mb-3">02 Aug 2025</div>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">Deal Title</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed break-words">
              deal summary....................................................................................................
            </p>
            <div className="mb-6">
              <div className="font-semibold text-black">Company Name</div>
              <div className="text-gray-600">Budget</div>
            </div>
            <button className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Active AI
            </button>
          </div>

          {/* Card 3 - Active AI */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 fade-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
            <div className="text-sm text-gray-500 mb-3">02 Aug 2025</div>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">Deal Title</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed break-words">
              deal summary....................................................................................................
            </p>
            <div className="mb-6">
              <div className="font-semibold text-black">Company Name</div>
              <div className="text-gray-600">Budget</div>
            </div>
            <button className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Active AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ChatRooms = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-full border border-gray-300 px-6 sm:px-8 py-4 flex items-center justify-between">
            <div className="text-xl sm:text-2xl font-medium text-orange-500">Kyodo AI</div>
            <div className="flex items-center space-x-4 sm:space-x-8">
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-200 text-sm sm:text-base"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('chatrooms')}
                className="text-black font-medium hover:text-gray-700 transition-colors duration-200 text-sm sm:text-base"
              >
                ChatRooms
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                <User size={16} className="text-white sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-orange-500 p-4 sm:p-6 lg:rounded-r-3xl lg:ml-6 slide-in-left">
          <div className="space-y-4">
            <button className="w-full bg-white text-orange-500 p-3 sm:p-4 rounded-2xl font-semibold text-left hover:bg-gray-50 transition-colors duration-200">
              Deal 1 Title
            </button>
            <button className="w-full bg-orange-400 hover:bg-orange-300 text-white p-3 sm:p-4 rounded-2xl font-semibold text-left transition-colors duration-200">
              Deal 2 Title
            </button>
            <button className="w-full bg-orange-400 hover:bg-orange-300 text-white p-3 sm:p-4 rounded-2xl font-semibold text-left transition-colors duration-200">
              Deal 3 Title
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col lg:mr-6 mt-4 lg:mt-0">
          {/* Chat Header */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 mx-4 lg:mx-0 slide-in-right">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Deal Title</h1>
              <div className="flex items-center space-x-4 sm:space-x-8 text-sm sm:text-base">
                <span className="font-semibold text-black">Company Name</span>
                <span className="text-gray-600">Status</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 mx-4 lg:mx-0 space-y-4 sm:space-y-6 overflow-y-auto">
            {/* AI Message */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-6 fade-in">
              <div className="flex items-start space-x-3 mb-4">
                <Sparkles className="text-orange-500 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-black mb-4 text-sm sm:text-base leading-relaxed">
                    Since Portia AI (Cloud API) agents often need a reference image when you're building a visual/
                    keyword-based search agent, the reference image is usually:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-black mb-4 text-sm sm:text-base">
                    <li>An example input image you want your agent to work on.</li>
                    <li>For product search: one sample product image (e.g., sneaker, mobile skin, etc.)</li>
                    <li>For visual query: an image containing the object you want the agent to detect/compare.</li>
                  </ul>
                  <p className="text-black mb-4 text-sm sm:text-base">👉 In your case (keyword + Portia), you should give:</p>
                  <ul className="list-disc list-inside space-y-2 text-black mb-6 text-sm sm:text-base">
                    <li>Either a sample product image (so the agent learns what kind of objects to compare with database images).</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <button className="border-2 border-dashed border-orange-300 text-orange-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-sm sm:text-base">
                  Send Invoice
                </button>
                <button className="border-2 border-dashed border-orange-300 text-orange-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-sm sm:text-base">
                  Send Invoice
                </button>
                <button className="border-2 border-dashed border-orange-300 text-orange-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-sm sm:text-base">
                  Send Invoice
                </button>
              </div>
            </div>

            {/* User Message */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 flex items-start space-x-3 fade-in" style={{ animationDelay: '0.2s' }}>
              <User className="text-black mt-1 flex-shrink-0" size={20} />
              <p className="text-black text-sm sm:text-base leading-relaxed">
                Okay Let me know about Portia AI (Cloud API) basics and how do i implement a basic agent
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="User Query"
                className="w-full bg-black text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full text-base sm:text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 p-2 rounded-full text-white transition-all duration-200 hover:scale-110">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'chatrooms' && <ChatRooms />}
    </div>
  );
}

export default App;