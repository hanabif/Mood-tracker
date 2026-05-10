export interface User {
  id: number;
  username: string;
  name: string;
  avatar: string | null;
}

export type { MoodEntry, MoodEntryCreate } from './mood';

export interface Quote {
  mood: number;
  quote: string;
}
