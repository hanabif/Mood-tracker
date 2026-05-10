import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MoodEntry } from '../types';
import { getMoodEmoji, getMoodLabel, MOOD_CHART_COLORS, getFeelingLabel } from '../utils/moodUtils';

interface MoodTrendsProps {
  entries: MoodEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const entry: MoodEntry = payload[0]?.payload?.fullEntry;
  return (
    <div className="bg-white/95 border border-pastel-lavender-dark rounded-xl p-3 shadow-lg text-sm max-w-[200px]">
      <p className="font-semibold text-gray-600 mb-1.5">{label}</p>
      {entry && (
        <>
          <p className="flex items-center gap-1">
            <span>{getMoodEmoji(entry.mood)}</span>
            <span className="text-gray-700">{getMoodLabel(entry.mood)}</span>
          </p>
          <p className="text-gray-500 mt-1">😴 {entry.sleep_hours}h sleep</p>
          {Array.isArray(entry.feelings) && entry.feelings.length > 0 && (
            <p className="text-gray-500 mt-1">
              {entry.feelings.slice(0, 3).map((f) => getFeelingLabel(f).emoji).join(' ')}
              {entry.feelings.length > 3 ? ` +${entry.feelings.length - 3}` : ''}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export const MoodTrends = ({ entries }: MoodTrendsProps) => {
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  const last11Entries = entries.slice(-11);

  const data = last11Entries.map((entry) => ({
    date: new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: entry.mood,
    sleep: entry.sleep_hours,
    fullEntry: entry,
  }));

  const handleBarClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.fullEntry) {
      setSelectedEntry(data.activePayload[0].payload.fullEntry);
    }
  };

  return (
    <div className="pastel-card p-5">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">📊 Mood &amp; Sleep Trends</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} onClick={handleBarClick} style={{ cursor: 'pointer' }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => value === 'mood' ? '😊 Mood' : '😴 Sleep (h)'}
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Bar dataKey="mood" name="mood" radius={[6, 6, 0, 0]} maxBarSize={32}>
            {data.map((d, idx) => (
              <Cell key={idx} fill={MOOD_CHART_COLORS[d.mood] ?? '#d4d4d4'} />
            ))}
          </Bar>
          <Bar dataKey="sleep" name="sleep" fill="#c8f5e4" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>

      {/* Entry detail panel */}
      {selectedEntry && (
        <div className="mt-4 p-4 bg-gradient-to-r from-pastel-lavender to-pastel-blue rounded-xl animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-medium">
                {new Date(selectedEntry.date + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric',
                })}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl">{getMoodEmoji(selectedEntry.mood)}</span>
                <span className="font-semibold text-gray-700">{getMoodLabel(selectedEntry.mood)}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
            >
              ×
            </button>
          </div>
          <div className="mt-2 text-sm space-y-1">
            <p className="text-gray-600">😴 Sleep: {selectedEntry.sleep_hours}h</p>
            {Array.isArray(selectedEntry.feelings) && selectedEntry.feelings.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedEntry.feelings.map((fId) => {
                  const f = getFeelingLabel(fId);
                  return (
                    <span key={fId} className="px-2 py-0.5 rounded-full bg-white/60 text-xs text-gray-700 border border-white">
                      {f.emoji} {f.label}
                    </span>
                  );
                })}
              </div>
            )}
            {selectedEntry.reflection && (
              <p className="text-gray-600 mt-1">✏️ {selectedEntry.reflection}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
