import { MoodEntry } from '../types';

export const getTodayEntry = (entries: MoodEntry[] | undefined) => {
  if (!entries) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return entries.find((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
};
