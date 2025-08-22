import React, { useState } from 'react';
import { Send, User, Sparkles } from 'lucide-react';

interface ChatRoomsProps {
  onNavigate: (page: string) => void;
}

const ChatRooms: React.FC<ChatRoomsProps> = ({ onNavigate }) => {
  const [selectedDeal, setSelectedDeal] = useState(0);
  const [message, setMessage] = useState('');

  const deals = [
    { id: 1, title: 'Deal 1 Title', isActive: true },
    { id: 2, title: 'Deal 2 Title', isActive: false },
    { id: 3, title: 'Deal 3 Title', isActive: false }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-orange-500 p-6 slide-in-left">
        <div className="space-y-4">
          {deals.map((deal, index) => (
            <button
              key={deal.id}
              onClick={() => setSelectedDeal(index)}
              className={`w-full p-4 rounded-2xl font-semibold text-left transition-all duration-200 ${
                selectedDeal === index
                  ? 'bg-white text-orange-500 shadow-lg'
                  : 'bg-orange-400 text-white hover:bg-white hover:text-orange-500'
              }`}
            >
              {deal.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col slide-in-right">
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Deal Title</h1>
            <div className="flex items-center space-x-8">
              <span className="font-semibold text-gray-700">Company Name</span>
              <span className="text-gray-600">Status</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-6 bg-orange-50/30">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3 mb-4">
              <Sparkles className="text-orange-500 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed mb-4">
                  Since Portia AI (Cloud API) agents often need a reference image when you're building a visual/
                  keyword-based search agent, the reference image is usually:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>An example input image you want your agent to work on.</li>
                  <li>For product search: one sample product image (e.g., sneaker, mobile skin, etc.)</li>
                  <li>For visual query: an image containing the object you want the agent to detect/compare.</li>
                </ul>
                <p className="text-gray-800 mb-4">👉 In your case (keyword + Portia), you should give:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Either a sample product image (so the agent learns what kind of objects to compare with database images).</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="border-2 border-dashed border-orange-300 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-200">
                Send Invoice
              </button>
              <button className="border-2 border-dashed border-orange-300 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-200">
                Send Invoice
              </button>
              <button className="border-2 border-dashed border-orange-300 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-200">
                Send Invoice
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start space-x-3">
            <User className="text-gray-600 mt-1" size={20} />
            <p className="text-gray-800">
              Okay Let me know about Portia AI (Cloud API) basics and how do i implement a basic agent
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="User Query"
                  className="w-full bg-black text-white px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 p-2 rounded-full text-white transition-colors duration-200"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRooms;