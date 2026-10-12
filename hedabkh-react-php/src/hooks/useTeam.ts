import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useTeam(locale: 'ar' | 'en' = 'ar') {
  return useQuery({
    queryKey: ['team', locale],
    queryFn: () => publicApi.getTeam(locale),
    staleTime: 1000 * 60 * 5,
  });
}
