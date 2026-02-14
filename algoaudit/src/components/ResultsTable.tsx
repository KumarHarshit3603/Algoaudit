import React from 'react';
import { Database } from 'lucide-react';
import { BenchmarkResult } from '../types';

interface ResultsTableProps {
  results: BenchmarkResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  return (
    <div className="glow-border bg-gray-900/80 backdrop-blur p-6 rounded-lg terminal-bg overflow-hidden">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-cyan-500/30">
        <Database className="text-cyan-400" size={20} />
        <h2 className="text-lg font-bold text-cyan-400 tracking-wide">DETAILED RESULTS</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cyan-500/30">
              <th className="text-left py-3 px-4 text-cyan-400 font-bold">#</th>
              <th className="text-left py-3 px-4 text-cyan-400 font-bold">ALGORITHM</th>
              <th className="text-left py-3 px-4 text-cyan-400 font-bold">TEST CASE</th>
              <th className="text-right py-3 px-4 text-cyan-400 font-bold">TIME (ms)</th>
              <th className="text-right py-3 px-4 text-cyan-400 font-bold">OPERATIONS</th>
              <th className="text-center py-3 px-4 text-cyan-400 font-bold">EST. TIME COMPLEXITY</th>
              <th className="text-center py-3 px-4 text-cyan-400 font-bold">SPACE COMPLEXITY</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr 
                key={idx} 
                className="border-b border-gray-800 hover:bg-cyan-500/5 transition-colors"
              >
                <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                <td className="py-3 px-4 text-gray-200 font-semibold">{result.algorithm}</td>
                <td className="py-3 px-4 text-gray-400">{result.testCase}</td>
                <td className="py-3 px-4 text-right text-cyan-400 font-mono">
                  {result.time.toFixed(4)}
                </td>
                <td className="py-3 px-4 text-right text-blue-400 font-mono">
                  {result.operations ?? 'N/A'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-mono">
                    {result.timeComplexity}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                    {result.spaceComplexity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
