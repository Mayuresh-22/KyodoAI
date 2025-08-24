// Devangs Changes
import React from 'react';


interface HomePageProps {
  onNavigate: (page: string) => void;
}


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Hero section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 px-15 py-[5rem] w-full max-w-7xl mx-auto ml-[16rem]">
        <div className="flex-1 flex flex-col items-start justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Secure & Easy-to-Use <span className="text-orange-500">Brand Deals Assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
            Discover, manage, and chat about your deals with confidence. Your AI-powered platform for brands and creators.
          </p>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => onNavigate('register')}
              className="bg-black hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2"
            >
              Get Started
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="bg-white border border-orange-500 text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2"
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <div className=" relative">
            {/* Illustration placeholder: replace with your own image or SVG */}
            <img src="/banner.png" alt="App Illustration" className="w-[500px] h-[500px] object-contain" />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full bg-orange-500 max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-4 border border-orange-100 transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl hover:border-orange-300 cursor-pointer">
          <span className="font-bold text-orange-500 text-lg">Non-Custodial Wallet</span>
          <p className="text-gray-700">All deals are kept over your private key.</p>
          <button className="text-orange-500 font-semibold mt-2 hover:underline">Learn more →</button>
        </div>
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-4 border border-orange-100 transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl hover:border-orange-300 cursor-pointer">
          <span className="font-bold text-orange-500 text-lg">Built-in Exchange</span>
          <p className="text-gray-700">Swap requirements directly within the app.</p>
          <button className="text-orange-500 font-semibold mt-2 hover:underline">Learn more →</button>
        </div>
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-4 border border-orange-100 transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl hover:border-orange-300 cursor-pointer">
          <span className="font-bold text-orange-500 text-lg">Biometric Security</span>
          <p className="text-gray-700">Face ID & authentication for secure protection.</p>
          <button className="text-orange-500 font-semibold mt-2 hover:underline">Learn more →</button>
        </div>
      </section>

      {/* FAQ section */}
      <section className="w-full max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6 border border-orange-100 transition-all duration-200 hover:shadow-xl hover:border-orange-300 hover:bg-orange-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">Is my data safe with Kyodo AI?</span>
              <span className="text-orange-500 font-bold">+</span>
            </div>
            <div className="mt-2 text-gray-600 text-sm">Yes, your data is encrypted and stored securely. Only you have access to your deals and chats.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-orange-100 transition-all duration-200 hover:shadow-xl hover:border-orange-300 hover:bg-orange-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">Which brands are supported?</span>
              <span className="text-orange-500 font-bold">+</span>
            </div>
            <div className="mt-2 text-gray-600 text-sm">We support all major brands and platforms. You can add custom brands as well.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-orange-100 transition-all duration-200 hover:shadow-xl hover:border-orange-300 hover:bg-orange-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">How do I restore my deals?</span>
              <span className="text-orange-500 font-bold">+</span>
            </div>
            <div className="mt-2 text-gray-600 text-sm">You can restore deals using your private key or backup phrase.</div>
          </div>
        </div>
      </section>

      {/* Footer illustration */}
      <div className="w-full flex justify-center pb-12">
        <img src="/stars.svg" alt="Footer Illustration" className="w-32 h-32 opacity-80" />
      </div>
    </div>
  );
};

export default HomePage;
