import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * Custom Hook: useStatistics
 * Fetches the portal/KPI statistics based on the current locale.
 * Uses TanStack Query for caching, automatic re-fetching, and loading states.
 * 
 * @param locale Current language locale ('ar' | 'en')
 */
export function useStatistics(locale: 'ar' | 'en') {
  return useQuery({
    queryKey: ['statistics', locale],
    queryFn: () => api.getStatistics(locale),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
}
