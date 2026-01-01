import { IFollows } from '@/types/entites';
import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';

export const followService = {
    /**
     * Get followings of a user
     */
    getFollowings: (userId: string) => {
        return apiClient.get<IFollows[]>(
            API_ENDPOINTS.FOLLOWS.FOLLOWINGS(userId)
        );
    },

    /**
     * Follow a user
     */
    follow: (followingId: string) => {
        return apiClient.post<IFollows>(API_ENDPOINTS.FOLLOWS.FOLLOW, {
            following: followingId,
        });
    },

    /**
     * Unfollow a user
     */
    unfollow: (userId: string) => {
        return apiClient.delete<{ success: boolean }>(
            API_ENDPOINTS.FOLLOWS.UNFOLLOW(userId)
        );
    },
};
