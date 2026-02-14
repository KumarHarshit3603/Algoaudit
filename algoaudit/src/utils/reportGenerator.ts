import { BenchmarkResult } from '../types';

export const generateReport = (results: BenchmarkResult[]): string => {
  let report = '═══════════════════════════════════════════════════════\n';
  report += '                   ALGOAUDIT REPORT                    \n';
  report += '═══════════════════════════════════════════════════════\n\n';
  report += `Generated: ${new Date().toLocaleString()}\n\n`;

  report += '───────────────────────────────────────────────────────\n';
  report += 'BENCHMARK RESULTS\n';
  report += '───────────────────────────────────────────────────────\n\n';

  results.forEach((result, idx) => {
    report += `[${idx + 1}] ${result.algorithm}\n`;
    report += `    Test Case: ${result.testCase}\n`;
    report += `    Execution Time: ${result.time.toFixed(4)} ms\n`;
    report += `    Operations: ${result.operations || 'N/A'}\n`;
    report += `    Time Complexity: ${result.timeComplexity}\n`;
    report += `    Space Complexity: ${result.spaceComplexity}\n\n`;
  });

  // Summary statistics
  const groupedByAlgo = results.reduce((acc, r) => {
    if (!acc[r.algorithm]) acc[r.algorithm] = [];
    acc[r.algorithm].push(r.time);
    return acc;
  }, {} as Record<string, number[]>);

  report += '───────────────────────────────────────────────────────\n';
  report += 'SUMMARY STATISTICS\n';
  report += '───────────────────────────────────────────────────────\n\n';

  Object.entries(groupedByAlgo).forEach(([algo, times]) => {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    report += `${algo}:\n`;
    report += `    Average Time: ${avg.toFixed(4)} ms\n`;
    report += `    Min Time: ${min.toFixed(4)} ms\n`;
    report += `    Max Time: ${max.toFixed(4)} ms\n`;
    report += `    Tests Run: ${times.length}\n\n`;
  });

  report += '───────────────────────────────────────────────────────\n';
  report += 'RECOMMENDATIONS\n';
  report += '───────────────────────────────────────────────────────\n\n';

  const fastest = results.reduce((min, r) => r.time < min.time ? r : min);
  report += `⚡ Fastest: ${fastest.algorithm} on ${fastest.testCase} (${fastest.time.toFixed(4)} ms)\n\n`;

  report += '═══════════════════════════════════════════════════════\n';
  report += '                   END OF REPORT                       \n';
  report += '═══════════════════════════════════════════════════════\n';

  return report;
};

export const downloadReport = (report: string): void => {
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `algoaudit-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};
