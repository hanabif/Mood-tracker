import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { MoodEntry } from '../types';
import { getMoodEmoji } from '../utils/moodUtils';
import debounce from 'lodash/debounce';

interface ReflectionSearchProps {
    onEntryClick: (entry: MoodEntry) => void;
}

export const ReflectionSearch = ({ onEntryClick }: ReflectionSearchProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MoodEntry[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchReflections = useCallback(
        debounce(async (q: string) => {
            if (!q.trim()) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const response = await api.get(`/mood-entries/search/?q=${q}`);
                setResults(response.data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 400),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        searchReflections(value);
    };

    return (
        <div className="pastel-card p-5 animate-fade-in mb-6">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                <span>🔍</span> Search Reflections
            </h2>

            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search keywords in your thoughts..."
                    className="w-full px-4 py-2.5 rounded-xl border border-pastel-lavender dark:border-gray-700 bg-white dark:bg-[#1a1a24] text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-pastel-lavender-dark outline-none transition-all pr-10"
                />
                {isSearching && (
                    <div className="absolute right-3 top-3 animate-spin text-purple-400">🌀</div>
                )}
            </div>

            {results.length > 0 ? (
                <div className="mt-4 space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {results.map((entry) => (
                        <button
                            key={entry.id}
                            onClick={() => onEntryClick(entry)}
                            className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-pastel-lavender/30 dark:hover:bg-purple-900/10 transition-colors text-left border border-transparent hover:border-pastel-lavender-dark/20"
                        >
                            <span className="text-2xl mt-1">{getMoodEmoji(entry.mood)}</span>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    {new Date(entry.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 italic">
                                    &ldquo;{entry.reflection}&rdquo;
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : query.trim() && !isSearching ? (
                <p className="mt-4 text-center text-sm text-gray-400 italic">No matches found for &ldquo;{query}&rdquo;</p>
            ) : null}
        </div>
    );
};
