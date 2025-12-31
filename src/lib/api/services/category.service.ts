import { ICategory } from '@/types/entites';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface CreateCategoryDto {
    name: string;
    slug: string;
    description?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
}

export interface CategoryQueryParams {
    page?: number;
    page_size?: number;
}

export interface CategorySearchParams {
    q: string;
    page?: number;
    page_size?: number;
}

export const categoryService = {
    /**
     * Get all categories (paginated)
     */
    getAll: (params?: CategoryQueryParams) => {
        return apiClient.get<ICategory[]>(API_ENDPOINTS.CATEGORIES.LIST, {
            params,
        });
    },

    /**
     * Get all categories (not paginated)
     */
    getAllCategories: () => {
        return apiClient.get<ICategory[]>(API_ENDPOINTS.CATEGORIES.ALL);
    },

    /**
     * Search categories
     */
    search: (params: CategorySearchParams) => {
        return apiClient.get<ICategory[]>(API_ENDPOINTS.CATEGORIES.SEARCH, {
            params,
        });
    },

    /**
     * Get category by slug
     */
    getBySlug: (slug: string) => {
        return apiClient.get<ICategory>(API_ENDPOINTS.CATEGORIES.BY_SLUG(slug));
    },

    /**
     * Get category by ID
     */
    getById: (id: string) => {
        return apiClient.get<ICategory>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    },

    /**
     * Create a new category (Admin only)
     */
    create: (data: CreateCategoryDto) => {
        return apiClient.post<ICategory>(API_ENDPOINTS.CATEGORIES.LIST, data);
    },

    /**
     * Update a category (Admin only)
     */
    update: (id: string, data: UpdateCategoryDto) => {
        return apiClient.put<ICategory>(
            API_ENDPOINTS.CATEGORIES.BY_ID(id),
            data
        );
    },

    /**
     * Delete a category (Admin only)
     */
    delete: (id: string) => {
        return apiClient.delete<void>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    },
};
