export interface User {
  id: number;
  username: string;
  name: string;
  avatar: string | null;
}

export interface MoodEntry {
  id: number;
  user: number;
  date: string;
  mood: number;
  feelings: string[];          // array of feeling IDs e.g. ['happy', 'calm']
  reflection?: string;
  sleep_hours: number;
  created_at: string;
}

export type MoodEntryCreate = Omit<MoodEntry, 'id' | 'user' | 'created_at' | 'date'>;

export interface Quote {
  mood: number;
  quote: string;
}
