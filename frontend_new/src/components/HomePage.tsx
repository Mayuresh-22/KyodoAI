import React from 'react';
import HeroOrb from './HeroOrb';
import SparkleField from './SparkleField';
// ...existing code...

/**
 * Props:
 * - onNavigate: parent-provided navigation handler (e.g., route to 'dashboard')
 */
interface HomePageProps {
  onNavigate: (page: string) => void;
}

/**
 * HomePage (Landing)
 * - Pure presentation: no scanning or data logic here
 * - Visual layers:
 *   1) Background decorative gradients (bottom orb + blurred circle)
 *   2) Floating "sparkles" (ornamental star images with staggered animation)
 *   3) Foreground content (headline, subhead, CTAs)
 *
 * Notes:
 * - Tailwind is used for layout/spacing/typography
 * - Inline styles drive the complex gradient orb (radial + blur + blend)
 * - CTA buttons route or show temporary alerts (placeholder auth)
 */
const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Landing page, no scan logic here

  return (
    // Full-viewport container; centers content both axes; hides overflow so off-screen glow doesn't scroll
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Bottom gradient orb (decorative)
         - Positioned half off the bottom to create a soft glow
         - radial-gradient with orange palette + blur + multiply to blend with page
         - pointerEvents none so it won’t interfere with clicks
      */}
      <HeroOrb
        size={1200}
        translateY="54%"                  // push further down to show a thinner arc
        opacityClass="opacity-80"
        blurClass="blur-[36px] md:blur-[40px]"
        zIndexClass="-z-10"               // keep behind everything
        blend="normal"                    // change to 'multiply' if you want inked blending
        className="
          w-[900px] h-[900px]
          sm:w-[1000px] sm:h-[1000px]
          md:w-[1200px] md:h-[1200px]
        "
      />

      {/* Decorative sparkles (ornamental star SVGs)
         - Absolutely positioned around the canvas
         - The "sparkle" class is expected to handle subtle scale/opacity animation
         - Staggered with inline animationDelay for variety
         - Consider marking these as aria-hidden if purely decorative
      */}
      {/* Sparkles layer */}
<SparkleField
  className="pointer-events-none absolute inset-0 z-0"
  items={[
    // Left large sparkle
    { top: '180px', left: '160px', size: 94, rotate: -8, delay: '0.2s', variant: 'peach', opacity: 0.95 },
    // Right medium sparkle
    { top: '210px', right: '200px', size: 54, rotate: 10, delay: '0.8s', variant: 'peach', opacity: 0.9 },
    // Small accent near orb
    { top: '300px', left: '360px', size: 40, rotate: 15, delay: '1.4s', variant: 'orange', opacity: 0.85 },
  ]}
/>

      {/* Foreground content block (stacked center)
         - z-10 ensures it sits above decorative background layers
         - pb-32 to keep CTAs clear of the bottom glow
      */}
      <div className="text-center z-10 max-w-3xl pb-32">
        {/* Headline: large, bold, tight leading for a strong hero title */}
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
  Welcome to <span className="text-orange-500 italic">Kyodo AI</span>
</h1>

        {/* Subheading: supportive copy with relaxed line height */}
        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-xl mx-auto leading-relaxed">
          Your AI-powered brand deals assistant. Get started to discover, manage, and chat about your deals.
        </p>

        {/* CTA group:
           - Mobile: stacked; Desktop: inline row
           - Primary (Get Started): solid orange
           - Secondary (Login/Register): outlined orange
           - Alerts are placeholders for upcoming auth routes
        */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Primary CTA: navigates to dashboard */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2"
          >
            Get Started Now
          </button>

          {/* Secondary CTA: Login (placeholder) */}
          <button
              onClick={() => onNavigate('register')} // This should now work
              className="bg-white border border-orange-500 text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2"
            >
              Sign Up
            </button>


          {/* Secondary CTA: Register (placeholder) */}
          {/* <button
            onClick={() => alert('Register page coming soon!')}
            className="bg-white border border-orange-500 text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2"
          >
            Register
          </button> */}
        </div>
      </div>

      {/* Large blurred gradient circle behind everything
         - Provides ambient color; placed at -z-10 so it sits under all content
      */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-96 h-96 md:w-[600px] md:h-[600px] rounded-full gradient-bg opacity-60 blur-3xl -z-10"></div>
    </div>
  );
};

export default HomePage;
