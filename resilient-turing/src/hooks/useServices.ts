import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * Custom Hook: useServices
 * Fetches the services list based on the current locale.
 * Uses TanStack Query for caching, automatic re-fetching, and loading states.
 * 
 * @param locale Current language locale ('ar' | 'en')
 */
export function useServices(locale: 'ar' | 'en') {
  return useQuery({
    queryKey: ['services', locale],
    queryFn: () => api.getServices(locale),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
}
