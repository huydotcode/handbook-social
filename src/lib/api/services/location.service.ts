import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface LocationQueryParams {
    page?: number;
    page_size?: number;
}

export const locationService = {
    /**
     * Get all locations
     */
    getAll: (params?: LocationQueryParams) => {
        return apiClient.get<ILocation[]>(API_ENDPOINTS.LOCATIONS.LIST, {
            params,
        });
    },
};
