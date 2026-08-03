import React from 'react';

export const ParticipantBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Light Futuristic Ambient Mesh Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[650px] h-[650px] bg-indigo-300/30 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[650px] h-[650px] bg-purple-300/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 left-1/5 w-[450px] h-[450px] bg-violet-200/35 rounded-full blur-[130px]" />

      {/* SVG Tech Circuit Lines & Pixel Dot Grid Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit-pattern" width="140" height="140" patternUnits="userSpaceOnUse">
            <path d="M 20 0 V 40 H 70 V 90 H 140" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeDasharray="5 5" />
            <path d="M 0 70 H 50 V 110 H 110" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
            <circle cx="70" cy="40" r="3.5" fill="#4F46E5" />
            <circle cx="50" cy="70" r="3.5" fill="#06B6D4" />
            <circle cx="110" cy="110" r="4" fill="#8B5CF6" />
          </pattern>
          <pattern id="pixel-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#6366F1" opacity="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pixel-dot-grid)" />
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>

      {/* Futuristic Floating Tech Symbols, Brackets & Micro Wireframe Accents */}
      <div className="absolute top-28 left-12 text-indigo-500/25 font-mono text-2xl font-black tracking-widest animate-bounce" style={{ animationDuration: '7s' }}>
        &lt;HACK_HUB /&gt;
      </div>
      <div className="absolute top-1/3 right-16 text-purple-500/25 font-mono text-3xl font-black animate-pulse" style={{ animationDuration: '5s' }}>
        &#123; AI_PAIRING &#125;
      </div>
      <div className="absolute bottom-36 left-20 text-cyan-600/25 font-mono text-xl font-bold">
        010110_COMMIT
      </div>
      <div className="absolute bottom-24 right-1/4 text-violet-500/25 font-mono text-2xl font-black">
        ⚡ LIVE_DEPLOY
      </div>
      <div className="absolute top-1/2 left-1/6 text-indigo-400/20 text-4xl animate-spin" style={{ animationDuration: '25s' }}>
        ⚙️
      </div>
    </div>
  );
};
