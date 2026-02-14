import React from 'react';
import { Database, TrendingUp } from 'lucide-react';
import { testCases } from '../utils/testCases';

interface TestCaseSelectorProps {
  selectedTestCases: string[];
  onToggle: (key: string) => void;
  abTestMode: boolean;
  onAbTestToggle: () => void;
}

const TestCaseSelector: React.FC<TestCaseSelectorProps> = ({
  selectedTestCases,
  onToggle,
  abTestMode,
  onAbTestToggle
}) => {
  return (
    <div className="glow-border bg-gray-900/80 backdrop-blur p-6 rounded-lg terminal-bg">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/30">
        <Database className="text-cyan-400" size={20} />
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide">TEST CASES</h2>
      </div>
      <div className="space-y-3">
        {Object.entries(testCases).map(([key, test]) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedTestCases.includes(key)}
              onChange={() => onToggle(key)}
              className="checkbox-custom"
            />
            <span className="text-sm text-gray-200 group-hover:text-cyan-400 transition-colors">
              {test.name}
            </span>
          </label>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-cyan-500/20">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={abTestMode}
            onChange={onAbTestToggle}
            className="checkbox-custom"
          />
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">A/B Testing Mode</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default TestCaseSelector;
