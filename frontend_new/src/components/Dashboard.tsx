import React from 'react';
// ...existing code...

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [loading, setLoading] = React.useState(false);
  const [bubbleAnim, setBubbleAnim] = React.useState(false);
  const [mailsFetched, setMailsFetched] = React.useState(false);
  const handleScanMailBox = () => {
    setLoading(true);
    setTimeout(() => {
      setBubbleAnim(true);
      setTimeout(() => {
        setLoading(false);
        setBubbleAnim(false);
        setMailsFetched(true);
      }, 1200);
    }, 1800);
  };
  const [deals, setDeals] = React.useState([
    { id: 1, title: 'Brand Collab with Nike', date: '22 Aug 2025', summary: 'Nike wants to collaborate for a new campaign.', company: 'Nike', budget: '$10,000', status: 'Pending', isActive: false },
    { id: 2, title: 'Influencer Deal with Apple', date: '20 Aug 2025', summary: 'Apple is looking for influencers for iPhone launch.', company: 'Apple', budget: '$15,000', status: 'Active', isActive: true },
    { id: 3, title: 'Sponsorship from Samsung', date: '18 Aug 2025', summary: 'Samsung offers sponsorship for tech event.', company: 'Samsung', budget: '$8,000', status: 'Inactive', isActive: false }
  ]);
  const [showChat, setShowChat] = React.useState(false);
  const [activeDeal, setActiveDeal] = React.useState<any>(null);
  const handleToggleAI = (id) => {
    setDeals(deals => deals.map(deal => deal.id === id ? { ...deal, isActive: !deal.isActive } : deal));
  };
  const handleDealClick = (deal) => {
    if (deal.isActive) {
      setActiveDeal(deal);
      setShowChat(true);
    }
  };

  return (
  <div className="relative min-h-screen px-6 pb-12 overflow-hidden">
      {/* Header with Rescan Button */}
      {!mailsFetched && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Let's Check what you got there!
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            scans through your mail box to find mails<br />related to brand deals!!
          </p>
          <button
            onClick={handleScanMailBox}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-3 mx-auto transition-all duration-300 button-bounce shadow-xl hover:shadow-2xl"
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
          {bubbleAnim && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="w-[120vw] h-[120vw] rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 opacity-80 animate-bubbleFill" style={{filter:'blur(40px)'}}></div>
            </div>
          )}
        </div>
      )}
      {mailsFetched && (
        <div>
          <div className="flex items-center justify-center mb-12">
            <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium flex items-center space-x-3 hover:bg-gray-800 transition-all duration-200 button-bounce">
              <img src="/rocket.png" alt="Rescan" width={20} height={20} />
              <span>Rescan Mails</span>
            </button>
          </div>
          {/* Rocket Icon */}
          <div className="flex justify-start mb-12 ml-12">
            <div className="rocket-float">
              <img src="/rocket.png" alt="Rocket" width={64} height={64} />
            </div>
          </div>
        </div>
      )}
      {/* Rocket Icon */}
      <div className="flex justify-start mb-12 ml-12">
        <div className="rocket-float">
          <img src="/rocket.png" alt="Rocket" width={64} height={64} />
        </div>
      </div>

      {/* Deal Cards Grid */}
      {mailsFetched && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      {showChat && activeDeal && (
        <div className="fixed inset-0 z-50 bg-white/90 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-orange-500">Chat Room for {activeDeal.title}</h2>
            <div className="bg-orange-50 rounded-xl p-4 mb-4">Chat area for this deal...</div>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold" onClick={() => setShowChat(false)}>Close Chat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;