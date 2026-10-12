import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * Custom Hook: useTeam
 * Fetches the corporate team profiles list based on the current locale.
 * Uses TanStack Query for caching, automatic re-fetching, and loading states.
 * 
 * @param locale Current language locale ('ar' | 'en')
 */
export function useTeam(locale: 'ar' | 'en') {
  return useQuery({
    queryKey: ['team', locale],
    queryFn: () => api.getTeam(locale),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
}
