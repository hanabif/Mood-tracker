import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMoodEntries } from '../hooks/useMoodEntries';
import { MoodLogForm } from '../components/MoodLogForm';
import { MoodTrends } from '../components/MoodTrends';
import { AveragesComparison } from '../components/AveragesComparison';
import { MoodCalendar } from '../components/MoodCalendar';
import { WeeklySummary } from '../components/WeeklySummary';
import { MoodHistoryStrip } from '../components/MoodHistoryStrip';
import { MoodDistribution } from '../components/MoodDistribution';
import { MoodDetailModal } from '../components/MoodDetailModal';
import { BadgesList } from '../components/BadgesList';
import { DashboardContentSkeleton } from '../components/DashboardSkeleton';
import { MoodEntry } from '../types';
import { getTodayEntry } from '../utils/getTodayEntry';
import { getFeelingLabel, getMoodEmoji, getMoodLabel, getMoodPastelClasses, calculateStreak } from '../utils/moodUtils';

const pageInfo = {
  home: { title: 'Your mood dashboard', description: 'A small check-in can help you notice what you need today.' },
  calendar: { title: 'Mood calendar', description: 'Explore your check-ins month by month.' },
  insights: { title: 'Weekly insights', description: 'A closer look at your recent routines and progress.' },
  trends: { title: 'Mood & sleep trends', description: 'See how your mood and sleep change over time.' },
} as const;

type DashboardSection = keyof typeof pageInfo;

export const Dashboard = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { data: entries, isLoading, isError, refetch } = useMoodEntries(user?.id);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  const section: DashboardSection = pathname === '/dashboard/calendar'
    ? 'calendar'
    : pathname === '/dashboard/insights'
      ? 'insights'
      : pathname === '/dashboard/trends'
        ? 'trends'
        : 'home';
  const page = pageInfo[section];
  const entryList = entries ?? [];
  const todayEntry = useMemo(() => getTodayEntry(entryList), [entryList]);
  const streak = useMemo(() => calculateStreak(entryList), [entryList]);
  const accentClasses = todayEntry
    ? getMoodPastelClasses(todayEntry.mood)
    : { bg: 'bg-pastel-lavender', border: 'border-pastel-lavender-dark' };

  const handleLogMoodClick = () => {
    if (todayEntry) setShowConfirm(true);
    else setShowLogForm((current) => !current);
  };

  if (isLoading) return <DashboardContentSkeleton variant={section} />;

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <div className="pastel-card p-8">
          <span className="text-4xl">🌧️</span>
          <h1 className="mt-3 text-xl font-bold text-gray-700 dark:text-gray-200">We couldn&apos;t load your mood data</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">The request may still be waking up. Try again in a moment.</p>
          <button onClick={() => void refetch()} className="mt-5 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-fade-in">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-purple-500 dark:text-purple-300">MoodTracker</p>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl">{page.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{page.description}</p>
        </div>
        {section === 'home' && (
          <div className="flex items-center gap-3">
            {streak > 0 && <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">🔥 {streak} day streak</span>}
            <button
              onClick={handleLogMoodClick}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-purple-800 dark:bg-purple-900/20 dark:text-gray-100 ${accentClasses.bg} ${accentClasses.border}`}
            >
              ✨ {todayEntry ? 'Update today’s mood' : showLogForm ? 'Close mood form' : 'Log today’s mood'}
            </button>
          </div>
        )}
      </header>

      {section === 'home' && (
        <div className="space-y-4">
          <div>
            {entryList.length > 0 ? (
              <MoodHistoryStrip entries={entryList} onEntryClick={setSelectedEntry} />
            ) : (
              <div className="pastel-card flex min-h-24 items-center justify-between gap-4 p-4">
                <div><h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Your last 7 records</h2><p className="mt-1 text-sm text-gray-500">Your recent check-ins will appear here.</p></div>
                <span className="text-2xl">📝</span>
              </div>
            )}
          </div>

          {showLogForm && (
            <div className="animate-fade-in">
              <MoodLogForm onSuccess={() => setShowLogForm(false)} />
            </div>
          )}

          <section className="pastel-card overflow-hidden p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Today&apos;s entry</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500">A moment to check in with yourself</p>
              </div>
              {todayEntry && <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Logged today</span>}
            </div>

            {todayEntry ? (
              <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start">
                <div className={`flex items-center gap-3 rounded-2xl border-l-4 p-4 ${accentClasses.bg} ${accentClasses.border} dark:bg-purple-900/20`}>
                  <span className="text-4xl">{getMoodEmoji(todayEntry.mood)}</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{getMoodLabel(todayEntry.mood)}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">😴 {todayEntry.sleep_hours} hours of sleep</p>
                  </div>
                  {Array.isArray(todayEntry.feelings) && todayEntry.feelings.length > 0 && (
                    <div className="ml-auto flex max-w-[55%] flex-wrap justify-end gap-1.5">
                      {todayEntry.feelings.map((feeling) => {
                        const item = getFeelingLabel(feeling);
                        return <span key={feeling} className="rounded-full border border-white/80 bg-white/60 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">{item.emoji} {item.label}</span>;
                      })}
                    </div>
                  )}
                </div>
                <div className="min-h-24 rounded-2xl bg-white/50 p-4 dark:bg-gray-800/40">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Your note</p>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{todayEntry.reflection ? `“${todayEntry.reflection}”` : 'No note added to today’s entry.'}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-purple-50/70 p-4 dark:bg-purple-900/15 sm:flex-row sm:items-center">
                <div><p className="font-medium text-gray-700 dark:text-gray-200">No mood logged today yet</p><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Take a minute to record how you&apos;re feeling.</p></div>
                <button onClick={() => setShowLogForm(true)} className="shrink-0 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">Start check-in</button>
              </div>
            )}
          </section>
        </div>
      )}

      {section === 'calendar' && <MoodCalendar entries={entryList} />}

      {section === 'insights' && (
        <div className="grid auto-rows-min gap-4 xl:grid-cols-2">
          <WeeklySummary entries={entryList} />
          <BadgesList entries={entryList} />
          <AveragesComparison entries={entryList} />
          <MoodDistribution entries={entryList} />
        </div>
      )}

      {section === 'trends' && <MoodTrends entries={entryList} />}

      <div className="mt-6 border-t border-gray-200/70 pt-4 text-xs text-gray-400 dark:border-gray-700/60 dark:text-gray-500">
        Need a full record of your check-ins? <Link to="/history" className="font-medium text-purple-600 hover:underline dark:text-purple-300">Open mood history</Link>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
          <div className="pastel-card w-full max-w-sm p-6" onClick={(event) => event.stopPropagation()}>
            <div className="text-center">
              <span className="text-4xl">🔄</span>
              <h2 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">Update today&apos;s entry?</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your new check-in will replace today&apos;s mood and note.</p>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={() => { setShowConfirm(false); setShowLogForm(true); }} className="flex-1 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">Update mood</button>
            </div>
          </div>
        </div>
      )}

      {selectedEntry && <MoodDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
    </div>
  );
};
