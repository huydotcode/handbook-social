import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export const locationService = {
    /**
     * Get all locations
     */
    getAll: () => {
        return apiClient.get<ILocation[]>(API_ENDPOINTS.LOCATIONS.LIST);
    },
};
