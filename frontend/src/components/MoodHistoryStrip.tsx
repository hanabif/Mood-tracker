import { MoodEntry } from '../types';
import { getMoodEmoji } from '../utils/moodUtils';

interface MoodHistoryStripProps {
    entries: MoodEntry[];
    onEntryClick: (entry: MoodEntry) => void;
}

export const MoodHistoryStrip = ({ entries, onEntryClick }: MoodHistoryStripProps) => {
    const last7Days = [...entries]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7)
        .reverse();

    if (last7Days.length === 0) return null;

    return (
        <div className="pastel-card p-4 mb-6 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1">
                Last 7 Records
            </h3>
            <div className="flex justify-between items-center gap-2">
                {last7Days.map((entry) => (
                    <button
                        key={entry.id}
                        onClick={() => onEntryClick(entry)}
                        className="group relative flex flex-col items-center flex-1"
                    >
                        <div className="text-3xl hover:scale-125 transition-transform cursor-pointer">
                            {getMoodEmoji(entry.mood)}
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap shadow-lg">
                                <p className="font-bold">{new Date(entry.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                <p>😴 {entry.sleep_hours}h sleep</p>
                            </div>
                            <div className="w-2 h-2 bg-gray-800 rotate-45 mx-auto -mt-1" />
                        </div>

                        <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 mt-2 group-hover:bg-purple-400 transition-colors" />
                    </button>
                ))}
                {last7Days.length < 7 && Array.from({ length: 7 - last7Days.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex-1 flex flex-col items-center">
                        <div className="text-3xl opacity-10 grayscale">❓</div>
                        <div className="w-1 h-1 rounded-full bg-gray-100 dark:bg-gray-800 mt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
};
