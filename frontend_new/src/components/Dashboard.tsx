// Devangs Changes
import React, { useEffect } from 'react';
import SparkleField from './SparkleField';
import HeroOrb from './HeroOrb';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface Deal {
  id: string;
  title: string;
  company: string;
  summary: string;
  budget: string;
  status: string;
  is_ai_active: boolean;
  created_at: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [loading, setLoading] = React.useState(false);
  const [mailsFetched, setMailsFetched] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  
  // Check for user session and fetch deals
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (data.user) {
        // Check if there are any deals to set mailsFetched
        const { data: existingDeals } = await supabase
          .from('deals')
          .select('*')
          .eq('user_id', data.user.id);
        
        if (existingDeals && existingDeals.length > 0) {
          setMailsFetched(true);
          setDeals(existingDeals);
        }
      }
    };
    
    getUser();
  }, []);
  
  const handleScanMailBox = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real app, this would call your backend API
      // const response = await fetch('http://localhost:8000/search-emails', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ user_id: user.id }),
      // });
      // const data = await response.json();
      
      // Mock data that simulates API response
      const mock = {
        emails: [
          {
            email_id: 'eml_001',
            from_email: 'marketing@nike.com',
            from_name: 'Nike Marketing',
            subject: 'Exciting Collab Opportunity',
            body: "Hey! We'd love to collaborate on our upcoming Just Do It campaign.",
            snippet: "We'd love to collaborate on our upcoming campaign...",
            received_at: '2025-08-20T09:30:00Z'
          },
          {
            email_id: 'eml_002',
            from_email: 'influencer@apple.com',
            from_name: 'Apple Influencer Team',
            subject: 'Join our iPhone 17 Launch Campaign',
            body: 'Apple is seeking influencers for the iPhone 17 launch this fall.',
            snippet: 'Apple is seeking influencers...',
            received_at: '2025-08-18T15:45:00Z'
          },
          {
            email_id: 'eml_003',
            from_email: 'events@samsung.com',
            from_name: 'Samsung Events',
            subject: 'Sponsorship Proposal for TechCon 2025',
            body: 'Samsung would like to sponsor you for TechCon 2025.',
            snippet: 'Samsung would like to sponsor you...',
            received_at: '2025-08-15T11:00:00Z'
          }
        ],
        deals: [
          {
            email_id: 'eml_001',
            from_email: 'marketing@nike.com',
            title: 'Brand Collab with Nike',
            company: 'Nike',
            summary: 'Nike wants to collaborate for their Just Do It campaign.',
            budget: '$10,000',
            status: 'Pending',
            is_ai_active: false,
            first_email_received_at: '2025-08-20T09:30:00Z'
          },
          {
            email_id: 'eml_002',
            from_email: 'influencer@apple.com',
            title: 'Influencer Deal with Apple',
            company: 'Apple',
            summary: 'Apple is inviting influencers for the iPhone 17 launch.',
            budget: '$15,000',
            status: 'Active',
            is_ai_active: true,
            first_email_received_at: '2025-08-18T15:45:00Z'
          },
          {
            email_id: 'eml_003',
            from_email: 'events@samsung.com',
            title: 'Sponsorship from Samsung',
            company: 'Samsung',
            summary: 'Samsung offers sponsorship for TechCon 2025.',
            budget: '$8,000',
            status: 'Inactive',
            is_ai_active: false,
            first_email_received_at: '2025-08-15T11:00:00Z'
          }
        ]
      };
      
      // 1. First, store emails in Supabase
      for (const email of mock.emails) {
        const { error: emailError } = await supabase
          .from('emails')
          .upsert({
            user_id: user.id,
            email_id: email.email_id,
            from_email: email.from_email,
            from_name: email.from_name,
            subject: email.subject,
            body: email.body,
            snippet: email.snippet,
            received_at: email.received_at,
            created_at: new Date().toISOString()
          }, { onConflict: 'email_id' }); // Prevent duplicates
          
        if (emailError) {
          console.error('Error storing email:', emailError);
        }
      }
      
      // 2. Next, store deals in Supabase
      for (const deal of mock.deals) {
        const { error: dealError } = await supabase
          .from('deals')
          .upsert({
            user_id: user.id,
            title: deal.title,
            company: deal.company,
            summary: deal.summary,
            budget: deal.budget.replace('$', ''),
            status: deal.status,
            is_ai_active: deal.is_ai_active,
            created_at: deal.first_email_received_at,
            // Use email_id to link deal to email
            email_id: deal.email_id,
            from_email:deal.from_email
          }, { onConflict: 'email_id' }); // Prevent duplicates based on email
          
        if (dealError) {
          console.error('Error storing deal:', dealError);
        }
      }
      
      // 3. Fetch the updated deals to display
      const { data: newDeals, error } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching deals:', error);
      } else {
        setDeals(newDeals || []);
        setMailsFetched(true);
      }
    } catch (error) {
      console.error('Error processing emails:', error);
    } finally {
      setLoading(false);
    }
  };


  // Handle rescan of mailbox
  const handleRescan = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real app, this would call your backend API with rescan flag
      // const response = await fetch('http://localhost:8000/search-emails', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     user_id: user.id,
      //     rescan: true 
      //   }),
      // });
      // const data = await response.json();
      
      // Mock data for a rescan - different from the initial scan
      const rescanMock = {
        emails: [
          {
            email_id: 'eml_004', // New email
            from_email: 'partnerships@adidas.com',
            from_name: 'Adidas Partnerships',
            subject: 'Exclusive Brand Partnership',
            body: "We've seen your content and would like to discuss a partnership.",
            snippet: "We've seen your content and would like to discuss...",
            received_at: '2025-08-23T14:20:00Z'
          }
        ],
        deals: [
          {
            email_id: 'eml_004',
            from_email: 'partnerships@adidas.com',
            title: 'Partnership with Adidas',
            company: 'Adidas',
            summary: 'Adidas wants to partner for exclusive content.',
            budget: '$12,500',
            status: 'Pending',
            is_ai_active: false,
            first_email_received_at: '2025-08-23T14:20:00Z'
          }
        ]
      };
      
      // Process new emails and deals
      for (const email of rescanMock.emails) {
        const { error: emailError } = await supabase
          .from('emails')
          .upsert({
            user_id: user.id,
            email_id: email.email_id,
            from_email: email.from_email,
            from_name: email.from_name,
            subject: email.subject,
            body: email.body,
            snippet: email.snippet,
            received_at: email.received_at,
            created_at: new Date().toISOString()
          }, { onConflict: 'email_id' });
          
        if (emailError) {
          console.error('Error storing email during rescan:', emailError);
        }
      }
      
      // Store new deals
      for (const deal of rescanMock.deals) {
        const { error: dealError } = await supabase
          .from('deals')
          .upsert({
            user_id: user.id,
            title: deal.title,
            company: deal.company,
            summary: deal.summary,
            budget: deal.budget.replace('$', ''),
            status: deal.status,
            is_ai_active: deal.is_ai_active,
            created_at: deal.first_email_received_at,
            email_id: deal.email_id
          }, { onConflict: 'email_id' });
          
        if (dealError) {
          console.error('Error storing deal during rescan:', dealError);
        }
      }
      
      // Refresh deals from database
      const { data: refreshedDeals, error } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching deals:', error);
      } else {
        setDeals(refreshedDeals || []);
      }
    } catch (error) {
      console.error('Error rescanning emails:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle AI activation for a deal
  const handleToggleAI = async (id: string) => {
    try {
      // Get current deal
      const deal = deals.find(d => d.id === id);
      if (!deal) return;
      
      // Update local state optimistically
      setDeals(deals.map(deal => 
        deal.id === id ? { ...deal, is_ai_active: !deal.is_ai_active } : deal
      ));
      
      // Update in Supabase
      const { error } = await supabase
        .from('deals')
        .update({ is_ai_active: !deal.is_ai_active })
        .eq('id', id)
        .eq('user_id', user?.id);
        
      if (error) {
        console.error('Error updating deal:', error);
        // Revert optimistic update if there was an error
        setDeals(deals.map(deal => 
          deal.id === id ? { ...deal, is_ai_active: deal.is_ai_active } : deal
        ));
      }
    } catch (error) {
      console.error('Error toggling AI:', error);
    }
  };
  
  // Handle clicking on a deal to open the chat
  const handleDealClick = (deal: Deal) => {
    if (deal.is_ai_active) {
      onNavigate('chatrooms');
    }
  };

  return (
    <div className="relative min-h-screen px-6 pb-12 overflow-hidden">
      <SparkleField
        className="pointer-events-none absolute inset-0 z-20"
        items={[
          // Left large sparkle
          { top: '180px', left: '160px', size: 94, rotate: -8, delay: '0.2s', variant: 'peach', opacity: 0.95 },
          // Right medium sparkle
          { top: '210px', right: '200px', size: 54, rotate: 10, delay: '0.8s', variant: 'peach', opacity: 0.9 },
          // Small accent near orb
          { top: '300px', left: '360px', size: 40, rotate: 15, delay: '1.4s', variant: 'orange', opacity: 0.85 },
        ]}
      />
      <HeroOrb
        size={1200}
        translateY="54%"
        opacityClass="opacity-80"
        blurClass="blur-[36px] md:blur-[40px]"
        zIndexClass="-z-10"
        blend="normal"
        className="
          w-[900px] h-[900px]
          sm:w-[1000px] sm:h-[1000px]
          md:w-[1200px] md:h-[1200px]
        "
      />


      {/* Header with Rescan Button */}
      {!mailsFetched && (

        <div className="flex flex-col items-center justify-center min-h-[60vh] mt-10">

          <h1 className="text-5xl md:text-6xl font-bold font-playfair text-gray-900 mb-6 leading-tight">
            Let's Check what you got there!
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-xl mx-auto leading-relaxed text-center">
            scans through your mail box to find mails related to brand deals!!
          </p>
          <button
            onClick={handleScanMailBox}
            className="bg-black hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-3 mx-auto transition-all duration-300 button-bounce shadow-xl hover:shadow-2xl"
            disabled={loading}
          >
            <img src="/rocket.png" alt="Scan" width={24} height={24} />
            <span>{loading ? 'Scanning...' : 'Scan Mail Box'}</span>
            {loading && (
              <span className="ml-3 animate-spin inline-block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" opacity="0.2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="4" />
                </svg>
              </span>
            )}
          </button>
        </div>
      )}
      {mailsFetched && (<div>
        <div className="flex items-center justify-center mb-10 mt-20">
          <button 
            className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium flex items-center space-x-3 hover:bg-gray-800 transition-all duration-200 button-bounce"
            onClick={handleRescan}
            disabled={loading}
          >
            <img src="/rocket.png" alt="Rescan" width={20} height={20} />
            <span>{loading ? 'Scanning...' : 'Rescan Mails'}</span>
            {loading && (
              <span className="ml-3 animate-spin inline-block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" opacity="0.2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="4" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>)}

      {/* Deal Cards Grid */}
      {mailsFetched && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-24 relative z-10">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-300 cursor-pointer ${
                deal.is_ai_active ? 'border-2 border-orange-500' : 'border border-gray-200'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleDealClick(deal)}
            >
              <div className="text-sm text-gray-500 mb-3">
                {new Date(deal.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <img src="/rocket.png" alt="Deal" width={32} height={32} />
                <h3 className="text-2xl font-bold text-gray-900">{deal.title}</h3>
              </div>
              <p className="text-gray-600 mb-2">{deal.summary}</p>
              <div className="mb-2 font-semibold text-gray-900">Company: {deal.company}</div>
              <div className="mb-4 text-gray-600">Budget: {deal.budget}</div>
              <button
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  deal.is_ai_active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleToggleAI(deal.id); 
                }}
              >
                {deal.is_ai_active ? 'Deactivate AI' : 'Activate AI'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;