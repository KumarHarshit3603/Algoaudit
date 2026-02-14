import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-cyan-500/30 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold neon-text tracking-wider mb-1">
              ALGOAUDIT
            </h1>
            <p className="text-cyan-400/70 text-sm tracking-widest">
              ALGORITHM PERFORMANCE ANALYSIS SUITE
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">SYSTEM READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
