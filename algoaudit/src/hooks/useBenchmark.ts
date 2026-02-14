import { useState } from 'react';
import { Algorithm, BenchmarkResult } from '../types';
import { algorithms } from '../utils/algorithms';
import { testCases, generateTestData } from '../utils/testCases';
import { loadExternalAlgorithms } from '../utils/externalAlgorithms';
import { withEstimatedComplexity } from '../utils/complexityEstimator';

export const useBenchmark = () => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [externalAlgorithms, setExternalAlgorithms] = useState<Record<string, Algorithm>>({});

  const runBenchmarks = async (
    selectedAlgorithms: string[],
    selectedTestCases: string[]
  ) => {
    setIsRunning(true);
    setProgress(0);
    const newResults: BenchmarkResult[] = [];

    try {
      const totalTests = selectedAlgorithms.length * selectedTestCases.length;
      let completed = 0;

      const algorithmCatalog: Record<string, Algorithm> = {
        ...algorithms,
        ...externalAlgorithms
      };

      for (const algoKey of selectedAlgorithms) {
        for (const testKey of selectedTestCases) {
          const algo = algorithmCatalog[algoKey];
          const test = testCases[testKey];
          if (!algo || !test) continue;

          // Simulate async to allow UI updates
          await new Promise((resolve) => setTimeout(resolve, 50));

          const testData = generateTestData(test.size, test.sorted || false, test.reversed || false);

          const result = algo.code(testData);

          newResults.push({
            algorithm: algo.name,
            testCase: test.name,
            inputSize: test.size,
            time: result.time,
            operations: result.operations,
            timeComplexity: 'Estimating...',
            spaceComplexity: algo.spaceComplexity
          });

          completed++;
          setProgress((completed / totalTests) * 100);
        }
      }
      setResults(withEstimatedComplexity(newResults));
    } finally {
      setIsRunning(false);
    }
  };

  const runCustomCode = async (
    customCode: string,
    customAlgoName: string,
    selectedTestCases: string[]
  ) => {
    if (!customCode.trim()) {
      throw new Error('Please provide custom code.');
    }

    if (selectedTestCases.length === 0) {
      throw new Error('Please select at least one test case.');
    }

    try {
      // Create a function from the custom code
      const customFunc = new Function('arr', customCode);
      const algorithmName = customAlgoName.trim() || 'Custom Algorithm';

      setIsRunning(true);
      const newResults: BenchmarkResult[] = [];

      for (const testKey of selectedTestCases) {
        const test = testCases[testKey];
        if (!test) continue;
        const testData = generateTestData(test.size, test.sorted || false, test.reversed || false);

        const start = performance.now();
        const output = customFunc([...testData]);
        const end = performance.now();

        if (output && typeof (output as Promise<unknown>).then === 'function') {
          throw new Error('Async custom code is not supported in single benchmark mode.');
        }

        let operations = 0;
        let spaceComplexity = 'Unknown';

        if (output && typeof output === 'object') {
          const resultLike = output as {
            operations?: unknown;
            spaceComplexity?: unknown;
          };

          if (typeof resultLike.operations === 'number') {
            operations = resultLike.operations;
          }
          if (typeof resultLike.spaceComplexity === 'string' && resultLike.spaceComplexity.trim()) {
            spaceComplexity = resultLike.spaceComplexity;
          }
        }

        newResults.push({
          algorithm: algorithmName,
          testCase: test.name,
          inputSize: test.size,
          time: end - start,
          operations,
          timeComplexity: 'Estimating...',
          spaceComplexity
        });
      }

      setResults((prev) => {
        const filtered = prev.filter((r) => r.algorithm !== algorithmName);
        return [...filtered, ...withEstimatedComplexity(newResults)];
      });
    } finally {
      setIsRunning(false);
    }
  };

  const importExternalAlgorithms = (externalCode: string) => {
    const parsedAlgorithms = loadExternalAlgorithms(externalCode);
    setExternalAlgorithms(parsedAlgorithms);
    return Object.keys(parsedAlgorithms).length;
  };

  const clearExternalAlgorithms = () => {
    setExternalAlgorithms({});
  };

  const clearResults = () => {
    setResults([]);
    setProgress(0);
  };

  return {
    results,
    isRunning,
    progress,
    externalAlgorithms,
    runBenchmarks,
    runCustomCode,
    importExternalAlgorithms,
    clearExternalAlgorithms,
    clearResults
  };
};
