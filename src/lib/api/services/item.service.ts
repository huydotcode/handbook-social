import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface ItemQueryParams {
    page?: number;
    page_size?: number;
}

export interface ItemSearchParams {
    q: string;
    page?: number;
    page_size?: number;
}

export const itemService = {
    /**
     * Get all items
     */
    getAll: (params?: ItemQueryParams) => {
        return apiClient.get<IItem[]>(API_ENDPOINTS.ITEMS.LIST, { params });
    },

    /**
     * Search items
     */
    search: (params: ItemSearchParams) => {
        return apiClient.get<IItem[]>(API_ENDPOINTS.ITEMS.SEARCH, { params });
    },

    /**
     * Get items by seller
     */
    getBySeller: (sellerId: string, params?: ItemQueryParams) => {
        return apiClient.get<IItem[]>(API_ENDPOINTS.ITEMS.BY_SELLER(sellerId), {
            params,
        });
    },
};
