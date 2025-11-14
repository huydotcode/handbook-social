import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { itemService } from '@/lib/api/services/item.service';
import type {
    ItemQueryParams,
    ItemSearchParams,
} from '@/lib/api/services/item.service';

/**
 * Hook to get all items (infinite query)
 */
export const useItems = (params?: { pageSize?: number }) => {
    return useInfiniteQuery({
        queryKey: ['items', 'list', params],
        queryFn: ({ pageParam = 1 }) =>
            itemService.getAll({
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

/**
 * Hook to search items (infinite query)
 */
export const useSearchItems = (
    searchParams: ItemSearchParams,
    options?: { enabled?: boolean }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.items.search(searchParams.q),
        queryFn: ({ pageParam = 1 }) =>
            itemService.search({
                ...searchParams,
                page: pageParam,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && searchParams.q.trim().length > 0,
        initialPageParam: 1,
    });
};

/**
 * Hook to get items by seller (infinite query)
 */
export const useItemsBySeller = (
    sellerId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.items.bySeller(sellerId),
        queryFn: ({ pageParam = 1 }) =>
            itemService.getBySeller(sellerId, {
                page: pageParam,
                page_size: params?.pageSize || 10,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && !!sellerId,
        initialPageParam: 1,
    });
};
