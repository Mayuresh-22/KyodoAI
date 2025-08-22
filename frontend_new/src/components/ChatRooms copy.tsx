import React, { useState } from 'react';
// ...existing code...

/**
 * Props:
 * - onNavigate: parent-provided navigation handler (not used here yet, but available)
 */
interface ChatRoomsProps {
  onNavigate: (page: string) => void;
}

/**
 * ChatRooms
 * - Two-pane layout:
 *   1) Left sidebar: list of "deals" (rooms) to select
 *   2) Right pane: chat header, messages, and input composer
 *
 * State:
 * - selectedDeal: index of currently selected deal in the sidebar
 * - message: controlled input value for the composer
 * - chatMessages: array of messages with type ('ai' | 'user') and text
 *
 * Behavior:
 * - Auto-scrolls to bottom on new messages
 * - Hitting Enter or clicking send appends a user message (no AI call yet)
 */
const ChatRooms: React.FC<ChatRoomsProps> = ({ onNavigate }) => {
  // Index of the selected deal in the sidebar
  const [selectedDeal, setSelectedDeal] = useState(0);

  // Controlled input for the message composer
  const [message, setMessage] = useState('');

  // In-memory chat transcript; seed with one AI message and one user message
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      text: `............`
    },
    {
      type: 'user',
      text: 'Okay Let me know about Portia AI (Cloud API) basics and how do i implement a basic agent'
    }
  ]);

  // Ref to the scrollable chat area so we can auto-scroll on new messages
  const chatAreaRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message whenever chatMessages changes
  React.useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);

  /**
   * Append a user message if the input isn't empty.
   * Note: This currently only pushes the user message; integration with an AI/SDK
   * would go here (e.g., call API, then push AI response when it arrives).
   */
  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages(prev => [...prev, { type: 'user', text: message }]);
      setMessage('');
    }
  };

  /**
   * Static list of deals (rooms) for the sidebar.
   * - id: unique identifier
   * - title: display name in the sidebar
   * - isActive: example flag (not used for styling beyond selectedDeal here)
   */
  const deals = [
    { id: 1, title: 'Deal 1 Title', isActive: true },
    { id: 2, title: 'Deal 2 Title', isActive: false },
    { id: 3, title: 'Deal 3 Title', isActive: false }
  ];

  // Render
  return (
    // Full-height flex layout: sidebar (left) + chat (right)
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar: lists deals/rooms. Clicking switches selectedDeal */}
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
              // a11y: identify which deal is selected to screen readers
              aria-pressed={selectedDeal === index}
            >
              {deal.title}
            </button>
          ))}
        </div>
      </div>

      {/* Right column: header + messages + input composer */}
      <div className="flex-1 flex flex-col">
        {/* Chat header: deal title + meta (company, status) */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Deal Title</h1>
            <div className="flex items-center space-x-8">
              <span className="font-semibold text-gray-700">Company Name</span>
              <span className="text-gray-600">Status</span>
            </div>
          </div>
        </div>
{/* 











*/}
        {/* Messages list: scrollable container */}
        <div
          ref={chatAreaRef}
          className="flex-1 p-6 bg-orange-50/30 overflow-y-auto space-y-4"
          style={{ minHeight: '400px', maxHeight: 'calc(100vh - 220px)' }}
        >
          {chatMessages.map((msg, idx) =>
            msg.type === 'ai' ? (
              // AI message bubble: soft orange background, icon, and multi-line text
              <div key={idx} className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3 mb-2">
                  <img src="/stars.svg" alt="Assistant" className="mt-1" width={20} height={20} />
                  <div className="flex-1">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className="text-gray-800 leading-relaxed mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // User message bubble: white background with a small user/rocket icon
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start space-x-3">
                <img src="/rocket.png" alt="You" className="mt-1" width={20} height={20} />
                <p className="text-gray-800">{msg.text}</p>
              </div>
            )
          )}
        </div>

        {/* Composer: text input + send button (click or Enter to send) */}
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
                  aria-label="Type a message"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 p-2 rounded-full text-white transition-colors duration-200"
                  aria-label="Send message"
                >
                  <span role="img" aria-hidden="true" style={{ fontSize: '20px' }}>📤</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End composer */}
      </div>
      {/* End right column */}
    </div>
  );
};

export default ChatRooms;
