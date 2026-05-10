import { useMemo } from 'react';
import { MoodEntry } from '../types';

interface AveragesComparisonProps {
  entries: MoodEntry[];
}

const calculateAverages = (entries: MoodEntry[]) => {
  if (entries.length === 0) return { mood: 0, sleep: 0 };
  const totalMood = entries.reduce((acc, e) => acc + e.mood, 0);
  const totalSleep = entries.reduce((acc, e) => acc + e.sleep_hours, 0);
  return { mood: totalMood / entries.length, sleep: totalSleep / entries.length };
};

const Trend = ({ change }: { change: number }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  return (
    <span className={`font-semibold ${isPositive ? 'text-green-500' : isNegative ? 'text-red-400' : 'text-gray-400'}`}>
      {isPositive && '▲'}{isNegative && '▼'} {Math.abs(change).toFixed(1)}%
    </span>
  );
};

export const AveragesComparison = ({ entries }: AveragesComparisonProps) => {
  const { last5, prev5 } = useMemo(() => {
    const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { last5: sorted.slice(0, 5), prev5: sorted.slice(5, 10) };
  }, [entries]);

  const last5Avg = useMemo(() => calculateAverages(last5), [last5]);
  const prev5Avg = useMemo(() => calculateAverages(prev5), [prev5]);

  const moodChange = useMemo(() => {
    if (prev5Avg.mood === 0) return 0;
    return ((last5Avg.mood - prev5Avg.mood) / prev5Avg.mood) * 100;
  }, [last5Avg.mood, prev5Avg.mood]);

  const sleepChange = useMemo(() => {
    if (prev5Avg.sleep === 0) return 0;
    return ((last5Avg.sleep - prev5Avg.sleep) / prev5Avg.sleep) * 100;
  }, [last5Avg.sleep, prev5Avg.sleep]);

  return (
    <div className="pastel-card p-5">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">📈 Averages Comparison</h2>
      {entries.length < 10 ? (
        <div className="text-center py-6 text-gray-400">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm">Need at least 10 entries for comparison.</p>
          <p className="text-xs mt-1 text-gray-300">You have {entries.length} so far.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-pastel-peach/50">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">😊 Mood</h3>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Last 5: <strong>{last5Avg.mood.toFixed(1)}</strong></span>
              <span>Prev 5: <strong>{prev5Avg.mood.toFixed(1)}</strong></span>
            </div>
            <p className="text-sm mt-1">Change: <Trend change={moodChange} /></p>
          </div>
          <div className="p-3 rounded-xl bg-pastel-blue/50">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">😴 Sleep</h3>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Last 5: <strong>{last5Avg.sleep.toFixed(1)}h</strong></span>
              <span>Prev 5: <strong>{prev5Avg.sleep.toFixed(1)}h</strong></span>
            </div>
            <p className="text-sm mt-1">Change: <Trend change={sleepChange} /></p>
          </div>
        </div>
      )}
    </div>
  );
};
