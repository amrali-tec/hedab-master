import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useServices(locale: 'ar' | 'en' = 'ar') {
  return useQuery({
    queryKey: ['services', locale],
    queryFn: () => publicApi.getServices(locale),
    staleTime: 1000 * 60 * 5,
  });
}
