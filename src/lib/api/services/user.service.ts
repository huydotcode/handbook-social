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
};
