import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useTimeline(locale: 'ar' | 'en' = 'ar') {
  return useQuery({
    queryKey: ['timeline', locale],
    queryFn: () => publicApi.getTimeline(locale),
    staleTime: 1000 * 60 * 5,
  });
}
