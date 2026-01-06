import { defaultQueryOptions } from '@/lib/react-query';
import { queryKey } from '@/lib/react-query/query-key';
import { useQuery } from '@tanstack/react-query';
import { LocationService } from '../services/location.service';

/**
 * Hook to get all locations
 */
export const useLocations = (params?: { pageSize?: number }) => {
    return useQuery({
        queryKey: queryKey.locations.list(),
        queryFn: () => LocationService.getAll(),
        ...defaultQueryOptions,
    });
};
