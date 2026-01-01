import { IItem } from '@/types/entites';
import { itemApi } from '../apis/item.api';

class ItemServiceClass {
    /**
     * Get all items
     */
    async getAll(params?: any) {
        return await itemApi.getAll(params);
    }

    /**
     * Search items
     */
    async search(params: any) {
        return await itemApi.search(params);
    }

    /**
     * Create a new item
     */
    async create(data: {
        name: string;
        seller: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
    }): Promise<IItem> {
        return await itemApi.create(data);
    }

    /**
     * Get item by ID
     */
    async getById(itemId: string): Promise<IItem> {
        return await itemApi.getById(itemId);
    }

    /**
     * Get items by seller using REST API
     */
    async getBySeller(seller: string): Promise<IItem[]> {
        try {
            return await itemApi.getBySeller(seller);
        } catch (error) {
            console.error('Error getting items by seller:', error);
            return [];
        }
    }

    /**
     * Get items by category ID
     */
    async getItemsByCategoryId(categoryId: string): Promise<IItem[]> {
        // Assuming there is filtering by category in LIST endpoint or strict endpoint needed
        // For now using getAll with filtering if API supports it, or simple LIST
        // Or if API_ENDPOINTS.ITEMS.LIST supports category param
        // checking item.api.ts getAll supports ItemQueryParams
        // If ItemQueryParams supports category, we can use that.
        // Assuming we can pass generic params for now
        try {
            return await itemApi.getAll({ category: categoryId } as any);
        } catch (error) {
            console.error('Error getting items by category:', error);
            return [];
        }
    }

    /**
     * Update an item
     */
    async update({
        itemId,
        ...data
    }: {
        itemId: string;
        name?: string;
        description?: string;
        price?: number;
        imagesIds?: string[];
        location?: string;
        category?: string;
        status?: string;
        path?: string;
    }): Promise<IItem> {
        return await itemApi.update(itemId, data);
    }

    /**
     * Delete an item
     */
    async delete({ itemId }: { itemId: string; path?: string }): Promise<void> {
        await itemApi.delete(itemId);
    }
}

export const ItemService = new ItemServiceClass();
