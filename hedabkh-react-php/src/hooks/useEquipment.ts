import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/publicApi';

export function useEquipment() {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: () => publicApi.getEquipmentFleet(),
    staleTime: 1000 * 60 * 5,
  });
}
