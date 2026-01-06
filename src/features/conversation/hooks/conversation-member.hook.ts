import queryKey from '@/lib/react-query/query-key';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ConversationMemberService } from '../services/conversation-member.service';
import { ConversationMemberRole } from '../types/conversation.type';

export function useConversationMembers(conversationId: string | undefined) {
    const enabled = Boolean(conversationId);

    const query = useQuery({
        queryKey: queryKey.conversations.members(conversationId!),
        queryFn: () => ConversationMemberService.list(conversationId!),
        enabled,
        staleTime: 30_000,
    });

    return {
        members: query.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useAddMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            userId,
        }: {
            conversationId: string;
            userId: string;
        }) =>
            ConversationMemberService.add(conversationId, {
                userId,
                role: 'member',
            }),
        onSuccess: (_, { conversationId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.members(conversationId),
            });
        },
    });
}

export function useRemoveMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            userId,
        }: {
            conversationId: string;
            userId: string;
        }) => ConversationMemberService.remove(conversationId, userId),
        onSuccess: (_, { conversationId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.members(conversationId),
            });
        },
    });
}

export function useSetMemberRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            userId,
            role,
        }: {
            conversationId: string;
            userId: string;
            role: ConversationMemberRole;
        }) => ConversationMemberService.setRole(conversationId, userId, role),
        onSuccess: (_, { conversationId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKey.conversations.members(conversationId),
            });
        },
    });
}
