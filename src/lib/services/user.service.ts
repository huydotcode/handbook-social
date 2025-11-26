import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { searchService } from '../api/services/search.service';

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
            return await apiClient.get<IFriend[]>(
                API_ENDPOINTS.USERS.FRIENDS(userId)
            );
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
     * TODO: Server API needs POST/DELETE /users/:id/friends endpoint
     */
    async unfriend(userId: string): Promise<boolean> {
        // TODO: Implement unfriend endpoint in server-api
        // POST /users/:id/unfriend or DELETE /users/:id/friends
        console.warn('unfriend not yet implemented via REST API');
        throw new Error('Unfriend endpoint not yet implemented in REST API');
    }

    /**
     * Follow a user
     * TODO: Server API needs POST /follows endpoint
     */
    async follow(userId: string): Promise<boolean> {
        // TODO: Implement follow endpoint in server-api
        // POST /follows with { following: userId }
        console.warn('follow not yet implemented via REST API');
        throw new Error('Follow endpoint not yet implemented in REST API');
    }

    /**
     * Unfollow a user
     * TODO: Server API needs DELETE /follows/:userId endpoint
     */
    async unfollow(userId: string): Promise<boolean> {
        // TODO: Implement unfollow endpoint in server-api
        // DELETE /follows/:userId
        console.warn('unfollow not yet implemented via REST API');
        throw new Error('Unfollow endpoint not yet implemented in REST API');
    }
}

const UserService = new UserServiceClass();
export default UserService;
