import { messageService } from '@/lib/api/services/message.service';
import { queryKey } from '@/lib/queryKey';
import {
    createGetNextPageParam,
    defaultInfiniteQueryOptions,
    defaultQueryOptions,
} from '@/lib/react-query';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

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
    const pageSize = params?.pageSize || 20;

    return useInfiniteQuery({
        queryKey: queryKey.messages.conversationId(conversationId),
        queryFn: ({ pageParam = 1 }) =>
            messageService.getByConversation(conversationId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!conversationId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
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
    const pageSize = params?.pageSize || 20;

    return useInfiniteQuery({
        queryKey: queryKey.messages.pinnedMessages(conversationId),
        queryFn: ({ pageParam = 1 }) =>
            messageService.getPinned(conversationId, {
                page: pageParam,
                page_size: pageSize,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false && !!conversationId,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
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
        queryKey: queryKey.messages.search(conversationId, keyword),
        queryFn: () => messageService.search(conversationId, { q: keyword }),
        enabled:
            options?.enabled !== false &&
            !!conversationId &&
            keyword.trim().length > 0,
        ...defaultQueryOptions,
    });
};
