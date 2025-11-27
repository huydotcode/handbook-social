import { useInfiniteQuery } from '@tanstack/react-query';
import { itemService } from '@/lib/api/services/item.service';
import type { ItemSearchParams } from '@/lib/api/services/item.service';
import { queryKey } from '@/lib/queryKey';
import {
    createGetNextPageParam,
    defaultInfiniteQueryOptions,
} from '../utils';

/**
 * Hook to get all items (infinite query)
 */
export const useItems = (params?: { pageSize?: number }) => {
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.items.list({ pageSize }),
        queryFn: ({ pageParam = 1 }) =>
            itemService.getAll({
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

/**
 * Hook to search items (infinite query)
 */
export const useSearchItems = (
    searchParams: ItemSearchParams,
    options?: { enabled?: boolean }
) => {
    const pageSize = searchParams.page_size || 10;

    return useInfiniteQuery({
        queryKey: queryKey.items.search(searchParams.q),
        queryFn: ({ pageParam = 1 }) =>
            itemService.search({
                ...searchParams,
                page: pageParam,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && searchParams.q.trim().length > 0,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
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
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.items.bySeller(sellerId),
        queryFn: ({ pageParam = 1 }) =>
            itemService.getBySeller(sellerId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!sellerId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};
