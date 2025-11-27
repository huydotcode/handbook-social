import { useInfiniteQuery } from '@tanstack/react-query';
import { locationService } from '@/lib/api/services/location.service';
import { queryKey } from '@/lib/queryKey';
import { createGetNextPageParam, defaultInfiniteQueryOptions } from '../utils';

/**
 * Hook to get all locations (infinite query)
 */
export const useLocations = (params?: { pageSize?: number }) => {
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.locations.list(),
        queryFn: ({ pageParam = 1 }) =>
            locationService.getAll({
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};
