import { useQuery } from '@tanstack/react-query';
import { conversationMemberService } from '../api/services/conversation-member.service';
import { queryKey } from '../queryKey';

export function useConversationMembers(conversationId: string | undefined) {
    const enabled = Boolean(conversationId);

    const query = useQuery({
        queryKey: queryKey.conversations.members(conversationId!),
        queryFn: () => conversationMemberService.list(conversationId!),
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
