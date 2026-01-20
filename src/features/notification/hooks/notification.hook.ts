import {
    createGetNextPageParam,
    defaultInfiniteQueryOptions,
} from '@/lib/react-query';
import { queryKey } from '@/lib/react-query/query-key';
import { useInfiniteQuery } from '@tanstack/react-query';
import { notificationApi } from '../apis/notification.api';

/**
 * Hook to get notifications by receiver (infinite query)
 */
export const useNotificationsByReceiver = (
    receiverId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.user.notifications(receiverId),
        queryFn: ({ pageParam = 1 }) =>
            notificationApi.getByReceiver(receiverId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!receiverId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

/**
 * Hook to get requests by sender (infinite query)
 */
export const useRequestsBySender = (
    senderId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    const pageSize = params?.pageSize || 10;

    return useInfiniteQuery({
        queryKey: queryKey.user.requests(senderId),
        queryFn: ({ pageParam = 1 }) =>
            notificationApi.getBySender(senderId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!senderId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

export const useNotifications = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.user.notifications(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const params = {
                page: pageParam,
                page_size: 10,
            };
            return notificationApi.getByReceiver(userId, params);
        },
        select: (data) => {
            return data.pages.flatMap((page) => page);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            return firstPage.length === 10 ? 1 : undefined;
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

export const useRequests = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.user.requests(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const params = {
                page: pageParam,
                page_size: 10,
            };
            return notificationApi.getBySender(userId, params);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            return firstPage.length === 10 ? 1 : undefined;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page);
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
