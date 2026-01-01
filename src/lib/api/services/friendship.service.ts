import { IFriend } from '@/types/entites';
import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';

// Helper to normalize friendship record to IFriend
const mapFriendshipToFriend = (
    record: any,
    currentUserId: string
): IFriend | null => {
    if (!record) return null;
    const friend =
        record.user1?._id === currentUserId ? record.user2 : record.user1;
    if (!friend) return null;

    return {
        _id: friend._id,
        name: friend.name,
        username: friend.username,
        avatar: friend.avatar,
        isOnline: !!friend.isOnline,
        lastAccessed: friend.lastAccessed,
    };
};

export const friendshipService = {
    /**
     * Get friends of a user via friendship API
     */
    async getFriends(userId: string): Promise<IFriend[]> {
        const res = await apiClient.get<any[]>(
            API_ENDPOINTS.FRIENDSHIPS.BY_USER(userId)
        );
        return (res || [])
            .map((f) => mapFriendshipToFriend(f, userId))
            .filter((f): f is IFriend => !!f);
    },

    /**
     * Get friends count
     */
    async getFriendsCount(userId: string): Promise<number> {
        const res = await apiClient.get<{ count: number }>(
            API_ENDPOINTS.FRIENDSHIPS.COUNT(userId)
        );
        return res?.count ?? 0;
    },

    /**
     * Check if current user is friends with target user
     */
    async checkFriendship(userId: string): Promise<boolean> {
        const res = await apiClient.get<{ areFriends: boolean }>(
            API_ENDPOINTS.FRIENDSHIPS.CHECK(userId)
        );
        return !!res?.areFriends;
    },

    /**
     * Find common friends between two users
     */
    async getCommonFriends(
        userId1: string,
        userId2: string
    ): Promise<string[]> {
        const res = await apiClient.get<{ commonFriends: string[] }>(
            API_ENDPOINTS.FRIENDSHIPS.COMMON(userId1, userId2)
        );
        return res?.commonFriends ?? [];
    },

    /**
     * Add friend (accepts when a friend request exists)
     */
    async addFriend(userId2: string) {
        return apiClient.post(API_ENDPOINTS.FRIENDSHIPS.CREATE, { userId2 });
    },

    /**
     * Remove friendship
     */
    async removeFriend(userId: string) {
        return apiClient.delete<{ success: boolean }>(
            API_ENDPOINTS.FRIENDSHIPS.REMOVE(userId)
        );
    },
};
