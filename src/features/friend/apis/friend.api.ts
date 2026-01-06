import { IFriend } from '@/types/entites';
import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { FriendsWithConversationsResponse } from '../types/friend.types';

export const friendApi = {
    /**
     * Get friends of a user via friendship API
     */
    getFriends: (userId: string) => {
        return apiClient.get<any[]>(API_ENDPOINTS.FRIENDSHIPS.BY_USER(userId));
    },

    /**
     * Get friends count
     */
    getFriendsCount: (userId: string) => {
        return apiClient.get<{ count: number }>(
            API_ENDPOINTS.FRIENDSHIPS.COUNT(userId)
        );
    },

    /**
     * Check if current user is friends with target user
     */
    checkFriendship: (userId: string) => {
        return apiClient.get<{ areFriends: boolean }>(
            API_ENDPOINTS.FRIENDSHIPS.CHECK(userId)
        );
    },

    /**
     * Find common friends between two users
     */
    getCommonFriends: (userId1: string, userId2: string) => {
        return apiClient.get<{ commonFriends: string[] }>(
            API_ENDPOINTS.FRIENDSHIPS.COMMON(userId1, userId2)
        );
    },

    /**
     * Add friend (accepts when a friend request exists)
     */
    addFriend: (userId2: string) => {
        return apiClient.post(API_ENDPOINTS.FRIENDSHIPS.CREATE, { userId2 });
    },

    /**
     * Remove friendship
     */
    removeFriend: (userId: string) => {
        return apiClient.delete<{ success: boolean }>(
            API_ENDPOINTS.FRIENDSHIPS.REMOVE(userId)
        );
    },

    /**
     * Get friends with their conversations
     */
    getFriendsWithConversations: (userId: string) => {
        return apiClient.get<FriendsWithConversationsResponse>(
            `/users/${userId}/friends-with-conversations`
        );
    },
};
