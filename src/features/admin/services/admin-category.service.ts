import { categoryAdminApi } from '../apis/admin-category.api';
import { AdminQueryParams } from '../types/admin.types';

class AdminCategoryServiceClass {
    /**
     * Get all categories (Admin)
     */
    async getCategories(params?: AdminQueryParams) {
        return categoryAdminApi.getCategories(params);
    }
}

export const AdminCategoryService = new AdminCategoryServiceClass();
