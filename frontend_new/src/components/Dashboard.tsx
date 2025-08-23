// Devangs Changes
import React from 'react';
import SparkleField from './SparkleField';
import HeroOrb from './HeroOrb';
// ...existing code...

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [loading, setLoading] = React.useState(false);
  const [mailsFetched, setMailsFetched] = React.useState(false);
  const handleScanMailBox = () => {
    setLoading(true);
    // Call Endpoint to get Emails
    // fetch('http://localhost:8000/search-emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({}), // Add payload if needed
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Returned output:', data);
    //     // handle data if needed
    //     // e.g. setDeals(data.deals);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching emails:', error);
    //   });

    setTimeout(() => {
      setMailsFetched(true);
    }, 1800);
  };

  // Deals data should be fetched from above request
  const [deals, setDeals] = React.useState([
    { id: 1, title: 'Brand Collab with Nike', date: '22 Aug 2025', summary: 'Nike wants to collaborate for a new campaign.', company: 'Nike', budget: '$10,000', status: 'Pending', isActive: false },
    { id: 2, title: 'Influencer Deal with Apple', date: '20 Aug 2025', summary: 'Apple is looking for influencers for iPhone launch.', company: 'Apple', budget: '$15,000', status: 'Active', isActive: true },
    { id: 3, title: 'Sponsorship from Samsung', date: '18 Aug 2025', summary: 'Samsung offers sponsorship for tech event.', company: 'Samsung', budget: '$8,000', status: 'Inactive', isActive: false }
  ]);


  const [showChat, setShowChat] = React.useState(false);
  const [activeDeal, setActiveDeal] = React.useState<any>(null);
  const handleToggleAI = (id: any) => {
    setDeals(deals => deals.map(deal => deal.id === id ? { ...deal, isActive: !deal.isActive } : deal));
  };
  const handleDealClick = (deal: any) => {
    if (deal.isActive) {
      setActiveDeal(deal);
      setShowChat(true);
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
          <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium flex items-center space-x-3 hover:bg-gray-800 transition-all duration-200 button-bounce">
            <img src="/rocket.png" alt="Rescan" width={20} height={20} />
            <span>Rescan Mails</span>
          </button>
        </div>
      </div>)}

      {/* Deal Cards Grid */}
      {mailsFetched && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-24 relative z-10">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-300 cursor-pointer ${deal.isActive ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleDealClick(deal)}
            >
              <div className="text-sm text-gray-500 mb-3">{deal.date}</div>
              <div className="flex items-center space-x-4 mb-4">
                <img src="/rocket.png" alt="Deal" width={32} height={32} />
                <h3 className="text-2xl font-bold text-gray-900">{deal.title}</h3>
              </div>
              <p className="text-gray-600 mb-2">{deal.summary}</p>
              <div className="mb-2 font-semibold text-gray-900">Company: {deal.company}</div>
              <div className="mb-4 text-gray-600">Budget: {deal.budget}</div>
              <button
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${deal.isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={e => { e.stopPropagation(); handleToggleAI(deal.id); }}
              >
                {deal.isActive ? 'Deactivate AI' : 'Activate AI'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;