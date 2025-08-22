import React from 'react';
import { Search, Rocket } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const deals = [
    {
      id: 1,
      title: 'Deal Title',
      date: '02 Aug 2025',
      summary: 'deal summary....................................................................................................',
      company: 'Company Name',
      budget: 'Budget',
      status: 'AI Activated',
      isActive: true
    },
    {
      id: 2,
      title: 'Deal Title',
      date: '02 Aug 2025',
      summary: 'deal summary....................................................................................................',
      company: 'Company Name',
      budget: 'Budget',
      status: 'Active AI',
      isActive: false
    },
    {
      id: 3,
      title: 'Deal Title',
      date: '02 Aug 2025',
      summary: 'deal summary....................................................................................................',
      company: 'Company Name',
      budget: 'Budget',
      status: 'Active AI',
      isActive: false
    }
  ];

  return (
    <div className="min-h-screen px-6 pb-12">
      {/* Header with Rescan Button */}
      <div className="flex items-center justify-center mb-12">
        <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium flex items-center space-x-3 hover:bg-gray-800 transition-all duration-200 button-bounce">
          <Search size={20} />
          <span>Rescan Mails</span>
        </button>
      </div>

      {/* Rocket Icon */}
      <div className="flex justify-start mb-12 ml-12">
        <div className="text-6xl rocket-float">
          🚀
        </div>
      </div>

      {/* Deal Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((deal, index) => (
          <div
            key={deal.id}
            className="bg-white rounded-2xl p-6 shadow-lg card-hover cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onNavigate('chatrooms')}
          >
            <div className="text-sm text-gray-500 mb-3">{deal.date}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{deal.title}</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">{deal.summary}</p>
            
            <div className="mb-6">
              <div className="font-semibold text-gray-900">{deal.company}</div>
              <div className="text-gray-600">{deal.budget}</div>
            </div>
            
            <button
              className={`w-full py-3 px-4 rounded-full font-semibold transition-all duration-200 ${
                deal.isActive
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-400 text-white hover:bg-gray-500'
              }`}
            >
              {deal.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;