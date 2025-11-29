import { userService } from '../api';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { searchService } from '../api/services/search.service';
import { followService } from '../api/services/follow.service';

class UserServiceClass {
    /**
     * Search users using REST API
     * TODO: Server API needs to support pagination metadata for isNext
     */
    async searchUsers({
        userId,
        searchString = '',
        pageNumber = 1,
        pageSize = 20,
        sortBy = 'desc',
    }: {
        userId: string;
        searchString?: string;
        pageNumber?: number;
        pageSize?: number;
        sortBy?: 'asc' | 'desc';
    }): Promise<{ users: IUser[]; isNext: boolean }> {
        try {
            const users = await searchService.searchUsers({
                q: searchString,
                page: pageNumber,
                page_size: pageSize,
            });

            // TODO: API should return pagination metadata
            // For now, assume there's more if we got a full page
            const isNext = Array.isArray(users) && users.length === pageSize;

            return { users: users || [], isNext };
        } catch (error) {
            console.error('Error searching users:', error);
            return { users: [], isNext: false };
        }
    }

    /**
     * Get friends by user ID using REST API
     */
    async getFriendsByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<IFriend[]> {
        try {
            const data = await userService.getFriends(userId);
            return data;
        } catch (error) {
            console.error('Error getting friends:', error);
            return [];
        }
    }

    /**
     * Get user by ID
     * TODO: Server API needs GET /users/:id endpoint
     * For now, this is a placeholder that returns null
     */
    async getById(id: string): Promise<IUser | null> {
        // TODO: Implement GET /users/:id endpoint in server-api
        // For now, return null as placeholder
        console.warn('getById not yet implemented via REST API');
        return null;
    }

    /**
     * Unfriend a user
     */
    async unfriend(friendId: string): Promise<boolean> {
        try {
            const result = await userService.unfriend(friendId);
            return result.success;
        } catch (error) {
            console.error('Error unfriending user:', error);
            throw error;
        }
    }

    /**
     * Follow a user
     */
    async follow(userId: string): Promise<boolean> {
        try {
            await followService.follow(userId);
            return true;
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
            const result = await followService.unfollow(userId);
            return result.success;
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    }
}

const UserService = new UserServiceClass();
export default UserService;
