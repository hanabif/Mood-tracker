export interface MoodEntry {
  id: number;
  user: number;
  date: string;
  mood: number;
  sleep_hours: number;
  reflection?: string;
  feelings: string[];
  created_at: string;
}

export type MoodEntryCreate = Omit<MoodEntry, 'id' | 'user' | 'created_at' | 'date'>;
