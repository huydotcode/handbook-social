import { useInfiniteQuery } from '@tanstack/react-query';
import { notificationService } from '@/lib/api/services/notification.service';
import { queryKey } from '@/lib/queryKey';

export interface NotificationQueryParams {
    page?: number;
    page_size?: number;
}

/**
 * Hook to get notifications by receiver (infinite query)
 */
export const useNotificationsByReceiver = (
    receiverId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.user.notifications(receiverId),
        queryFn: ({ pageParam = 1 }) =>
            notificationService.getByReceiver(receiverId, {
                page: pageParam,
                page_size: params?.pageSize || 10,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && !!receiverId,
        initialPageParam: 1,
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
    return useInfiniteQuery({
        queryKey: queryKey.user.requests(senderId),
        queryFn: ({ pageParam = 1 }) =>
            notificationService.getBySender(senderId, {
                page: pageParam,
                page_size: params?.pageSize || 10,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && !!senderId,
        initialPageParam: 1,
    });
};
