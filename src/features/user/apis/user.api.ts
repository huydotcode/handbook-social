import { apiClient } from '@/core/api/api-client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { IUser, IProfile, IMedia } from '@/types/entites';
import type {
    IGetUserProfileResponse,
    UpdateBioDto,
    UpdateAvatarDto,
    UpdateCoverPhotoDto,
    UpdateProfileDto,
    UserQueryParams,
} from '../types/user.types';
import { friendshipService } from '@/lib/api';

export const userApi = {
    /** Get all users */
    getAll: (params?: UserQueryParams) => {
        return apiClient.get<IUser[]>(API_ENDPOINTS.USERS.LIST, { params });
    },

    /** Get user profile */
    getProfile: (userId: string) => {
        return apiClient.get<IGetUserProfileResponse>(
            API_ENDPOINTS.USERS.PROFILE(userId)
        );
    },

    /** Update user profile */
    updateProfile: (userId: string, data: UpdateProfileDto) => {
        return apiClient.put<IProfile>(
            API_ENDPOINTS.USERS.PROFILE(userId),
            data
        );
    },

    /** Update user bio */
    updateBio: (userId: string, data: UpdateBioDto) => {
        return apiClient.put<{ success: boolean }>(
            API_ENDPOINTS.USERS.BIO(userId),
            data
        );
    },

    /** Get profile pictures */
    getProfilePictures: (userId: string) => {
        return apiClient.get<IMedia[]>(API_ENDPOINTS.USERS.PICTURES(userId));
    },

    /** Update avatar */
    updateAvatar: (userId: string, data: UpdateAvatarDto) => {
        return apiClient.put<{ success: boolean }>(
            API_ENDPOINTS.USERS.AVATAR(userId),
            data
        );
    },

    /** Update cover photo */
    updateCoverPhoto: (userId: string, data: UpdateCoverPhotoDto) => {
        return apiClient.put<{ success: boolean }>(
            API_ENDPOINTS.USERS.COVER_PHOTO(userId),
            data
        );
    },

    /** Deprecated: use friendshipService.getFriends */
    getFriends: async (userId: string) => {
        return friendshipService.getFriends(userId);
    },

    /** Deprecated: use friendshipService.removeFriend */
    unfriend: async (friendId: string) => {
        return friendshipService.removeFriend(friendId);
    },
};
