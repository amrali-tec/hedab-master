import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * useCertificates Hook
 * Dynamically queries company credentials and ISO certificates.
 */
export function useCertificates(locale: 'ar' | 'en') {
  return useQuery({
    queryKey: ['certificates', locale],
    queryFn: () => api.getCertificates(locale),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}
