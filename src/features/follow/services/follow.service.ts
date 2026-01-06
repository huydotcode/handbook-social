import { IFollows } from '@/types/entites';
import { followApi } from '../apis/follow.api';

class FollowServiceClass {
    /**
     * Get followings of a user
     */
    async getFollowings(userId: string): Promise<IFollows[]> {
        try {
            return await followApi.getFollowings(userId);
        } catch (error) {
            console.error('Error getting followings:', error);
            throw error;
        }
    }

    /**
     * Follow a user
     */
    async follow(followingId: string): Promise<IFollows> {
        try {
            return await followApi.follow(followingId);
        } catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    }

    /**
     * Unfollow a user
     */
    async unfollow(userId: string): Promise<boolean> {
        try {
            const response = await followApi.unfollow(userId);
            return response.success;
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    }
}

export const FollowService = new FollowServiceClass();
