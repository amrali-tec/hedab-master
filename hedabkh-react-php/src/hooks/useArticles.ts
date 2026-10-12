import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => publicApi.getArticles(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useArticleBySlug(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => publicApi.getArticleBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
