import { locationService } from '@/lib/api/services/location.service';
import { queryKey } from '@/lib/queryKey';
import { useQuery } from '@tanstack/react-query';
import { defaultQueryOptions } from '../utils';

/**
 * Hook to get all locations (infinite query)
 */
export const useLocations = (params?: { pageSize?: number }) => {
    const pageSize = params?.pageSize || 10;

    return useQuery({
        queryKey: queryKey.locations.list(),
        queryFn: () => locationService.getAll(),
        ...defaultQueryOptions,
    });
};
