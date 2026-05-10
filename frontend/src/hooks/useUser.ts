import { useQuery } from '@tanstack/react-query';
import { User } from '../types';
import { api } from '../services/api';

const fetchUser = async (): Promise<User> => {
  return await api.get('/auth/user/');
};

export const useUser = () => {
  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
};
