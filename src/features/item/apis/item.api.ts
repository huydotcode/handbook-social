import { IItem } from '@/types/entites';
import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { ItemQueryParams, ItemSearchParams } from '../types/item.types';

export const itemApi = {
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

    /**
     * Get item by ID
     */
    getById: (id: string) => {
        return apiClient.get<IItem>(API_ENDPOINTS.ITEMS.BY_ID(id));
    },

    /**
     * Create a new item
     */
    create: (data: any) => {
        return apiClient.post<IItem>(API_ENDPOINTS.ITEMS.CREATE, data);
    },

    /**
     * Update an item
     */
    update: (id: string, data: any) => {
        return apiClient.put<IItem>(API_ENDPOINTS.ITEMS.BY_ID(id), data);
    },

    /**
     * Delete an item
     */
    delete: (id: string) => {
        return apiClient.delete<void>(API_ENDPOINTS.ITEMS.BY_ID(id));
    },
};
