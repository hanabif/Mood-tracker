import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMoodEntries } from '../hooks/useMoodEntries';
import { getMoodEmoji, getMoodLabel, getFeelingLabel } from '../utils/moodUtils';

export const MoodHistory = () => {
    const { user } = useAuth();
    const { data: entries, isLoading, isError } = useMoodEntries(user?.id);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const sortedEntries = useMemo(() => {
        if (!entries) return [];
        return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [entries]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 w-48 mx-auto rounded" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl text-center text-red-500">
                Error loading mood history.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-8 border-b dark:border-gray-700 pb-4 flex items-center gap-3">
                <span>📖</span> Mood History
            </h1>

            <div className="relative border-l-2 border-purple-100 dark:border-gray-800 ml-4 space-y-8 pb-8">
                {sortedEntries.map((entry) => {
                    const isExpanded = expandedId === entry.id;
                    const date = new Date(entry.date + 'T12:00:00');
                    const day = date.getDate();
                    const month = date.toLocaleString('default', { month: 'short' });

                    return (
                        <div key={entry.id} className="relative pl-8">
                            {/* Timeline marker */}
                            <div className="absolute left-[-9px] top-4 w-4 h-4 rounded-full bg-white dark:bg-[#1F1F2B] border-2 border-purple-300 dark:border-purple-500" />

                            <div
                                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                className={`
                  pastel-card p-5 cursor-pointer transition-all duration-300 group
                  hover:scale-[1.02] hover:shadow-md
                  ${isExpanded ? 'ring-2 ring-purple-200 dark:ring-purple-900/50' : ''}
                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center min-w-[40px]">
                                            <p className="text-xs font-bold text-purple-400 dark:text-purple-500 uppercase">{month}</p>
                                            <p className="text-xl font-bold text-gray-700 dark:text-gray-200">{day}</p>
                                        </div>
                                        <div className="h-10 w-[1px] bg-gray-100 dark:bg-gray-700 mx-1" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                                                <h3 className="font-bold text-gray-800 dark:text-gray-100">{getMoodLabel(entry.mood)}</h3>
                                            </div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                😴 {entry.sleep_hours}h sleep
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        {isExpanded ? '📖' : '📘'}
                                    </span>
                                </div>

                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 space-y-3 animate-fade-in">
                                        {Array.isArray(entry.feelings) && entry.feelings.length > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider mb-2">Feelings</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {entry.feelings.map(fId => {
                                                        const f = getFeelingLabel(fId);
                                                        return (
                                                            <span key={fId} className="px-3 py-1 rounded-full bg-pastel-mint dark:bg-emerald-900/20 text-green-700 dark:text-emerald-400 text-xs font-medium border border-pastel-mint-dark/30">
                                                                {f.emoji} {f.label}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {entry.reflection && (
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider mb-2">Reflection</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                                                    &ldquo;{entry.reflection}&rdquo;
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {sortedEntries.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-5xl mb-4">📓</p>
                    <h2 className="text-xl font-bold">Your journal is empty</h2>
                    <p className="text-sm mt-2">Log your first mood to start your history.</p>
                </div>
            )}
        </div>
    );
};
