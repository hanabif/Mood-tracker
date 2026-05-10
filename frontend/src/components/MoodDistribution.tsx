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

    if (entries.length === 0) return null;

    return (
        <div className="pastel-card p-5 animate-fade-in">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-4">🌈 Mood Distribution</h2>

            <div className="h-[250px] w-full">
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
            </div>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2 italic">
                Frequency of each mood in your history
            </p>
        </div>
    );
};
