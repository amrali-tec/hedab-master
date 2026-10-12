import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useProjects(locale: 'ar' | 'en' = 'ar') {
  return useQuery({
    queryKey: ['projects', locale],
    queryFn: () => publicApi.getProjects(locale),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
