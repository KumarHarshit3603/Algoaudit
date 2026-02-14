export interface Algorithm {
  name: string;
  code: (arr: number[]) => BenchmarkExecutionResult;
  timeComplexity: string;
  spaceComplexity: string;
  source?: 'Built-in' | 'External';
}

export interface BenchmarkExecutionResult {
  time: number;
  result: number[];
  operations: number;
}

export interface BenchmarkResult {
  algorithm: string;
  testCase: string;
  inputSize?: number;
  time: number;
  operations: number;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface TestCase {
  name: string;
  size: number;
  sorted?: boolean;
  reversed?: boolean;
}

export interface ChartDataPoint {
  testCase: string;
  [key: string]: string | number;
}

export interface RadarDataPoint {
  algorithm: string;
  performance: number;
}

export interface ExternalAlgorithmDefinition {
  key?: string;
  name: string;
  run?: (arr: number[]) => unknown;
  code?: (arr: number[]) => unknown;
  timeComplexity?: string;
  spaceComplexity?: string;
}
