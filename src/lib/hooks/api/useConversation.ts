import {
    useQuery,
    useMutation,
    useInfiniteQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { conversationService } from '@/lib/api/services/conversation.service';
import { queryKey } from '@/lib/queryKey';
import type {
    CreateConversationDto,
    UpdateConversationDto,
    ConversationQueryParams,
    AddParticipantDto,
    PinMessageDto,
} from '@/lib/api/services/conversation.service';
import {
    createGetNextPageParam,
    handleApiError,
    showSuccessToast,
    defaultQueryOptions,
    defaultInfiniteQueryOptions,
} from '../utils';

/**
 * Hook to get all conversations (infinite query)
 */
export const useConversations = (
    params?: ConversationQueryParams,
    options?: { enabled?: boolean }
) => {
    const pageSize = params?.page_size || 10;

    return useInfiniteQuery({
        queryKey: queryKey.conversations.userId(params?.user_id),
        queryFn: ({ pageParam = 1 }) =>
            conversationService.getAll({
                ...params,
                page: pageParam,
            }),
        getNextPageParam: createGetNextPageParam(pageSize),
        enabled: options?.enabled !== false,
        initialPageParam: 1,
        ...defaultInfiniteQueryOptions,
    });
};

/**
 * Hook to get a conversation by ID
 */
export const useConversation = (
    conversationId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: queryKey.conversations.id(conversationId),
        queryFn: () => conversationService.getById(conversationId),
        enabled: options?.enabled !== false && !!conversationId,
        ...defaultQueryOptions,
    });
};

/**
 * Hook to create a conversation
 */
export const useCreateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateConversationDto) =>
            conversationService.create(data),
        onSuccess: (data) => {
            // Invalidate conversations list
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.list(undefined),
            });
            // Update cache
            queryClient.setQueryData(queryKey.conversations.id(data._id), data);
            showSuccessToast('Tạo cuộc trò chuyện thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể tạo cuộc trò chuyện');
        },
    });
};

/**
 * Hook to update a conversation
 */
export const useUpdateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateConversationDto;
        }) => conversationService.update(id, data),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(
                queryKey.conversations.id(variables.id),
                data
            );
            // Invalidate list
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.list(undefined),
            });
            showSuccessToast('Cập nhật cuộc trò chuyện thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể cập nhật cuộc trò chuyện');
        },
    });
};

/**
 * Hook to delete a conversation
 */
export const useDeleteConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (conversationId: string) =>
            conversationService.delete(conversationId),
        onSuccess: (_, conversationId) => {
            // Remove from cache
            queryClient.removeQueries({
                queryKey: queryKey.conversations.id(conversationId),
            });
            // Invalidate list
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.list(undefined),
            });
            showSuccessToast('Xóa cuộc trò chuyện thành công');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể xóa cuộc trò chuyện');
        },
    });
};

/**
 * Hook to add participant to conversation
 */
export const useAddParticipant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: AddParticipantDto }) =>
            conversationService.addParticipant(id, data),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(
                queryKey.conversations.id(variables.id),
                data
            );
            showSuccessToast('Đã thêm thành viên');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể thêm thành viên');
        },
    });
};

/**
 * Hook to remove participant from conversation
 */
export const useRemoveParticipant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            participantId,
        }: {
            id: string;
            participantId: string;
        }) => conversationService.removeParticipant(id, participantId),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(
                queryKey.conversations.id(variables.id),
                data
            );
            showSuccessToast('Đã xóa thành viên');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể xóa thành viên');
        },
    });
};

/**
 * Hook to pin a message in conversation
 */
export const usePinMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: PinMessageDto }) =>
            conversationService.pinMessage(id, data),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(
                queryKey.conversations.id(variables.id),
                data
            );
            // Invalidate pinned messages
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.pinnedMessages(variables.id),
            });
            showSuccessToast('Đã ghim tin nhắn');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể ghim tin nhắn');
        },
    });
};

/**
 * Hook to unpin a message in conversation
 */
export const useUnpinMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, messageId }: { id: string; messageId: string }) =>
            conversationService.unpinMessage(id, messageId),
        onSuccess: (data, variables) => {
            // Update cache
            queryClient.setQueryData(
                queryKey.conversations.id(variables.id),
                data
            );
            // Invalidate pinned messages
            queryClient.invalidateQueries({
                queryKey: queryKey.messages.pinnedMessages(variables.id),
            });
            showSuccessToast('Đã bỏ ghim tin nhắn');
        },
        onError: (error) => {
            handleApiError(error, 'Không thể bỏ ghim tin nhắn');
        },
    });
};
