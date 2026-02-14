import React from 'react';
import { Clock, TrendingUp, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { ChartDataPoint, RadarDataPoint } from '../types';

interface PerformanceChartsProps {
  chartData: ChartDataPoint[];
  radarData: RadarDataPoint[];
  selectedAlgorithms: string[];
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  chartData,
  radarData,
  selectedAlgorithms
}) => {
  const colors = ['#22d3ee', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <>
      {/* Bar Chart */}
      <div className="glow-border bg-gray-900/80 backdrop-blur p-6 rounded-lg terminal-bg">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-cyan-500/30">
          <Clock className="text-cyan-400" size={20} />
          <h2 className="text-lg font-bold text-cyan-400 tracking-wide">EXECUTION TIME ANALYSIS</h2>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
            <XAxis dataKey="testCase" stroke="#22d3ee" style={{ fontSize: '12px' }} />
            <YAxis stroke="#22d3ee" style={{ fontSize: '12px' }} label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#22d3ee' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                border: '1px solid rgba(34, 211, 238, 0.5)',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {selectedAlgorithms.map((algoName, idx) => (
              <Bar 
                key={algoName} 
                dataKey={algoName} 
                fill={colors[idx % colors.length]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line and Radar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="glow-border bg-gray-900/80 backdrop-blur p-6 rounded-lg terminal-bg">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-cyan-500/30">
            <TrendingUp className="text-cyan-400" size={20} />
            <h2 className="text-lg font-bold text-cyan-400 tracking-wide">PERFORMANCE TREND</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
              <XAxis dataKey="testCase" stroke="#22d3ee" style={{ fontSize: '11px' }} />
              <YAxis stroke="#22d3ee" style={{ fontSize: '11px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.5)',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {selectedAlgorithms.map((algoName, idx) => (
                <Line 
                  key={algoName} 
                  type="monotone" 
                  dataKey={algoName} 
                  stroke={colors[idx % colors.length]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="glow-border bg-gray-900/80 backdrop-blur p-6 rounded-lg terminal-bg">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-cyan-500/30">
            <Zap className="text-cyan-400" size={20} />
            <h2 className="text-lg font-bold text-cyan-400 tracking-wide">ALGORITHM COMPARISON</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(34, 211, 238, 0.2)" />
              <PolarAngleAxis dataKey="algorithm" stroke="#22d3ee" style={{ fontSize: '11px' }} />
              <PolarRadiusAxis stroke="#22d3ee" style={{ fontSize: '10px' }} />
              <Radar name="Performance Score" dataKey="performance" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(34, 211, 238, 0.5)',
                  fontSize: '11px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default PerformanceCharts;
