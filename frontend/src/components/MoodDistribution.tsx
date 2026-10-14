import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { MoodEntry } from '../types';
import { getMoodLabel, MOOD_CHART_COLORS } from '../utils/moodUtils';

interface MoodDistributionProps {
    entries: MoodEntry[];
}

export const MoodDistribution = ({ entries }: MoodDistributionProps) => {
    const data = useMemo(() => {
        const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        entries.forEach((entry) => {
            counts[entry.mood] = (counts[entry.mood] || 0) + 1;
        });

        return [1, 2, 3, 4, 5].map((mood) => ({
            mood: mood,
            label: getMoodLabel(mood),
            count: counts[mood],
        })).reverse(); // Show Great at top
    }, [entries]);

    return (
        <div className="pastel-card p-4 animate-fade-in sm:p-5">
            <h2 className="mb-3 text-lg font-semibold text-purple-700 dark:text-purple-400">🌈 Mood Distribution</h2>

            {entries.length === 0 ? (
                <div className="rounded-xl bg-purple-50/70 p-5 text-center text-sm text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">Mood distribution will appear after your first check-in.</div>
            ) : <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="label"
                            type="category"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            width={80}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={MOOD_CHART_COLORS[entry.mood]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>}

            {entries.length > 0 && <p className="mt-2 text-center text-xs italic text-gray-400 dark:text-gray-500">
                Frequency of each mood in your history
            </p>}
        </div>
    );
};
