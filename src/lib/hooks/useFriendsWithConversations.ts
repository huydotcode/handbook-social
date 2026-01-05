import {
    friendService,
    FriendsWithConversationsResponse,
} from '@/lib/services/friend.service';
import { useQuery } from '@tanstack/react-query';

export function useFriendsWithConversations(userId?: string) {
    return useQuery<FriendsWithConversationsResponse>({
        queryKey: ['friends-with-conversations', userId],
        queryFn: async () => {
            if (!userId) throw new Error('User ID is required');
            const response =
                await friendService.getFriendsWithConversations(userId);
            return response;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
