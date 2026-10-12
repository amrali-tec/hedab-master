import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useRegions(locale: 'ar' | 'en' = 'ar') {
  return useQuery({
    queryKey: ['regions', locale],
    queryFn: () => publicApi.getRegions(locale),
    staleTime: 1000 * 60 * 5,
  });
}
