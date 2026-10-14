import { useMemo } from 'react';
import { MoodEntry } from '../types';
import { getMoodEmoji, getMostCommonFeeling } from '../utils/moodUtils';

interface WeeklySummaryProps {
    entries: MoodEntry[];
}

export const WeeklySummary = ({ entries }: WeeklySummaryProps) => {
    const summary = useMemo(() => {
        const last7 = [...entries]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 7);

        if (last7.length === 0) return null;

        const avgMood = Math.round(last7.reduce((acc, e) => acc + e.mood, 0) / last7.length);
        const avgSleep = (last7.reduce((acc, e) => acc + e.sleep_hours, 0) / last7.length).toFixed(1);
        const topFeeling = getMostCommonFeeling(last7);

        return {
            avgMood,
            avgSleep,
            topFeeling,
            count: last7.length,
        };
    }, [entries]);

    return (
        <div className="pastel-card p-4 animate-fade-in sm:p-5">
            <h2 className="mb-3 text-lg font-semibold text-purple-700 dark:text-purple-400">📊 Weekly Summary</h2>
            {!summary ? (
                <div className="rounded-xl bg-purple-50/70 p-5 text-center text-sm text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">Log a few moods to see your weekly summary.</div>
            ) : (
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-pastel-mint/50 dark:bg-emerald-900/20 border border-pastel-mint-dark/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Avg Mood</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{getMoodEmoji(summary.avgMood)}</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{summary.count} entries</span>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-pastel-blue/50 dark:bg-blue-900/20 border border-pastel-blue-dark/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Avg Sleep</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">😴</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{summary.avgSleep}h</span>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-pastel-lavender/50 dark:bg-purple-900/20 border border-pastel-lavender-dark/30 col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Most Common Feeling</p>
                    {summary.topFeeling ? (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{summary.topFeeling.emoji}</span>
                            <span className="font-bold text-gray-700 dark:text-gray-200">{summary.topFeeling.label}</span>
                        </div>
                    ) : (
                        <span className="text-gray-400 italic">No feelings logged yet</span>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};
