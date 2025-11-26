import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface GroupQueryParams {
    user_id?: string;
    page?: number;
    page_size?: number;
}

export const groupService = {
    /**
     * Get joined groups
     */
    getJoined: (params?: GroupQueryParams) => {
        return apiClient.get<IGroup[]>(API_ENDPOINTS.GROUPS.JOINED, { params });
    },

    /**
     * Get group by ID
     */
    getById: (id: string) => {
        return apiClient.get<IGroup>(API_ENDPOINTS.GROUPS.BY_ID(id));
    },
};
