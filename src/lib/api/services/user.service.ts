import { IGetUserProfileResponse } from '@/lib/services';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface UserQueryParams {
    page?: number;
    page_size?: number;
}

export const userService = {
    /**
     * Get all users
     */
    getAll: (params?: UserQueryParams) => {
        return apiClient.get<IUser[]>(API_ENDPOINTS.USERS.LIST, { params });
    },

    /**
     * Get friends of a user
     */
    getFriends: (userId: string, params?: UserQueryParams) => {
        return apiClient.get<IFriend[]>(API_ENDPOINTS.USERS.FRIENDS(userId), {
            params,
        });
    },

    /**
     * Get user profile
     */
    getProfile: (userId: string) => {
        return apiClient.get<IGetUserProfileResponse>(
            API_ENDPOINTS.USERS.PROFILE(userId)
        );
    },

    /**
     * Update user profile
     */
    updateProfile: (userId: string, data: Partial<IProfile>) => {
        return apiClient.put<IProfile>(
            API_ENDPOINTS.USERS.PROFILE(userId),
            data
        );
    },

    /**
     * Update user bio
     */
    updateBio: (userId: string, data: { bio: string }) => {
        return apiClient.put<{ success: boolean }>(
            API_ENDPOINTS.USERS.BIO(userId),
            data
        );
    },

    /**
     * Get profile pictures
     */
    getProfilePictures: (userId: string) => {
        return apiClient.get<IMedia[]>(API_ENDPOINTS.USERS.PICTURES(userId));
    },

    /**
     * Update avatar
     */
    updateAvatar: (userId: string, data: { avatar: string }) => {
        return apiClient.put<{ success: boolean }>(
            API_ENDPOINTS.USERS.AVATAR(userId),
            data
        );
    },

    /**
     * Update cover photo
     */
    updateCoverPhoto: (userId: string, data: { coverPhoto: string }) => {
        return apiClient.put<{ success: boolean }>(
            API_ENDPOINTS.USERS.COVER_PHOTO(userId),
            data
        );
    },

    /**
     * Unfriend a user
     */
    unfriend: (friendId: string) => {
        return apiClient.post<{ success: boolean }>(
            API_ENDPOINTS.USERS.UNFRIEND(friendId)
        );
    },
};
