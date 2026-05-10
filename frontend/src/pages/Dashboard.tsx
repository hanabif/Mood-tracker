import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMoodEntries } from '../hooks/useMoodEntries';
import { useQuotes } from '../hooks/useQuotes';
import { MoodLogForm } from '../components/MoodLogForm';
import { MoodTrends } from '../components/MoodTrends';
import { AveragesComparison } from '../components/AveragesComparison';
import { MoodCalendar } from '../components/MoodCalendar';
import { WeeklySummary } from '../components/WeeklySummary';
import { SelfCareSuggestions } from '../components/SelfCareSuggestions';
import { MoodHistoryStrip } from '../components/MoodHistoryStrip';
import { MoodDistribution } from '../components/MoodDistribution';
import { MoodDetailModal } from '../components/MoodDetailModal';
import { BadgesList } from '../components/BadgesList';
import { ReflectionSearch } from '../components/ReflectionSearch';
import { getTodayEntry } from '../utils/getTodayEntry';
import { getMoodEmoji, getMoodLabel, getMoodPastelClasses, getFeelingLabel, calculateStreak } from '../utils/moodUtils';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: entries, isLoading, isError } = useMoodEntries(user?.id);
  const { data: quotes } = useQuotes();
  const [showLogForm, setShowLogForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  const todayEntry = useMemo(() => getTodayEntry(entries), [entries]);

  const streak = useMemo(() => {
    if (!entries) return 0;
    return calculateStreak(entries);
  }, [entries]);

  const latestEntry = useMemo(() => {
    if (!entries || entries.length === 0) return null;
    return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [entries]);

  const accentClasses = useMemo(() => {
    if (!latestEntry) return { bg: 'bg-pastel-lavender', border: 'border-pastel-lavender-dark', dot: '#e8d5f5' };
    return getMoodPastelClasses(latestEntry.mood);
  }, [latestEntry]);

  const quoteForToday = useMemo(() => {
    if (!todayEntry || !quotes) return null;
    const filtered = quotes.filter((q) => q.mood === todayEntry.mood);
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  }, [todayEntry, quotes]);

  const handleLogMoodClick = () => {
    if (todayEntry) {
      setShowConfirm(true);
    } else {
      setShowLogForm(true);
    }
  };

  const handleConfirmReLog = () => {
    setShowConfirm(false);
    setShowLogForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            🌸 Dashboard
          </h1>
          <div className="flex items-center gap-4 mt-1">
            {user && (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Hi, <span className="text-purple-500 font-medium">{user.name || user.username}</span>
              </p>
            )}
            {streak > 0 && (
              <span className="text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-bounce-in">
                🔥 {streak} Day Streak
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleLogMoodClick}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
            ${accentClasses.bg} border ${accentClasses.border} dark:bg-purple-900/20 dark:border-purple-800
            hover:shadow-md hover:scale-105 transition-all duration-150
            text-gray-700 dark:text-gray-200
          `}
        >
          ✨ Log Mood
        </button>
      </div>

      {streak >= 3 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl text-white shadow-lg animate-fade-in flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Amazing streak! 🔥</p>
            <p className="text-sm opacity-90">You&apos;ve logged your mood {streak} days in a row. Keep taking care of yourself!</p>
          </div>
          <span className="text-4xl">🚀</span>
        </div>
      )}

      {/* Confirmation dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="pastel-card p-6 max-w-sm w-full animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <span className="text-4xl">🔄</span>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">Log another entry?</h3>
              <p className="text-sm text-gray-500 mt-1">
                You already logged a mood for today. Submitting again will update today&apos;s entry.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReLog}
                className="flex-1 px-4 py-2 rounded-xl bg-pastel-lavender dark:bg-purple-900 border border-pastel-lavender-dark dark:border-purple-800 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-pastel-lavender-dark dark:hover:bg-purple-800/80 transition-colors"
              >
                Update Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Log Form (slides in above today's entry) */}
      {showLogForm && (
        <div className="mb-6 animate-fade-in">
          <MoodLogForm onSuccess={() => setShowLogForm(false)} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <div className="w-full h-24 bg-white/50 dark:bg-gray-800/50 rounded-2xl animate-pulse" />
          <div className="h-64 bg-white/50 dark:bg-gray-800/50 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-40 bg-white/50 dark:bg-gray-800/50 rounded-2xl animate-pulse" />
            <div className="h-40 bg-white/50 dark:bg-gray-800/50 rounded-2xl animate-pulse" />
          </div>
        </div>
      ) : isError ? (
        <div className="pastel-card p-4 text-center text-red-400 mb-6">
          Error loading mood entries.
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Mood History Strip */}
          <MoodHistoryStrip
            entries={entries || []}
            onEntryClick={(entry) => setSelectedEntry(entry)}
          />

          {/* Today's Entry OR first-time log form */}
          {!showLogForm && (
            todayEntry ? (
              <div className="space-y-6 mb-6">
                <div className={`pastel-card p-5 border-l-4 ${accentClasses.border} dark:border-purple-800 animate-fade-in`}>
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Today&apos;s Entry</h2>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{getMoodEmoji(todayEntry.mood)}</span>
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200">{getMoodLabel(todayEntry.mood)}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">😴 {todayEntry.sleep_hours} hours sleep</p>
                    </div>
                  </div>

                  {Array.isArray(todayEntry.feelings) && todayEntry.feelings.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {todayEntry.feelings.map((fId) => {
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
                  )}

                  {todayEntry.reflection && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700/50 pt-2 mt-2">
                      ✏️ &ldquo;{todayEntry.reflection}&rdquo;
                    </p>
                  )}

                  {quoteForToday && (
                    <div className={`mt-3 p-3 ${accentClasses.bg} dark:bg-purple-900/20 rounded-xl text-sm text-gray-600 dark:text-gray-400`}>
                      💬 &ldquo;{quoteForToday.quote}&rdquo;
                    </div>
                  )}
                </div>

                <SelfCareSuggestions mood={todayEntry.mood} />
              </div>
            ) : (
              <MoodLogForm />
            )
          )}

          {/* Calendar */}
          <div className="mb-6">
            <MoodCalendar entries={entries || []} />
          </div>

          {/* Search */}
          <ReflectionSearch onEntryClick={(entry) => setSelectedEntry(entry)} />

          {/* Stats and Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <WeeklySummary entries={entries || []} />
            <BadgesList entries={entries || []} />
            <AveragesComparison entries={entries || []} />
            <div className="md:col-span-1">
              <MoodDistribution entries={entries || []} />
            </div>
            <div className="md:col-span-2">
              <MoodTrends entries={entries || []} />
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Strip/Calendar */}
      {selectedEntry && (
        <MoodDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </div>
  );
};
