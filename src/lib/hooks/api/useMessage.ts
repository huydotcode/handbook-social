import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { messageService } from '@/lib/api/services/message.service';
import { queryKey } from '@/lib/queryKey';

export interface MessageQueryParams {
    page?: number;
    page_size?: number;
}

/**
 * Hook to get messages by conversation (infinite query)
 */
export const useMessages = (
    conversationId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.messages.conversationId(conversationId),
        queryFn: ({ pageParam = 1 }) =>
            messageService.getByConversation(conversationId, {
                page: pageParam,
                page_size: params?.pageSize || 20,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && !!conversationId,
        initialPageParam: 1,
    });
};

/**
 * Hook to get pinned messages by conversation (infinite query)
 */
export const usePinnedMessages = (
    conversationId: string,
    params?: { pageSize?: number },
    options?: { enabled?: boolean }
) => {
    return useInfiniteQuery({
        queryKey: queryKey.messages.pinnedMessages(conversationId),
        queryFn: ({ pageParam = 1 }) =>
            messageService.getPinned(conversationId, {
                page: pageParam,
                page_size: params?.pageSize || 20,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.meta?.hasNext) {
                return allPages.length + 1;
            }
            return undefined;
        },
        enabled: options?.enabled !== false && !!conversationId,
        initialPageParam: 1,
    });
};

/**
 * Hook to search messages in conversation
 */
export const useSearchMessages = (
    conversationId: string,
    keyword: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ['messages', 'search', conversationId, keyword],
        queryFn: () => messageService.search(conversationId, { q: keyword }),
        enabled:
            options?.enabled !== false &&
            !!conversationId &&
            keyword.trim().length > 0,
    });
};
