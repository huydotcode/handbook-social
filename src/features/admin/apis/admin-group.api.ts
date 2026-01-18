import { apiClient } from '@/core/api/api-client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { IGroup } from '@/types/entites';
import { AdminQueryParams } from '../types/admin.types';

export const groupAdminApi = {
    /**
     * Get all groups (Admin)
     */
    getGroups: (params?: AdminQueryParams) => {
        return apiClient.get<IGroup[]>(API_ENDPOINTS.ADMIN.GROUPS, { params });
    },
};
