import React from 'react';
import { Zap } from 'lucide-react';

interface CustomCodePanelProps {
  customAlgoName: string;
  customCode: string;
  isRunning: boolean;
  externalCount: number;
  onNameChange: (name: string) => void;
  onCodeChange: (code: string) => void;
  onRunSingle: () => void;
  onLoadExternal: () => void;
  onLoadTemplate: () => void;
  onClearExternal: () => void;
}

const CustomCodePanel: React.FC<CustomCodePanelProps> = ({
  customAlgoName,
  customCode,
  isRunning,
  externalCount,
  onNameChange,
  onCodeChange,
  onRunSingle,
  onLoadExternal,
  onLoadTemplate,
  onClearExternal
}) => {
  return (
    <div className="glow-border bg-gray-900/80 backdrop-blur p-6 rounded-lg terminal-bg">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/30">
        <Zap className="text-cyan-400" size={20} />
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide">CUSTOM CODE</h2>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Algorithm Name"
          value={customAlgoName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        />
        <textarea
          placeholder="// Option A: single algorithm body (arr is provided)&#10;const sorted = arr.sort((a, b) => a - b);&#10;return sorted;&#10;&#10;// Option B: external registry, return an array of definitions&#10;// return [{ name: 'Heap Sort', run: (arr) => arr }];"
          value={customCode}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono h-32 resize-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onRunSingle}
            disabled={isRunning}
            className="cyber-button w-full px-4 py-2 text-xs font-semibold text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            BENCHMARK SINGLE
          </button>
          <button
            onClick={onLoadExternal}
            disabled={isRunning}
            className="cyber-button w-full px-4 py-2 text-xs font-semibold text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            LOAD EXTERNAL
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onLoadTemplate}
            disabled={isRunning}
            className="cyber-button w-full px-4 py-2 text-xs font-semibold text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            LOAD DSA TEMPLATE
          </button>
          <button
            onClick={onClearExternal}
            disabled={isRunning || externalCount === 0}
            className="cyber-button w-full px-4 py-2 text-xs font-semibold text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CLEAR EXTERNAL
          </button>
        </div>
        <p className="text-xs text-gray-500">
          External loaded: <span className="text-cyan-400 font-semibold">{externalCount}</span>
        </p>
      </div>
    </div>
  );
};

export default CustomCodePanel;
