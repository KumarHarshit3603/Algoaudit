import { Algorithm, BenchmarkExecutionResult } from '../types';

export const algorithms: Record<string, Algorithm> = {
  bubbleSort: {
    name: 'Bubble Sort',
    code: (arr: number[]): BenchmarkExecutionResult => {
      const start = performance.now();
      const copy = [...arr];
      let swaps = 0;
      for (let i = 0; i < copy.length; i++) {
        for (let j = 0; j < copy.length - i - 1; j++) {
          if (copy[j] > copy[j + 1]) {
            [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
            swaps++;
          }
        }
      }
      const end = performance.now();
      return { time: end - start, result: copy, operations: swaps };
    },
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    source: 'Built-in'
  },
  quickSort: {
    name: 'Quick Sort',
    code: (arr: number[]): BenchmarkExecutionResult => {
      let operations = 0;
      const start = performance.now();
      
      const quickSortHelper = (array: number[]): number[] => {
        if (array.length <= 1) return array;
        operations++;
        const pivot = array[Math.floor(array.length / 2)];
        const left = array.filter(x => { operations++; return x < pivot; });
        const middle = array.filter(x => { operations++; return x === pivot; });
        const right = array.filter(x => { operations++; return x > pivot; });
        return [...quickSortHelper(left), ...middle, ...quickSortHelper(right)];
      };
      
      const result = quickSortHelper([...arr]);
      const end = performance.now();
      return { time: end - start, result, operations };
    },
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    source: 'Built-in'
  },
  mergeSort: {
    name: 'Merge Sort',
    code: (arr: number[]): BenchmarkExecutionResult => {
      let operations = 0;
      const start = performance.now();
      
      const merge = (left: number[], right: number[]): number[] => {
        const result: number[] = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
          operations++;
          if (left[i] < right[j]) {
            result.push(left[i++]);
          } else {
            result.push(right[j++]);
          }
        }
        return [...result, ...left.slice(i), ...right.slice(j)];
      };
      
      const mergeSortHelper = (array: number[]): number[] => {
        if (array.length <= 1) return array;
        operations++;
        const mid = Math.floor(array.length / 2);
        const left = mergeSortHelper(array.slice(0, mid));
        const right = mergeSortHelper(array.slice(mid));
        return merge(left, right);
      };
      
      const result = mergeSortHelper([...arr]);
      const end = performance.now();
      return { time: end - start, result, operations };
    },
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    source: 'Built-in'
  },
  insertionSort: {
    name: 'Insertion Sort',
    code: (arr: number[]): BenchmarkExecutionResult => {
      const start = performance.now();
      const copy = [...arr];
      let operations = 0;
      for (let i = 1; i < copy.length; i++) {
        const key = copy[i];
        let j = i - 1;
        while (j >= 0 && copy[j] > key) {
          operations++;
          copy[j + 1] = copy[j];
          j--;
        }
        copy[j + 1] = key;
      }
      const end = performance.now();
      return { time: end - start, result: copy, operations };
    },
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    source: 'Built-in'
  },
  selectionSort: {
    name: 'Selection Sort',
    code: (arr: number[]): BenchmarkExecutionResult => {
      const start = performance.now();
      const copy = [...arr];
      let operations = 0;
      for (let i = 0; i < copy.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < copy.length; j++) {
          operations++;
          if (copy[j] < copy[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          [copy[i], copy[minIdx]] = [copy[minIdx], copy[i]];
        }
      }
      const end = performance.now();
      return { time: end - start, result: copy, operations };
    },
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    source: 'Built-in'
  }
};
