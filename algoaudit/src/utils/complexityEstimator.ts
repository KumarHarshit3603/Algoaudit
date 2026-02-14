import { BenchmarkResult } from '../types';

const MIN_TIME_MS = 0.01;

const mapSlopeToComplexity = (slope: number): string => {
  if (slope <= 0.15) return 'O(1)';
  if (slope <= 0.6) return 'O(log n)';
  if (slope <= 1.2) return 'O(n)';
  if (slope <= 1.5) return 'O(n log n)';
  if (slope <= 2.4) return 'O(n^2)';
  if (slope <= 3.4) return 'O(n^3)';
  return 'O(2^n)';
};

const estimateForAlgorithm = (rows: BenchmarkResult[]): string => {
  const sizedRows = rows.filter((row) => typeof row.inputSize === 'number' && row.inputSize! > 0);
  if (sizedRows.length < 2) return 'Insufficient data';

  const bySize = sizedRows.reduce((acc, row) => {
    const size = row.inputSize as number;
    if (!acc[size]) acc[size] = [];
    acc[size].push(Math.max(row.time, MIN_TIME_MS));
    return acc;
  }, {} as Record<number, number[]>);

  const points = Object.entries(bySize)
    .map(([size, times]) => {
      const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
      return { n: Number(size), t: avgTime };
    })
    .filter((point) => point.n > 0 && point.t > 0)
    .sort((a, b) => a.n - b.n);

  if (points.length < 2) return 'Insufficient data';

  const first = points[0];
  const last = points[points.length - 1];
  const denominator = Math.log(last.n) - Math.log(first.n);
  if (denominator === 0) return 'Insufficient data';

  const slope = (Math.log(last.t) - Math.log(first.t)) / denominator;
  return mapSlopeToComplexity(slope);
};

export const withEstimatedComplexity = (rows: BenchmarkResult[]): BenchmarkResult[] => {
  const byAlgorithm = rows.reduce((acc, row) => {
    if (!acc[row.algorithm]) acc[row.algorithm] = [];
    acc[row.algorithm].push(row);
    return acc;
  }, {} as Record<string, BenchmarkResult[]>);

  const estimatedByAlgorithm = Object.entries(byAlgorithm).reduce((acc, [algorithm, algoRows]) => {
    acc[algorithm] = estimateForAlgorithm(algoRows);
    return acc;
  }, {} as Record<string, string>);

  return rows.map((row) => ({
    ...row,
    timeComplexity: estimatedByAlgorithm[row.algorithm] || 'Insufficient data'
  }));
};

