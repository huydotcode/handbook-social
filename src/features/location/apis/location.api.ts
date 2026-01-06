import { ILocation } from '@/types/entites';
import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';

export const locationApi = {
    /**
     * Get all locations
     */
    getAll: () => {
        return apiClient.get<ILocation[]>(API_ENDPOINTS.LOCATIONS.LIST);
    },
};
