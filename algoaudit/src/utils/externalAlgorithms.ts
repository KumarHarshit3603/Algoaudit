import { Algorithm, BenchmarkExecutionResult, ExternalAlgorithmDefinition } from '../types';

const isBenchmarkExecutionResult = (value: unknown): value is BenchmarkExecutionResult => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<BenchmarkExecutionResult>;
  return (
    typeof candidate.time === 'number' &&
    typeof candidate.operations === 'number' &&
    Array.isArray(candidate.result)
  );
};

const toKey = (name: string, fallback: number): string => {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized ? `ext-${normalized}` : `ext-algorithm-${fallback}`;
};

const normalizeExternalAlgorithm = (
  definition: ExternalAlgorithmDefinition,
  index: number
): [string, Algorithm] => {
  const runner = definition.run || definition.code;
  if (typeof runner !== 'function') {
    throw new Error(`External algorithm #${index + 1} is missing a runnable function (use "run" or "code").`);
  }

  const algorithmName = definition.name?.trim();
  if (!algorithmName) {
    throw new Error(`External algorithm #${index + 1} is missing a valid "name".`);
  }

  const key = definition.key?.trim() || toKey(algorithmName, index + 1);

  const wrappedCode = (arr: number[]): BenchmarkExecutionResult => {
    const input = [...arr];
    const start = performance.now();
    const output = runner(input);
    const end = performance.now();

    if (output && typeof (output as Promise<unknown>).then === 'function') {
      throw new Error(`"${algorithmName}" returned a Promise. Async algorithms are not supported.`);
    }

    if (isBenchmarkExecutionResult(output)) {
      return {
        ...output,
        time: end - start
      };
    }

    const operations =
      output && typeof output === 'object' && typeof (output as { operations?: unknown }).operations === 'number'
        ? Number((output as { operations: number }).operations)
        : 0;

    const result =
      output && typeof output === 'object' && Array.isArray((output as { result?: unknown }).result)
        ? ([...(output as { result: number[] }).result] as number[])
        : input;

    return {
      time: end - start,
      operations,
      result
    };
  };

  return [
    key,
    {
      name: algorithmName,
      code: wrappedCode,
      timeComplexity: definition.timeComplexity || 'Unknown',
      spaceComplexity: definition.spaceComplexity || 'Unknown',
      source: 'External'
    }
  ];
};

const toDefinitions = (value: unknown): ExternalAlgorithmDefinition[] => {
  if (Array.isArray(value)) {
    return value as ExternalAlgorithmDefinition[];
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, ExternalAlgorithmDefinition>).map(([key, definition]) => ({
      ...definition,
      key: definition?.key || key,
      name: definition?.name || key
    }));
  }

  throw new Error(
    'External code must return an array of algorithm definitions or an object map of definitions.'
  );
};

export const loadExternalAlgorithms = (sourceCode: string): Record<string, Algorithm> => {
  if (!sourceCode.trim()) {
    throw new Error('External code is empty.');
  }

  let evaluated: unknown;
  try {
    const factory = new Function(`"use strict";\n${sourceCode}`);
    evaluated = factory();
  } catch (error) {
    throw new Error(`Could not evaluate external code: ${(error as Error).message}`);
  }

  const definitions = toDefinitions(evaluated);
  if (definitions.length === 0) {
    throw new Error('No algorithms found in external code.');
  }

  return definitions.reduce((acc, definition, index) => {
    const [key, algorithm] = normalizeExternalAlgorithm(definition, index);
    if (acc[key]) {
      throw new Error(`Duplicate external algorithm key "${key}".`);
    }
    acc[key] = algorithm;
    return acc;
  }, {} as Record<string, Algorithm>);
};

export const externalDsaTemplate = `// Return an array (or object map) of algorithm definitions.
// Each algorithm needs: name + run(arr). Optional: timeComplexity, spaceComplexity.
// You can edit, add, or remove algorithms before loading.
return [
  {
    name: 'Heap Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    run: (arr) => {
      const a = [...arr];
      let operations = 0;

      const heapify = (n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && a[left] > a[largest]) largest = left;
        if (right < n && a[right] > a[largest]) largest = right;
        operations += 2;

        if (largest !== i) {
          [a[i], a[largest]] = [a[largest], a[i]];
          operations++;
          heapify(n, largest);
        }
      };

      for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) heapify(a.length, i);
      for (let i = a.length - 1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];
        operations++;
        heapify(i, 0);
      }

      return { result: a, operations };
    }
  },
  {
    name: 'Counting Sort',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)',
    run: (arr) => {
      const a = [...arr];
      let operations = 0;
      const max = Math.max(...a);
      const count = new Array(max + 1).fill(0);
      for (const n of a) {
        count[n]++;
        operations++;
      }
      const out = [];
      for (let i = 0; i < count.length; i++) {
        while (count[i] > 0) {
          out.push(i);
          count[i]--;
          operations++;
        }
      }
      return { result: out, operations };
    }
  },
  {
    name: 'Radix Sort (LSD)',
    timeComplexity: 'O(d*(n+b))',
    spaceComplexity: 'O(n+b)',
    run: (arr) => {
      let a = [...arr];
      let operations = 0;
      const max = Math.max(...a);
      for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        const buckets = Array.from({ length: 10 }, () => []);
        for (const n of a) {
          const digit = Math.floor(n / exp) % 10;
          buckets[digit].push(n);
          operations++;
        }
        a = [].concat(...buckets);
      }
      return { result: a, operations };
    }
  },
  {
    name: 'Linear Search',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    run: (arr) => {
      const target = arr[arr.length - 1];
      let operations = 0;
      for (let i = 0; i < arr.length; i++) {
        operations++;
        if (arr[i] === target) return { result: [i], operations };
      }
      return { result: [-1], operations };
    }
  },
  {
    name: 'Binary Search',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    run: (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const target = sorted[Math.floor(sorted.length / 2)];
      let left = 0;
      let right = sorted.length - 1;
      let operations = 0;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        operations++;
        if (sorted[mid] === target) return { result: [mid], operations };
        if (sorted[mid] < target) left = mid + 1;
        else right = mid - 1;
      }
      return { result: [-1], operations };
    }
  },
  {
    name: 'Kadane (Max Subarray)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    run: (arr) => {
      let operations = 0;
      let maxEnding = arr[0];
      let maxSoFar = arr[0];
      for (let i = 1; i < arr.length; i++) {
        maxEnding = Math.max(arr[i], maxEnding + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEnding);
        operations += 2;
      }
      return { result: [maxSoFar], operations };
    }
  },
  {
    name: 'LIS (DP)',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n)',
    run: (arr) => {
      const n = arr.length;
      const dp = new Array(n).fill(1);
      let operations = 0;
      for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
          operations++;
          if (arr[i] > arr[j]) dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }
      return { result: [Math.max(...dp)], operations };
    }
  },
  {
    name: 'Fibonacci (DP)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    run: (arr) => {
      const n = Math.max(2, Math.floor(arr.length / 100));
      let operations = 0;
      const dp = new Array(n + 1).fill(0);
      dp[1] = 1;
      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        operations++;
      }
      return { result: [dp[n]], operations };
    }
  }
];
`;
