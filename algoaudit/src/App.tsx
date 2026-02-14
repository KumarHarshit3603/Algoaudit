import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AlgorithmSelector from './components/AlgorithmSelector';
import TestCaseSelector from './components/TestCaseSelector';
import CustomCodePanel from './components/CustomCodePanel';
import ActionBar from './components/ActionBar';
import PerformanceCharts from './components/PerformanceCharts';
import ResultsTable from './components/ResultsTable';
import EmptyState from './components/EmptyState';
import { useBenchmark } from './hooks/useBenchmark';
import { generateReport, downloadReport } from './utils/reportGenerator';
import { algorithms } from './utils/algorithms';
import { externalDsaTemplate } from './utils/externalAlgorithms';
import { ChartDataPoint } from './types';

const App: React.FC = () => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['bubbleSort', 'quickSort']);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>(['small', 'medium']);
  const [customCode, setCustomCode] = useState('');
  const [customAlgoName, setCustomAlgoName] = useState('');
  const [abTestMode, setAbTestMode] = useState(false);

  const {
    results,
    isRunning,
    progress,
    externalAlgorithms,
    runBenchmarks,
    runCustomCode,
    importExternalAlgorithms,
    clearExternalAlgorithms
  } = useBenchmark();

  const allAlgorithms = useMemo(
    () => ({
      ...algorithms,
      ...externalAlgorithms
    }),
    [externalAlgorithms]
  );

  const toggleAlgorithm = (key: string) => {
    setSelectedAlgorithms((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const toggleTestCase = (key: string) => {
    setSelectedTestCases((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleRunBenchmarks = () => {
    runBenchmarks(selectedAlgorithms, selectedTestCases);
  };

  const handleRunCustomCode = async () => {
    try {
      await runCustomCode(customCode, customAlgoName, selectedTestCases);
    } catch (error) {
      alert('Error in custom code: ' + (error as Error).message);
    }
  };

  const handleLoadExternalAlgorithms = () => {
    try {
      const loadedCount = importExternalAlgorithms(customCode);
      alert(`Loaded ${loadedCount} external algorithm(s).`);
    } catch (error) {
      alert('Error loading external algorithms: ' + (error as Error).message);
    }
  };

  const handleLoadTemplate = () => {
    setCustomCode(externalDsaTemplate);
  };

  const handleClearExternalAlgorithms = () => {
    clearExternalAlgorithms();
    setSelectedAlgorithms((prev) =>
      prev.filter((key) => Object.prototype.hasOwnProperty.call(algorithms, key))
    );
  };

  const handleDownloadReport = () => {
    if (results.length === 0) {
      alert('No benchmark results to download');
      return;
    }
    const report = generateReport(results);
    downloadReport(report);
  };

  const chartData = useMemo(() => {
    return results.reduce((acc, r) => {
      const existing = acc.find((item) => item.testCase === r.testCase);
      if (existing) {
        existing[r.algorithm] = r.time;
      } else {
        acc.push({ testCase: r.testCase, [r.algorithm]: r.time });
      }
      return acc;
    }, [] as ChartDataPoint[]);
  }, [results]);

  const radarData = useMemo(() => {
    const algorithmNames = Array.from(new Set(results.map((r) => r.algorithm)));
    const avgTimes = algorithmNames.map((algorithmName) => {
      const algoResults = results.filter((r) => r.algorithm === algorithmName);
      const avgTime = algoResults.length > 0
        ? algoResults.reduce((sum, r) => sum + r.time, 0) / algoResults.length
        : 0;
      return { algorithmName, avgTime };
    });

    const validTimes = avgTimes.map((item) => item.avgTime).filter((time) => time > 0);
    const minTime = validTimes.length > 0 ? Math.min(...validTimes) : 0;
    const maxTime = validTimes.length > 0 ? Math.max(...validTimes) : 0;

    return avgTimes.map(({ algorithmName, avgTime }) => {
      let performance = 0;
      if (avgTime > 0) {
        if (maxTime === minTime) {
          performance = 100;
        } else {
          performance = ((maxTime - avgTime) / (maxTime - minTime)) * 100;
          performance = Number(performance.toFixed(2));
        }
      }
      return {
        algorithm: algorithmName,
        performance
      };
    });
  }, [results]);

  const selectedAlgoNames = useMemo(() => {
    return Array.from(new Set(results.map((r) => r.algorithm)));
  }, [results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8 grid-bg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-slide-in">
          <AlgorithmSelector algorithms={allAlgorithms} selectedAlgorithms={selectedAlgorithms} onToggle={toggleAlgorithm} />

          <TestCaseSelector
            selectedTestCases={selectedTestCases}
            onToggle={toggleTestCase}
            abTestMode={abTestMode}
            onAbTestToggle={() => setAbTestMode(!abTestMode)}
          />

          <CustomCodePanel
            customAlgoName={customAlgoName}
            customCode={customCode}
            isRunning={isRunning}
            externalCount={Object.keys(externalAlgorithms).length}
            onNameChange={setCustomAlgoName}
            onCodeChange={setCustomCode}
            onRunSingle={handleRunCustomCode}
            onLoadExternal={handleLoadExternalAlgorithms}
            onLoadTemplate={handleLoadTemplate}
            onClearExternal={handleClearExternalAlgorithms}
          />
        </div>

        <ActionBar
          isRunning={isRunning}
          resultsCount={results.length}
          progress={progress}
          abTestMode={abTestMode}
          onRunBenchmarks={handleRunBenchmarks}
          onDownloadReport={handleDownloadReport}
          canRun={selectedAlgorithms.length > 0 && selectedTestCases.length > 0}
        />

        {results.length > 0 ? (
          <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <PerformanceCharts chartData={chartData} radarData={radarData} selectedAlgorithms={selectedAlgoNames} />
            <ResultsTable results={results} />
          </div>
        ) : (
          !isRunning && <EmptyState />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
