import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../services/contentApi';

export function useCmsPage(pageId: string, locale: 'ar' | 'en' = 'ar') {
  return useQuery({
    queryKey: ['cms-page', pageId, locale],
    queryFn: () => contentApi.getPublishedVersionAsync(pageId, locale),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
