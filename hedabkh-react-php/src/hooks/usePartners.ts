import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: () => publicApi.getPartners(),
    staleTime: 1000 * 60 * 5,
  });
}
