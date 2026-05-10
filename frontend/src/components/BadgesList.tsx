import { useMemo } from 'react';
import { MoodEntry } from '../types';
import { calculateStreak } from '../utils/moodUtils';

interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
    colorClass: string;
}

interface BadgesListProps {
    entries: MoodEntry[];
}

export const BadgesList = ({ entries }: BadgesListProps) => {
    const badges = useMemo(() => {
        const list: Badge[] = [];
        const streak = calculateStreak(entries);
        const reflectionCount = entries.filter((e) => !!e.reflection).length;
        const avgSleep = entries.length > 0
            ? entries.reduce((acc, e) => acc + e.sleep_hours, 0) / entries.length
            : 0;

        if (entries.length >= 1) {
            list.push({
                id: 'first-entry',
                title: 'First Entry',
                description: 'Logged your first mood!',
                icon: '🏅',
                colorClass: 'bg-pastel-lavender dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-pastel-lavender-dark/30',
            });
        }

        if (streak >= 7) {
            list.push({
                id: 'seven-day-streak',
                title: '7 Day Streak',
                description: 'A full week of mindfulness!',
                icon: '🔥',
                colorClass: 'bg-pastel-peach dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-pastel-peach-dark/30',
            });
        }

        if (reflectionCount >= 10) {
            list.push({
                id: 'reflection-pro',
                title: 'Reflection Pro',
                description: '10 thoughts captured.',
                icon: '🧠',
                colorClass: 'bg-pastel-mint dark:bg-emerald-900/20 text-green-700 dark:text-emerald-400 border-pastel-mint-dark/30',
            });
        }

        if (avgSleep >= 8 && entries.length >= 3) {
            list.push({
                id: 'sleep-master',
                title: 'Sleep Master',
                description: 'Excellent sleep hygiene.',
                icon: '🌙',
                colorClass: 'bg-pastel-blue dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-pastel-blue-dark/30',
            });
        }

        return list;
    }, [entries]);

    if (badges.length === 0) return null;

    return (
        <div className="pastel-card p-5 animate-fade-in">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-4">🏆 Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className={`
                            flex items-center gap-3 p-3 rounded-2xl border transition-all hover:scale-[1.02]
                            ${badge.colorClass}
                        `}
                    >
                        <span className="text-3xl">{badge.icon}</span>
                        <div>
                            <p className="font-bold text-sm">{badge.title}</p>
                            <p className="text-[10px] opacity-80">{badge.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
