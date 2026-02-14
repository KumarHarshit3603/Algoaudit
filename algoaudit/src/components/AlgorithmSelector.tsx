import React from 'react';
import { Code } from 'lucide-react';
import { Algorithm } from '../types';

interface AlgorithmSelectorProps {
  algorithms: Record<string, Algorithm>;
  selectedAlgorithms: string[];
  onToggle: (key: string) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ 
  algorithms,
  selectedAlgorithms, 
  onToggle 
}) => {
  return (
    <div className="glow-border bg-gray-900/80 backdrop-blur p-6 rounded-lg terminal-bg">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/30">
        <Code className="text-cyan-400" size={20} />
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide">ALGORITHMS</h2>
      </div>
      <div className="space-y-3">
        {Object.entries(algorithms).map(([key, algo]) => (
          <label key={key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedAlgorithms.includes(key)}
              onChange={() => onToggle(key)}
              className="checkbox-custom mt-1"
            />
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                {algo.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Time: <span className="text-cyan-400/70">Auto-estimated at runtime</span> | 
                Space: <span className="text-blue-400/70">{algo.spaceComplexity}</span> | 
                Source: <span className="text-amber-300/70">{algo.source || 'Built-in'}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSelector;
