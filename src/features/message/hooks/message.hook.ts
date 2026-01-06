import { defaultQueryOptions } from '@/lib/react-query';
import { queryKey } from '@/lib/react-query/query-key';
import { IMessage } from '@/types/entites';
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import MessageService from '../services/message.service';

const PAGE_SIZE = 30;

/**
 * Hook to get messages by conversation (infinite query)
 */
export const useMessages = (conversationId: string) => {
    return useInfiniteQuery({
        queryKey: queryKey.messages.conversationId(conversationId),
        queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
            if (!conversationId) return [];

            return MessageService.getByConversation(conversationId, {
                page: pageParam,
                page_size: PAGE_SIZE,
            });
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!conversationId,
        select: (data) => {
            return data.pages.flatMap((page) => page) as IMessage[];
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};
/**
 * Hook to get pinned messages by conversation (infinite query)
 */
export const usePinnedMessages = (conversationId: string) => {
    return useInfiniteQuery({
        queryKey: queryKey.messages.pinnedMessages(conversationId),
        queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
            if (!conversationId) return [];

            return MessageService.getPinned(conversationId, {
                page: pageParam,
                page_size: PAGE_SIZE,
            });
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page) as IMessage[];
        },
        initialPageParam: 1,
        enabled: !!conversationId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
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
        queryFn: () => MessageService.search(conversationId, { q: keyword }),
        enabled:
            options?.enabled !== false &&
            !!conversationId &&
            keyword.trim().length > 0,
        ...defaultQueryOptions,
    });
};

/**
 * Hook to send a message
 */
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            roomId: string;
            text: string;
            images?: string[];
        }) => MessageService.send(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.conversationId(variables.roomId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.id(variables.roomId),
            });
        },
    });
};

/**
 * Hook to delete a message
 */
export const useDeleteMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            messageId: string;
            conversationId: string;
            prevMessageId?: string | null;
        }) => MessageService.delete(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.conversationId(
                    variables.conversationId
                ),
            });
        },
    });
};

/**
 * Hook to mark messages as read
 */
export const useMarkAsRead = () => {
    return useMutation({
        mutationFn: (data: { roomId: string; userId: string }) =>
            MessageService.markAsRead(data.roomId, data.userId),
    });
};
