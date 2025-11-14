import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export const followService = {
    /**
     * Get followings of a user
     */
    getFollowings: (userId: string) => {
        return apiClient.get<IFollow[]>(
            API_ENDPOINTS.FOLLOWS.FOLLOWINGS(userId)
        );
    },
};
