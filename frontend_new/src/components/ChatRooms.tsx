import React, { useState } from 'react';
// Vertical Generation Timeline 
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

// Optional: MUI Icons for different states
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * Props:
 * - onNavigate: parent-provided navigation handler (not used here yet, but available)
 */
interface ChatRoomsProps {
  onNavigate: (page: string) => void;
}

// AI generation step tracking
type StepStatus = 'pending' | 'active' | 'completed' | 'error';

interface AIStep {
  id: string;
  label: string;
  detail?: string;
  status: StepStatus;
}

/**
 * ChatRooms
 * - Two-pane layout:
 *   1) Left sidebar: list of "deals" (rooms) to select
 *   2) Right pane: chat header, timeline, messages, and input composer
 */
const ChatRooms: React.FC<ChatRoomsProps> = ({ onNavigate }) => {
  // Index of the selected deal in the sidebar
  const [selectedDeal, setSelectedDeal] = useState(0);

  // Controlled input for the message composer
  const [message, setMessage] = useState('');

  // In-memory chat transcript; seed with one AI message and one user message
  const [chatMessages, setChatMessages] = useState([
//     {
//       type: 'ai',
//       text: `Since Portia AI (Cloud API) agents often need a reference image when you're building a visual/keyword-based search agent, the reference image is usually:
// - An example input image you want your agent to work on.
// - For product search: one sample product image (e.g., sneaker, mobile skin, etc.)
// - For visual query: an image containing the object you want the agent to detect/compare.
// 👉 In your case (keyword + Portia), you should give:
// - Either a sample product image (so the agent learns what kind of objects to compare with database images).`
//     },
    {
      type: 'user',
      text: 'Check Your Emails and perform Actions'
    }
  ]);

  // AI Timeline States - MOVED INSIDE COMPONENT
  const [aiSteps, setAiSteps] = useState<AIStep[]>([
    { id: 'queue', label: 'Queued', detail: 'Waiting for worker', status: 'pending' },
    { id: 'analyze', label: 'Analyzing prompt', detail: 'Extracting intent', status: 'pending' },
    { id: 'retrieve', label: 'Fetching context', detail: 'Searching emails', status: 'pending' },
    { id: 'generate', label: 'Generating response', detail: 'Planning reply', status: 'pending' },
    { id: 'stream', label: 'Streaming', detail: 'Sending tokens', status: 'pending' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  // Ref to the scrollable chat area so we can auto-scroll on new messages
  const chatAreaRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message whenever chatMessages changes
  React.useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // TIMELINE FUNCTIONS - MOVED INSIDE COMPONENT
  const renderTimeline = () => (
    <Timeline sx={{ padding: 0, margin: 0}}>
      {aiSteps.map((step, index) => (
        <TimelineItem key={step.id} sx={{ minHeight: 60 }}>
          <TimelineSeparator>
            <TimelineDot 
              color={
                step.status === 'completed' ? 'success' :
                step.status === 'active' ? 'primary' :
                step.status === 'error' ? 'error' : 'grey'
              }
              sx={{ 
                bgcolor: step.status === 'active' ? '#ff6b35' : undefined // Your orange color
              }}
            >
              {step.status === 'active' && (
                <CircularProgress size={16} sx={{ color: 'white' }} />
              )}
              {step.status === 'completed' && (
                <CheckCircleIcon sx={{ fontSize: 16 }} />
              )}
              {step.status === 'error' && (
                <ErrorIcon sx={{ fontSize: 16 }} />
              )}
            </TimelineDot>
            {index < aiSteps.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <div className="text-sm font-medium text-gray-900">{step.label}</div>
            {step.detail && (
              <div className="text-xs text-gray-600 mt-1">{step.detail}</div>
            )}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );

  const advanceStep = (stepId: string, status: StepStatus = 'active') => {
    setAiSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return { ...step, status };
      }
      // Mark previous active step as completed
      if (step.status === 'active' && step.id !== stepId) {
        return { ...step, status: 'completed' };
      }
      return step;
    }));
  };

  const resetSteps = () => {
    setAiSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
  };

  const simulateAIProgress = async () => {
    setIsGenerating(true);
    resetSteps();

    // Add timeline as a "message" in the chat
  setChatMessages(prev => [...prev, { type: 'timeline', text: '' }]);
    
    // Simulate the AI pipeline
    advanceStep('queue', 'completed');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    advanceStep('analyze');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    advanceStep('retrieve');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    advanceStep('generate');
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    advanceStep('stream');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mark final step as completed
    setAiSteps(prev => prev.map(step => 
      step.id === 'stream' ? { ...step, status: 'completed' } : step
    ));
    // Intended code
    // Add AI response to chat
    // setChatMessages(prev => [...prev, { 
    //   type: 'ai', 
    //   text: 'Here\'s my response after processing your query through the pipeline!'
    // }]);

    // Temporary static response for demo purposes
    setChatMessages(prev => {
    // Remove the timeline message and add AI response
    const withoutTimeline = prev.filter(msg => msg.type !== 'timeline');
    return [...withoutTimeline, { 
      type: 'ai', 
      text: `Based on your query, here are the key points I found:
- Sample insight 1 from email analysis
- Sample insight 2 from deal context
- Recommended action: Send follow-up email

Would you like me to draft a response email?`
    }];
  });
    
    setIsGenerating(false);
  };

  /**
   * Append a user message if the input isn't empty, then start AI generation
   */
  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages(prev => [...prev, { type: 'user', text: message }]);
      setMessage('');
      
      // Start AI generation process
      simulateAIProgress();
    }
  };

  /**
   * Static list of deals (rooms) for the sidebar.
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
              aria-pressed={selectedDeal === index}
            >
              {deal.title}
            </button>
          ))}
        </div>
      </div>

      {/* Right column: header + timeline + messages + input composer */}
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

        {/* Messages list: scrollable container */}
        
        {/* Messages list: scrollable container */}
<div
  ref={chatAreaRef}
  className="flex-1 p-6 bg-orange-50/30 overflow-y-auto space-y-4"
  style={{ minHeight: '400px', maxHeight: 'calc(100vh - 220px)' }}
>
  {chatMessages.length === 0 ? (
    // Empty state when no messages
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-gray-500">
        <div className="text-lg font-medium mb-2">Start a conversation</div>
        <div className="text-sm">Send a message to begin chatting with AI</div>
      </div>
    </div>
  ) : (
    chatMessages.map((msg, idx) => {
      if (msg.type === 'timeline') {
        // Timeline message: shows AI generation progress
        return (
          <div key={idx} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">🤖 AI Generation Progress</div>
            {renderTimeline()}
          </div>
        );
      } else if (msg.type === 'ai') {
        // AI message bubble: soft orange background, icon, and multi-line text
        return (
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
        );
      } else {
        // User message bubble: white background with a small user/rocket icon
        return (
          <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start space-x-3">
            <img src="/rocket.png" alt="You" className="mt-1" width={20} height={20} />
            <p className="text-gray-800">{msg.text}</p>
          </div>
        );
      }
    })
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
      </div>
    </div>
  );
};

export default ChatRooms;
