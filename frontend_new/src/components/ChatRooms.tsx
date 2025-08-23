// Dynamic ChatRooms implementation with Supabase
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
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
 * - onNavigate: parent-provided navigation handler
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

interface Message {
  id?: string;
  deal_id: string;
  user_id?: string; 
  sender: 'user' | 'ai' | 'timeline';
  content: string;
  suggested_actions?: Array<{ action_name: string; action_desc: string }>;
  created_at?: string;
}

interface Deal {
  id: string;
  user_id: string;
  email_id: string;
  title: string;
  company: string;
  summary: string;
  budget: string;
  status: string;
  is_ai_active: boolean;
  created_at: string;
}

/**
 * ChatRooms
 * - Two-pane layout:
 *   1) Left sidebar: list of "deals" (rooms) to select
 *   2) Right pane: chat header, timeline, messages, and input composer
 */
const ChatRooms: React.FC<ChatRoomsProps> = ({ onNavigate }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState(0);
  const [message, setMessage] = useState('');
  const [dealMessages, setDealMessages] = useState<Message[][]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Default timeline steps
  const defaultTimeline = [
    { id: 'queue', label: 'Queued', detail: 'Waiting for worker', status: 'pending' as StepStatus },
    { id: 'analyze', label: 'Analyzing prompt', detail: 'Extracting intent', status: 'pending' as StepStatus },
    { id: 'retrieve', label: 'Fetching context', detail: 'Searching emails', status: 'pending' as StepStatus },
    { id: 'generate', label: 'Generating response', detail: 'Planning reply', status: 'pending' as StepStatus },
    { id: 'stream', label: 'Streaming', detail: 'Sending tokens', status: 'pending' as StepStatus },
  ];
  
  const [dealTimelines, setDealTimelines] = useState<AIStep[][]>([]);
  const [dealGenerating, setDealGenerating] = useState<boolean[]>([]);

  const chatAreaRef = React.useRef<HTMLDivElement>(null);

  // Fetch user and AI-active deals and their messages
  useEffect(() => {
    const fetchUserAndDeals = async () => {
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          console.error('No user found');
          setLoading(false);
          return;
        }
        
        setUser(userData.user);
        
        // Fetch AI-active deals
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('*')
          .eq('user_id', userData.user.id)
          .eq('is_ai_active', true)
          .order('created_at', { ascending: false });
          
        if (dealsError) {
          console.error('Error fetching deals:', dealsError);
          setLoading(false);
          return;
        }
        
        if (!dealsData || dealsData.length === 0) {
          setLoading(false);
          return;
        }
        
        setDeals(dealsData);
        
        // Initialize arrays for messages and timelines
        const messagesArray: Message[][] = [];
        const timelinesArray: AIStep[][] = [];
        const generatingArray: boolean[] = [];
        
        // Fetch messages for each deal
        for (const deal of dealsData) {
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('deal_id', deal.id)
            .order('created_at', { ascending: true });
            
          if (messagesError) {
            console.error(`Error fetching messages for deal ${deal.id}:`, messagesError);
            messagesArray.push([]);
          } else {
            messagesArray.push(messagesData || []);
          }
          
          // Initialize timeline for each deal
          timelinesArray.push([...defaultTimeline]);
          generatingArray.push(false);
        }
        
        setDealMessages(messagesArray);
        setDealTimelines(timelinesArray);
        setDealGenerating(generatingArray);
        
      } catch (error) {
        console.error('Error in fetchUserAndDeals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndDeals();
  }, []);

  // Auto-scroll to the latest message whenever current deal's messages change
  React.useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [dealMessages, selectedDeal]);

  // TIMELINE FUNCTIONS
  const renderTimeline = () => {
    if (!dealTimelines[selectedDeal]) return null;
    
    return (
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
  };

  // Timeline step helpers per deal
  const advanceStep = (stepId: string, status: StepStatus = 'active') => {
    setDealTimelines(prev => {
      const updated = [...prev];
      if (!updated[selectedDeal]) return prev;
      
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

  // Save message to Supabase
  const saveMessageToSupabase = async (message: Message) => {
    if (!user) return;
    
    try {
      const messageWithUser = {
        ...message,
        user_id: user.id,
        created_at: new Date().toISOString() // Ensure created_at is set
      };
      
      // Insert the message
      const { error } = await supabase
        .from('messages')
        .insert([messageWithUser]);
        
      if (error) {
        console.error('Error saving message:', error);
      }
    } catch (error) {
      console.error('Error in saveMessageToSupabase:', error);
    }
  };

  const simulateAIProgress = async () => {
    if (!deals[selectedDeal]) return;
    
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
        { 
          deal_id: deals[selectedDeal].id, 
          sender: 'timeline', 
          content: '' 
        }
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

    // Get details about the selected deal for better AI response
    const deal = deals[selectedDeal];
    
    // Prepare AI response content with deal-specific information
    const aiResponseContent = [
      `Based on your query about the deal with ${deal.company}, here are the key points:`,
      `- This is a ${deal.status.toLowerCase()} collaboration for ${deal.budget ? '$' + deal.budget : 'an undisclosed amount'}`,
      `- ${deal.summary}`,
      '',
      'Would you like me to draft a response email or prepare any other content for this deal?'
    ].join('\n');
    
    // Suggested actions
    const suggestedActions = [
      {
        action_name: 'Send Acknowledgement',
        action_desc: `Draft and send initial acknowledgment to ${deal.company}`
      },
      {
        action_name: 'Finalize Deal',
        action_desc: `Draft terms for finalizing the deal with ${deal.company}`
      }
    ];

    // Create new AI message
    const newMessage: Message = {
      deal_id: deals[selectedDeal].id,
      sender: 'ai',
      content: aiResponseContent,
      suggested_actions: suggestedActions
    };
    
    // Save to Supabase (outside the state update callback)
    await saveMessageToSupabase(newMessage);

    // Remove timeline message and add AI response
    setDealMessages(prev => {
      const updated = [...prev];
      const withoutTimeline = updated[selectedDeal].filter(msg => msg.sender !== 'timeline');
      
      updated[selectedDeal] = [
        ...withoutTimeline,
        newMessage
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
  const handleSendMessage = async (userQuery: string) => {
    if (!userQuery.trim() || deals.length === 0) return;
    
    try {
      // Create user message
      const userMessage: Message = {
        deal_id: deals[selectedDeal].id,
        user_id: user?.id,
        sender: 'user',
        content: userQuery
      };
      
      // Update UI optimistically
      setDealMessages(prev => {
        const updated = [...prev];
        updated[selectedDeal] = [
          ...updated[selectedDeal],
          userMessage
        ];
        return updated;
      });
      
      setMessage('');
      
      // Save user message to Supabase
      await saveMessageToSupabase(userMessage);
      
      // Start AI generation process (timeline)
      simulateAIProgress();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={40} sx={{ color: '#ff6b35' }} />
          <div className="mt-4 text-gray-600">Loading conversations...</div>
        </div>
      </div>
    );
  }
  
  // Render empty state if no deals
  if (deals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Deals</h2>
          <p className="text-gray-600 mb-6">
            You don't have any active AI conversations. Go to your dashboard and activate AI for some deals to start chatting.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const currentDeal = deals[selectedDeal];

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
            <h1 className="text-3xl font-bold text-gray-900">{currentDeal.title}</h1>
            <div className="flex items-center space-x-8">
              <span className="font-semibold text-gray-700">{currentDeal.company}</span>
              <span className="text-gray-600">{currentDeal.status}</span>
            </div>
          </div>
        </div>
        {/* Messages list: scrollable container */}
        <div
          ref={chatAreaRef}
          className="flex-1 p-6 bg-gray-50 overflow-y-auto space-y-4"
          style={{ minHeight: '400px', maxHeight: 'calc(100vh - 190px)' }}
        >
          {/* Show deal info message at start of conversation */}
          {(!dealMessages[selectedDeal] || dealMessages[selectedDeal].length === 0) && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3 mb-2">
                <img src="/stars.svg" alt="Assistant" className="mt-1" width={20} height={20} />
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed mb-1">
                    Welcome to your chat about the deal with {currentDeal.company}.
                  </p>
                  <p className="text-gray-800 leading-relaxed mb-1">
                    This is a {currentDeal.status.toLowerCase()} deal with a budget of ${currentDeal.budget}.
                  </p>
                  <p className="text-gray-800 leading-relaxed mb-3">
                    {currentDeal.summary}
                  </p>
                  <p className="text-gray-800 leading-relaxed">
                    How can I help you with this collaboration?
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Render existing messages */}
          {dealMessages[selectedDeal] && dealMessages[selectedDeal].map((msg, idx) => {
            if (msg.sender === 'timeline') {
              // Timeline message: shows AI generation progress
              return (
                <div key={idx} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">🤖 AI Generation Progress</div>
                  {renderTimeline()}
                </div>
              );
            } else if (msg.sender === 'ai') {
              return (
                <div key={idx} className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-3 mb-2">
                    <img src="/stars.svg" alt="Assistant" className="mt-1" width={20} height={20} />
                    <div className="flex-1">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className="text-gray-800 leading-relaxed mb-1">{line}</p>
                      ))}
                      {Array.isArray(msg.suggested_actions) && msg.suggested_actions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.suggested_actions.map((action, i) => (
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
                  <p className="text-gray-800">{msg.content}</p>
                </div>
              );
            }
          })}
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
                  placeholder="Type your message..."
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
