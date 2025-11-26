import { categoryService as apiCategoryService } from '../api/services/category.service';

class CategoryServiceClass {
    /**
     * Create a new category using REST API
     */
    public async create(data: {
        name: string;
        description: string;
        slug: string;
        icon: string;
    }) {
        return await apiCategoryService.create({
            name: data.name,
            slug: data.slug,
            description: data.description,
        });
    }

    /**
     * Get category by slug using REST API
     */
    public async getBySlug(slug: string) {
        return await apiCategoryService.getBySlug(slug);
    }

    /**
     * Delete a category using REST API
     */
    public async delete(id: string) {
        await apiCategoryService.delete(id);
    }
}

const CategoryService = new CategoryServiceClass();
export default CategoryService;
