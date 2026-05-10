import { useQuery } from '@tanstack/react-query';
import { Quote } from '../types';

const fetchQuotes = async (): Promise<Quote[]> => {
  const response = await fetch('/src/data/quotes.json');
  if (!response.ok) {
    throw new Error('Failed to fetch quotes');
  }
  return response.json();
};

export const useQuotes = () => {
  return useQuery<Quote[], Error>({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
    staleTime: Infinity, // Cache forever
  });
};
