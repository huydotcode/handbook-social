import { categoryApi } from '../apis/category.api';
import {
    CategoryQueryParams,
    CategorySearchParams,
    CreateCategoryDto,
    UpdateCategoryDto,
} from '../types/category.types';

class CategoryServiceClass {
    /**
     * Get all categories (paginated)
     */
    public async getAll(params?: CategoryQueryParams) {
        return await categoryApi.getAll(params);
    }

    /**
     * Get all categories (not paginated)
     */
    public async getAllCategories() {
        return await categoryApi.getAllCategories();
    }

    /**
     * Search categories
     */
    public async search(params: CategorySearchParams) {
        return await categoryApi.search(params);
    }

    /**
     * Get category by ID using REST API
     */
    public async getById(id: string) {
        return await categoryApi.getById(id);
    }

    /**
     * Create a new category using REST API
     */
    public async create(data: CreateCategoryDto) {
        return await categoryApi.create(data);
    }

    /**
     * Update a category using REST API
     */
    public async update(id: string, data: UpdateCategoryDto) {
        return await categoryApi.update(id, data);
    }

    /**
     * Get category by slug using REST API
     */
    public async getBySlug(slug: string) {
        return await categoryApi.getBySlug(slug);
    }

    /**
     * Delete a category using REST API
     */
    public async delete(id: string) {
        await categoryApi.delete(id);
    }
}

export const CategoryService = new CategoryServiceClass();
