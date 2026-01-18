import { apiClient } from '@/core/api/api-client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { IUser } from '@/types/entites';
import { AdminQueryParams } from '../types/admin.types';

export const userAdminApi = {
    /**
     * Get all users (Admin)
     */
    getUsers: (params?: AdminQueryParams) => {
        return apiClient.get<IUser[]>(API_ENDPOINTS.ADMIN.USERS, { params });
    },

    blockUser: (userId: string) => {
        return apiClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/block`);
    },

    unblockUser: (userId: string) => {
        return apiClient.patch(
            `${API_ENDPOINTS.ADMIN.USERS}/${userId}/unblock`
        );
    },

    updateRole: (userId: string, role: string) => {
        return apiClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/role`, {
            role,
        });
    },

    verifyUser: (userId: string) => {
        return apiClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/verify`);
    },

    unverifyUser: (userId: string) => {
        return apiClient.patch(
            `${API_ENDPOINTS.ADMIN.USERS}/${userId}/unverify`
        );
    },
};
