import { useState } from 'react';
import { MoodEntry } from '../types';
import { getMoodEmoji, getMoodLabel, getMoodPastelClasses } from '../utils/moodUtils';
import { MoodDetailModal } from './MoodDetailModal';

interface MoodCalendarProps {
    entries: MoodEntry[];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MoodCalendar = ({ entries }: MoodCalendarProps) => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

    // Build a map of date string → entry
    const entryMap = new Map<string, MoodEntry>();
    entries.forEach((e) => entryMap.set(e.date, e));

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const pad = (n: number) => String(n).padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    const calendarCells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    // Ensure grid rows complete
    while (calendarCells.length % 7 !== 0) calendarCells.push(null);

    return (
        <div className="pastel-card p-5 transition-colors">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-4">📅 Mood Calendar</h2>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-3">
                <button
                    onClick={prevMonth}
                    className="text-sm px-3 py-1.5 rounded-lg bg-pastel-lavender dark:bg-gray-700 text-purple-700 dark:text-purple-300 hover:bg-pastel-lavender-dark dark:hover:bg-gray-600 transition-colors btn-hover"
                >
                    ‹ Prev
                </button>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{monthLabel}</span>
                <button
                    onClick={nextMonth}
                    className="text-sm px-3 py-1.5 rounded-lg bg-pastel-lavender dark:bg-gray-700 text-purple-700 dark:text-purple-300 hover:bg-pastel-lavender-dark dark:hover:bg-gray-600 transition-colors btn-hover"
                >
                    Next ›
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} />;

                    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
                    const entry = entryMap.get(dateStr);
                    const isToday = dateStr === todayStr;
                    const pastel = entry ? getMoodPastelClasses(entry.mood) : null;

                    return (
                        <button
                            key={dateStr}
                            onClick={() => entry && setSelectedEntry(entry)}
                            className={`
                flex flex-col items-center justify-center rounded-xl py-1.5 min-h-[48px] text-sm
                transition-all duration-150 select-none
                ${entry ? `${pastel?.bg} border border-transparent hover:border-purple-300 hover:shadow-sm cursor-pointer btn-hover dark:bg-purple-900/10` : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-default'}
                ${isToday ? 'ring-2 ring-purple-400 ring-offset-1 dark:ring-offset-[#1F1F2B]' : ''}
              `}
                            disabled={!entry}
                        >
                            <span className={`font-medium ${isToday ? 'text-purple-700 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
                            {entry && (
                                <span className="text-base leading-none mt-0.5" title={getMoodLabel(entry.mood)}>
                                    {getMoodEmoji(entry.mood)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                {[
                    { label: 'Great', color: '#ffe5cc' },
                    { label: 'Good', color: '#c8f5e4' },
                    { label: 'Neutral', color: '#f0f0f0' },
                    { label: 'Sad', color: '#e8d5f5' },
                    { label: 'Very Sad', color: '#cce5ff' },
                ].map(({ label, color }) => (
                    <span key={label} className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <span className="inline-block w-3 h-3 rounded-full border border-gray-100 dark:border-gray-700" style={{ background: color }} />
                        {label}
                    </span>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedEntry && (
                <MoodDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
            )}
        </div>
    );
};

