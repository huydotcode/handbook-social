import {
    createGetNextPageParam,
    createSearchGetNextPageParam,
    defaultInfiniteQueryOptions,
} from '@/lib/react-query';
import { queryKey } from '@/lib/react-query/query-key';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchApi, SearchQueryParams } from '../apis/search.api';

/**
 * Hook for general search (users, posts, groups)
 */
export const useSearch = (
    searchParams: SearchQueryParams,
    options?: { enabled?: boolean }
) => {
    const pageSize = searchParams.page_size || 10;

    return useInfiniteQuery({
        queryKey: queryKey.search.general(searchParams.q, undefined),
        queryFn: ({ pageParam = 1 }) =>
            searchApi.search({
                ...searchParams,
                page: pageParam,
            }),
        getNextPageParam: createSearchGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && searchParams.q.trim().length > 0,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

/**
 * Hook to search users
 */
export const useSearchUsers = (
    searchParams: SearchQueryParams,
    options?: { enabled?: boolean }
) => {
    const pageSize = searchParams.page_size || 10;

    return useInfiniteQuery({
        queryKey: queryKey.search.users(searchParams.q),
        queryFn: ({ pageParam = 1 }) =>
            searchApi.searchUsers({
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
 * Hook to search posts
 */
export const useSearchPosts = (
    searchParams: SearchQueryParams,
    options?: { enabled?: boolean }
) => {
    const pageSize = searchParams.page_size || 10;

    return useInfiniteQuery({
        queryKey: queryKey.search.posts(searchParams.q),
        queryFn: ({ pageParam = 1 }) =>
            searchApi.searchPosts({
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
 * Hook to search groups
 */
export const useSearchGroups = (
    searchParams: SearchQueryParams,
    options?: { enabled?: boolean }
) => {
    const pageSize = searchParams.page_size || 10;

    return useInfiniteQuery({
        queryKey: queryKey.search.groups(searchParams.q),
        queryFn: ({ pageParam = 1 }) =>
            searchApi.searchGroups({
                ...searchParams,
                page: pageParam,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && searchParams.q.trim().length > 0,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};
