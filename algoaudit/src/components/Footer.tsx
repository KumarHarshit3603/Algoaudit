import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-cyan-500/30 bg-black/50 backdrop-blur-sm mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div>ALGOAUDIT v1.0.0 | Algorithm Performance Analysis Suite</div>
          <div>Made by Harshit Kumar</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
