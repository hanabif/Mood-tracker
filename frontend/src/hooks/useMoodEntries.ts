import { useQuery } from '@tanstack/react-query';
import { MoodEntry } from '../types';
import { api } from '../services/api';

const fetchMoodEntries = async (userId: number | undefined): Promise<MoodEntry[]> => {
    if (!userId) {
        return [];
    }
  return await api.get(`/mood-entries/?user_id=${userId}`);
};

export const useMoodEntries = (userId: number | undefined) => {
  return useQuery<MoodEntry[], Error>({
    queryKey: ['moodEntries', userId],
    queryFn: () => fetchMoodEntries(userId),
    enabled: !!userId,
  });
};
