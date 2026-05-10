export const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Very Sad' },
  { value: 2, emoji: '🙁', label: 'Sad' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
] as const;

export const FEELINGS_OPTIONS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'sad', emoji: '😔', label: 'Sad' },
  { id: 'angry', emoji: '😡', label: 'Angry' },
  { id: 'sick', emoji: '🤒', label: 'Sick' },
  { id: 'bored', emoji: '🥱', label: 'Bored' },
] as const;

export type FeelingsId = typeof FEELINGS_OPTIONS[number]['id'];

export const getMoodEmoji = (mood: number): string => {
  return MOOD_OPTIONS.find(m => m.value === mood)?.emoji ?? '😐';
};

export const getMoodLabel = (mood: number): string => {
  return MOOD_OPTIONS.find(m => m.value === mood)?.label ?? 'Neutral';
};

/** Returns Tailwind bg + border classes for each mood level (pastel palette) */
export const getMoodPastelClasses = (mood: number): { bg: string; border: string; dot: string } => {
  switch (mood) {
    case 5: return { bg: 'bg-pastel-peach', border: 'border-pastel-peach-dark', dot: '#ffd6b0' };
    case 4: return { bg: 'bg-pastel-mint', border: 'border-pastel-mint-dark', dot: '#b0f0d6' };
    case 3: return { bg: 'bg-pastel-gray', border: 'border-pastel-gray-dark', dot: '#d4d4d4' };
    case 2: return { bg: 'bg-pastel-lavender', border: 'border-pastel-lavender-dark', dot: '#d4b0f0' };
    case 1: return { bg: 'bg-pastel-blue', border: 'border-pastel-blue-dark', dot: '#b0d6f0' };
    default: return { bg: 'bg-gray-100', border: 'border-gray-200', dot: '#e5e7eb' };
  }
};

/** Hex colors for each mood level used in charts */
export const MOOD_CHART_COLORS: Record<number, string> = {
  1: '#b0d6f0',
  2: '#d4b0f0',
  3: '#d4d4d4',
  4: '#b0f0d6',
  5: '#ffd6b0',
};

export const getFeelingLabel = (id: string): { emoji: string; label: string } => {
  return FEELINGS_OPTIONS.find(f => f.id === id) ?? { emoji: '❓', label: id };
};

/** Calculates current mood streak in days */
export const calculateStreak = (entries: MoodEntry[]): number => {
  if (entries.length === 0) return 0;

  const sortedDates = [...new Set(entries.map(e => e.date))]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If person hasn't logged today or yesterday, streak is 0
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let curr = new Date(sortedDates[0]);

  for (let i = 0; i < sortedDates.length; i++) {
    const d = sortedDates[i];
    const expected = curr.toISOString().split('T')[0];

    if (d === expected) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/** Finds the most frequent feeling in a list of entries */
export const getMostCommonFeeling = (entries: MoodEntry[]): { id: string; emoji: string; label: string } | null => {
  const counts: Record<string, number> = {};
  entries.forEach(e => {
    if (Array.isArray(e.feelings)) {
      e.feelings.forEach(f => {
        counts[f] = (counts[f] || 0) + 1;
      });
    }
  });

  const topFeelingId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!topFeelingId) return null;

  return getFeelingLabel(topFeelingId);
};
