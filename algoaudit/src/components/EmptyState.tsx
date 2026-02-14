import React from 'react';
import { Zap } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="glow-border bg-gray-900/80 backdrop-blur p-12 rounded-lg text-center terminal-bg animate-slide-in" style={{ animationDelay: '0.2s' }}>
      <Zap size={48} className="text-cyan-400/50 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-400 mb-2">NO BENCHMARK DATA</h3>
      <p className="text-gray-600 text-sm">
        Select algorithms and test cases, then run benchmarks to see results
      </p>
    </div>
  );
};

export default EmptyState;
