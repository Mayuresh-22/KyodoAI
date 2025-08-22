import React, { useState } from 'react';
// ...existing code...

interface ChatRoomsProps {
  onNavigate: (page: string) => void;
}

const ChatRooms: React.FC<ChatRoomsProps> = ({ onNavigate }) => {
  const [selectedDeal, setSelectedDeal] = useState(0);
  const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
      {
        type: 'ai',
        text: `Since Portia AI (Cloud API) agents often need a reference image when you're building a visual/keyword-based search agent, the reference image is usually:
   - An example input image you want your agent to work on.
   - For product search: one sample product image (e.g., sneaker, mobile skin, etc.)
   - For visual query: an image containing the object you want the agent to detect/compare.
   👉 In your case (keyword + Portia), you should give:
   - Either a sample product image (so the agent learns what kind of objects to compare with database images).`
      },
      {
        type: 'user',
        text: 'Okay Let me know about Portia AI (Cloud API) basics and how do i implement a basic agent'
      }
    ]);
    const chatAreaRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
    }, [chatMessages]);
    const handleSendMessage = () => {
      if (message.trim()) {
        setChatMessages([...chatMessages, { type: 'user', text: message }]);
        setMessage('');
      }
    };

  const deals = [
    { id: 1, title: 'Deal 1 Title', isActive: true },
    { id: 2, title: 'Deal 2 Title', isActive: false },
    { id: 3, title: 'Deal 3 Title', isActive: false }
  ];

  // Only keep the dynamic handleSendMessage above

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-orange-500 p-6 rounded-t-3xl flex-shrink-0">
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
      <div className="flex-1 flex flex-col">
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
        <div ref={chatAreaRef} className="flex-1 p-6 bg-orange-50/30 overflow-y-auto space-y-4" style={{ minHeight: '400px', maxHeight: 'calc(100vh - 220px)' }}>
          {chatMessages.map((msg, idx) => (
            msg.type === 'ai' ? (
              <div key={idx} className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3 mb-2">
                  <img src="/stars.svg" alt="Stars" className="mt-1" width={20} height={20} />
                  <div className="flex-1">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className="text-gray-800 leading-relaxed mb-1">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start space-x-3">
                <img src="/rocket.png" alt="User" className="mt-1" width={20} height={20} />
                <p className="text-gray-800">{msg.text}</p>
              </div>
            )
          ))}
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
                  <span role="img" aria-label="Send" style={{fontSize:'20px'}}>📤</span>
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