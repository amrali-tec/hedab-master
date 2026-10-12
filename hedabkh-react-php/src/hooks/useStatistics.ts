import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useStatistics(locale: 'ar' | 'en' = 'ar') {
  return useQuery({
    queryKey: ['statistics', locale],
    queryFn: () => publicApi.getStatistics(locale),
    staleTime: 1000 * 60 * 5,
  });
}
