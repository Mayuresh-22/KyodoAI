// Devangs Changes
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

  // Deals data: each deal has its own header and messages
  const deals = [
    {
      id: 1,
      title: 'Deal 1 Title',
      company: 'Acme Corp',
      status: 'Pending',
      header: 'Deal 1 Title',
      companyName: 'Acme Corp',
      statusText: 'Pending',
      messages: [
        {
          type: 'ai',
          text: 'Summary for Deal 1. Choose an option to proceed.',
          suggested_actions: [
            { action_name: 'Send Invoice', action_desc: 'Generate and send the Invoice to Acme Corp' },
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Deal 2 Title',
      company: 'Beta LLC',
      status: 'Negotiation',
      header: 'Deal 2 Title',
      companyName: 'Beta LLC',
      statusText: 'Negotiation',
      messages: [
        {
          type: 'ai',
          text: 'Summary for Deal 2. Choose an option to proceed.',
          suggested_actions: [
            { action_name: 'Send Proposal', action_desc: 'Draft and send proposal to Beta LLC' },
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Deal 3 Title',
      company: 'Gamma Inc',
      status: 'Closed',
      header: 'Deal 3 Title',
      companyName: 'Gamma Inc',
      statusText: 'Closed',
      messages: [
        {
          type: 'ai',
          text: 'Summary for Deal 3. Choose an option to proceed.',
          suggested_actions: [
            { action_name: 'Archive', action_desc: 'Archive deal with Gamma Inc' },
          ]
        }
      ]
    }
  ];

  // Index of the selected deal in the sidebar
  const [selectedDeal, setSelectedDeal] = useState(0);
  const [message, setMessage] = useState('');
  // Each deal has its own messages and timeline state
  const [dealMessages, setDealMessages] = useState(deals.map(deal => deal.messages));
  const defaultTimeline = [
    { id: 'queue', label: 'Queued', detail: 'Waiting for worker', status: 'pending' },
    { id: 'analyze', label: 'Analyzing prompt', detail: 'Extracting intent', status: 'pending' },
    { id: 'retrieve', label: 'Fetching context', detail: 'Searching emails', status: 'pending' },
    { id: 'generate', label: 'Generating response', detail: 'Planning reply', status: 'pending' },
    { id: 'stream', label: 'Streaming', detail: 'Sending tokens', status: 'pending' },
  ];
  const [dealTimelines, setDealTimelines] = useState(deals.map(() => defaultTimeline.map(step => ({ ...step }))));
  const [dealGenerating, setDealGenerating] = useState(deals.map(() => false));

  const chatAreaRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message whenever current deal's messages change
  React.useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [dealMessages, selectedDeal]);


// ...existing code...
  // TIMELINE FUNCTIONS - DYNAMIC PER DEAL
  const renderTimeline = () => (
    <Timeline sx={{ padding: 0, margin: 0}}>
      {dealTimelines[selectedDeal].map((step, index) => (
        <TimelineItem key={step.id} sx={{ minHeight: 60 , "&::before": { display: "none" }}}>
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
            {index < dealTimelines[selectedDeal].length - 1 && <TimelineConnector />}
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

  // Timeline step helpers per deal
  const advanceStep = (stepId: string, status: StepStatus = 'active') => {
    setDealTimelines(prev => {
      const updated = [...prev];
      updated[selectedDeal] = updated[selectedDeal].map(step => {
        if (step.id === stepId) {
          return { ...step, status };
        }
        if (step.status === 'active' && step.id !== stepId) {
          return { ...step, status: 'completed' };
        }
        return step;
      });
      return updated;
    });
  };

  const resetSteps = () => {
    setDealTimelines(prev => {
      const updated = [...prev];
      updated[selectedDeal] = defaultTimeline.map(step => ({ ...step }));
      return updated;
    });
  };

  const simulateAIProgress = async () => {
    setDealGenerating(prev => {
      const updated = [...prev];
      updated[selectedDeal] = true;
      return updated;
    });
    resetSteps();

    // Add timeline as a "message" in the chat
    setDealMessages(prev => {
      const updated = [...prev];
      updated[selectedDeal] = [
        ...updated[selectedDeal],
        { type: 'timeline', text: '', suggested_actions: [] }
      ];
      return updated;
    });

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
    setDealTimelines(prev => {
      const updated = [...prev];
      updated[selectedDeal] = updated[selectedDeal].map(step =>
        step.id === 'stream' ? { ...step, status: 'completed' } : step
      );
      return updated;
    });

    // Remove timeline message and add AI response
    setDealMessages(prev => {
      const updated = [...prev];
      const withoutTimeline = updated[selectedDeal].filter(msg => msg.type !== 'timeline');
      updated[selectedDeal] = [
        ...withoutTimeline,
        {
          type: 'ai',
          text: [
            'Based on your query, here are the key points I found:',
            '- Sample insight 1 from email analysis',
            '- Sample insight 2 from deal context',
            '- Recommended action: Send follow-up email',
            '',
            'Would you like me to draft a response email?'
          ].join('\n'),
          suggested_actions: [
            {
              action_name: 'Send Acknolwedgement',
              action_desc: 'Draft and Send Initial Acknolwedgment Mail to the Brand'
            },
            {
              action_name: 'Finalize',
              action_desc: 'Draft and Send Deal Finalization Mail to the Brand'
            }
          ]
        }
      ];
      return updated;
    });
    setDealGenerating(prev => {
      const updated = [...prev];
      updated[selectedDeal] = false;
      return updated;
    });
  };

  // Send message for selected deal
  const handleSendMessage = (user_query: any) => {
    if (user_query.trim()) {
      setDealMessages(prev => {
        const updated = [...prev];
        updated[selectedDeal] = [
          ...updated[selectedDeal],
          { type: 'user', text: user_query, suggested_actions: [] }
        ];
        return updated;
      });
      setMessage('');
      // Start AI generation process (timeline)
      simulateAIProgress();
    }
  };

  // Render
  const currentDeal = deals[selectedDeal];
  const currentMessages = dealMessages[selectedDeal];

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Column */}
      <div className="w-80 bg-orange-500 p-6 rounded-t-3xl flex-shrink-0 mt-5">
        <div className="space-y-4 flex items-center justify-center p-5">
          <button
            className="text-lg center text-2xl md:text-2xl font-bold font-playfair text-black hover:text-white focus:outline-none transition-colors duration-200"
            onClick={() => onNavigate('dashboard')}
            aria-label="Go to Home"
          >
            Kyodo AI
          </button>
        </div>
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

      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{currentDeal.header}</h1>
            <div className="flex items-center space-x-8">
              <span className="font-semibold text-gray-700">{currentDeal.companyName}</span>
              <span className="text-gray-600">{currentDeal.statusText}</span>
            </div>
          </div>
        </div>
        {/* Messages list: scrollable container */}
        <div
          ref={chatAreaRef}
          className="flex-1 p-6 bg-gray-50 overflow-y-auto space-y-4"
          style={{ minHeight: '400px', maxHeight: 'calc(100vh - 190px)' }}
        >
          {currentMessages.length === 0 ? (
            <div className="flex items-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-lg font-medium mb-2">Start a conversation</div>
                <div className="text-sm">Send a message to begin chatting with AI</div>
              </div>
            </div>
          ) : (
            currentMessages.map((msg, idx) => {
              if (msg.type === 'timeline') {
                // Timeline message: shows AI generation progress
                return (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">🤖 AI Generation Progress</div>
                    {renderTimeline()}
                  </div>
                );
              } else if (msg.type === 'ai') {
                return (
                  <div key={idx} className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3 mb-2">
                      <img src="/stars.svg" alt="Assistant" className="mt-1" width={20} height={20} />
                      <div className="flex-1">
                        {msg.text.split('\n').map((line, i) => (
                          <p key={i} className="text-gray-800 leading-relaxed mb-1">{line}</p>
                        ))}
                        {Array.isArray(msg.suggested_actions) && msg.suggested_actions.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {msg.suggested_actions.map((action: { action_name: string , action_desc:string}, i: number) => (
                              <button
                                key={i}
                                className="border-2 border-dashed border-orange-400 rounded-full px-4 py-2 text-orange-700 bg-white font-semibold text-sm hover:bg-orange-50 transition"
                                type="button"
                                onClick={() => handleSendMessage(action.action_desc)}
                              >
                                {action.action_name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="bg-gray-200 border border-gray-200 rounded-2xl p-6 flex items-start space-x-3">
                    <p className="text-gray-800">{msg.text}</p>
                  </div>
                );
              }
            })
          )}
        </div>
        {/* User Input */}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(message)}
                  aria-label="Type a message"
                />
                <button
                  onClick={() => handleSendMessage(message)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 p-2 rounded-full text-white transition-colors duration-200 w-20"
                  aria-label="Send message"
                >
                  <span role="img" aria-hidden="true" style={{ fontSize: '20px' }}>➤</span>
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