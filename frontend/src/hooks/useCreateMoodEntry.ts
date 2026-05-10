import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MoodEntry, MoodEntryCreate } from '../types';
import { api } from '../services/api';

const createMoodEntry = async (newEntry: MoodEntryCreate): Promise<MoodEntry> => {
  return await api.post('/mood-entries/', newEntry);
};

export const useCreateMoodEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<MoodEntry, Error, MoodEntryCreate>({
    mutationFn: createMoodEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
    },
  });
};
