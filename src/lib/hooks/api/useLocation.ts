import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { locationService } from '@/lib/api/services/location.service';
import { queryKey } from '@/lib/queryKey';

/**
 * Hook to get all locations (infinite query)
 */
export const useLocations = (params?: { pageSize?: number }) => {
    return useInfiniteQuery({
        queryKey: queryKey.locations.list(),
        queryFn: ({ pageParam = 1 }) =>
            locationService.getAll({
                page: pageParam,
                page_size: params?.pageSize || 10,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};
