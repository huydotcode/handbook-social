import { CategoryService } from '@/features/category';
import { AdminQueryParams } from '../types/admin.types';

export const categoryAdminApi = {
    /**
     * Get all categories (Admin)
     */
    getCategories: (params?: AdminQueryParams) => {
        return CategoryService.getAll(params);
    },
};
