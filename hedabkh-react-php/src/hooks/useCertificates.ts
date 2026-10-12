import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useCertificates(locale: 'ar' | 'en' = 'ar') {
  return useQuery({
    queryKey: ['certificates', locale],
    queryFn: () => publicApi.getCertificates(locale),
    staleTime: 1000 * 60 * 5,
  });
}
