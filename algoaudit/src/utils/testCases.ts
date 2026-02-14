import { TestCase } from '../types';

export const testCases: Record<string, TestCase> = {
  small: { name: 'Small (100)', size: 100 },
  medium: { name: 'Medium (1000)', size: 1000 },
  large: { name: 'Large (5000)', size: 5000 },
  sorted: { name: 'Already Sorted (1000)', size: 1000, sorted: true },
  reversed: { name: 'Reversed (1000)', size: 1000, reversed: true }
};

export const generateTestData = (size: number, sorted = false, reversed = false): number[] => {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  if (reversed) return arr.reverse();
  if (sorted) return arr;
  return arr.sort(() => Math.random() - 0.5);
};
