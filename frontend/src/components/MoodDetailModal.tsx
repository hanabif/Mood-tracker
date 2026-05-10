import { MoodEntry } from '../types';
import { getMoodEmoji, getMoodLabel, getFeelingLabel } from '../utils/moodUtils';

interface MoodDetailModalProps {
    entry: MoodEntry;
    onClose: () => void;
}

export const MoodDetailModal = ({ entry, onClose }: MoodDetailModalProps) => {
    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="pastel-card p-6 max-w-sm w-full animate-fade-in dark:bg-[#2A2A3B] dark:border-gray-700/50 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
                            {new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-4xl">{getMoodEmoji(entry.mood)}</span>
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-100">{getMoodLabel(entry.mood)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none transition-colors"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="p-3 rounded-xl bg-pastel-blue/30 dark:bg-blue-900/10 border border-pastel-blue-dark/20">
                        <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1 text-xs uppercase">😴 Sleep</p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{entry.sleep_hours} hours</p>
                    </div>

                    {Array.isArray(entry.feelings) && entry.feelings.length > 0 && (
                        <div>
                            <p className="font-semibold text-gray-500 dark:text-gray-400 mb-2 text-xs uppercase">Feelings</p>
                            <div className="flex flex-wrap gap-1.5">
                                {entry.feelings.map((fId) => {
                                    const f = getFeelingLabel(fId);
                                    return (
                                        <span
                                            key={fId}
                                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pastel-mint dark:bg-emerald-900/20 text-green-700 dark:text-emerald-400 text-xs font-medium border border-pastel-mint-dark/30"
                                        >
                                            {f.emoji} {f.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {entry.reflection && (
                        <div>
                            <p className="font-semibold text-gray-500 dark:text-gray-400 mb-2 text-xs uppercase">✏️ Reflection</p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic bg-pastel-yellow/30 dark:bg-yellow-900/5 p-3 rounded-xl border border-pastel-yellow-dark/20">
                                &ldquo;{entry.reflection}&rdquo;
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2.5 rounded-xl bg-pastel-lavender dark:bg-gray-700 text-purple-700 dark:text-purple-300 font-semibold hover:bg-pastel-lavender-dark dark:hover:bg-gray-600 transition-all btn-hover"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
