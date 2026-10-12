import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * Custom Hook: useProjects
 * Fetches the projects list based on the current locale.
 * Uses TanStack Query for caching, automatic re-fetching, and loading states.
 * 
 * @param locale Current language locale ('ar' | 'en')
 */
export function useProjects(locale: 'ar' | 'en') {
  return useQuery({
    queryKey: ['projects', locale],
    queryFn: () => api.getProjects(locale),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
}
