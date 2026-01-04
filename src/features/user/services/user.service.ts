import { searchService } from '@/lib/api/services/search.service';
import { followService } from '@/lib/api/services/follow.service';
import { friendshipService } from '@/lib/api/services/friendship.service';
import type { IFriend, IUser } from '@/types/entites';
import { userApi } from '../apis/user.api';
import type {
    UpdateAvatarDto,
    UpdateBioDto,
    UpdateCoverPhotoDto,
    UpdateProfileDto,
    UserQueryParams,
} from '../types/user.types';

class UserServiceClass {
    /** Get all users */
    async getAll(params?: UserQueryParams) {
        return userApi.getAll(params);
    }

    /** Search users */
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

            const isNext = Array.isArray(users) && users.length === pageSize;
            return { users: users || [], isNext };
        } catch (error) {
            console.error('Error searching users:', error);
            return { users: [], isNext: false };
        }
    }

    /** Get friends by user ID */
    async getFriendsByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<IFriend[]> {
        try {
            const data = await friendshipService.getFriends(userId);
            return data;
        } catch (error) {
            console.error('Error getting friends:', error);
            return [];
        }
    }

    /** Get user by ID (placeholder until API exists) */
    async getById(id: string): Promise<IUser | null> {
        console.warn('getById not yet implemented via REST API');
        return null;
    }

    /** Get profile through userApi */
    async getProfile(userId: string) {
        return userApi.getProfile(userId);
    }

    /** Update profile */
    async updateProfile(userId: string, data: UpdateProfileDto) {
        return userApi.updateProfile(userId, data);
    }

    /** Update bio */
    async updateBio(userId: string, data: UpdateBioDto) {
        return userApi.updateBio(userId, data);
    }

    /** Get profile pictures */
    async getProfilePictures(userId: string) {
        return userApi.getProfilePictures(userId);
    }

    /** Update avatar */
    async updateAvatar(userId: string, data: UpdateAvatarDto) {
        return userApi.updateAvatar(userId, data);
    }

    /** Update cover photo */
    async updateCoverPhoto(userId: string, data: UpdateCoverPhotoDto) {
        return userApi.updateCoverPhoto(userId, data);
    }

    /** Unfriend a user */
    async unfriend(friendId: string): Promise<boolean> {
        try {
            const result = await friendshipService.removeFriend(friendId);
            return !!result?.success;
        } catch (error) {
            console.error('Error unfriending user:', error);
            throw error;
        }
    }

    /** Follow a user */
    async follow(userId: string): Promise<boolean> {
        try {
            await followService.follow(userId);
            return true;
        } catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    }

    /** Unfollow a user */
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
