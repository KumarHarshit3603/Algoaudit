import React from 'react';
import { Play, Download, FileText } from 'lucide-react';

interface ActionBarProps {
  isRunning: boolean;
  resultsCount: number;
  progress: number;
  abTestMode: boolean;
  onRunBenchmarks: () => void;
  onDownloadReport: () => void;
  canRun: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  isRunning,
  resultsCount,
  progress,
  abTestMode,
  onRunBenchmarks,
  onDownloadReport,
  canRun
}) => {
  return (
    <div className="glow-border bg-gray-900/80 backdrop-blur p-6 rounded-lg mb-8 terminal-bg animate-slide-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onRunBenchmarks}
            disabled={isRunning || !canRun}
            className="cyber-button px-6 py-3 text-sm font-bold text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Play size={18} />
            {isRunning ? 'RUNNING...' : 'RUN BENCHMARKS'}
          </button>
          
          <button
            onClick={onDownloadReport}
            disabled={resultsCount === 0}
            className="cyber-button px-6 py-3 text-sm font-bold text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download size={18} />
            DOWNLOAD REPORT
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded border border-cyan-500/30">
            <FileText size={16} className="text-cyan-400" />
            <span className="text-gray-400">Results:</span>
            <span className="font-bold text-cyan-400">{resultsCount}</span>
          </div>
          {abTestMode && (
            <div className="px-4 py-2 bg-blue-500/10 rounded border border-blue-500/30">
              <span className="text-blue-400 font-semibold">A/B MODE ACTIVE</span>
            </div>
          )}
        </div>
      </div>
      
      {isRunning && (
        <div className="mt-4">
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="progress-bar h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-cyan-400 mt-2 text-center">
            Processing... {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionBar;
