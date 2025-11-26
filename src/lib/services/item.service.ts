import { itemService as apiItemService } from '../api/services/item.service';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

interface IItemService {
    create({
        name,
        seller,
        description,
        price,
        imagesIds,
        location,
        category,
        status,
    }: {
        name: string;
        seller: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
    }): Promise<IItem>;
    getById(itemId: string): Promise<IItem>;
    getBySeller(seller: string): Promise<IItem[]>;
    getItemsByCategoryId(categoryId: string): Promise<IItem[]>;
    update({
        itemId,
        name,
        description,
        price,
        imagesIds,
        location,
        category,
        status,
        path,
    }: {
        itemId: string;
        name: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
        path: string;
    }): Promise<boolean>;
    delete({
        itemId,
        path,
    }: {
        itemId: string;
        path: string;
    }): Promise<boolean>;
}

class ItemServiceClass implements IItemService {
    /**
     * Create a new item
     * TODO: Server API needs POST /items endpoint
     */
    async create({
        name,
        seller,
        description,
        price,
        imagesIds,
        location,
        category,
        status,
    }: {
        name: string;
        seller: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
    }): Promise<IItem> {
        // TODO: Implement create item endpoint in server-api
        // POST /items
        console.warn('create item not yet implemented via REST API');
        throw new Error('Create item endpoint not yet implemented in REST API');
    }

    /**
     * Get item by ID
     * TODO: Server API needs GET /items/:id endpoint
     */
    async getById(itemId: string): Promise<IItem> {
        // TODO: Implement getById endpoint in server-api
        // GET /items/:id
        console.warn('getById item not yet implemented via REST API');
        throw new Error(
            'Get item by ID endpoint not yet implemented in REST API'
        );
    }

    /**
     * Get items by seller using REST API
     */
    async getBySeller(seller: string): Promise<IItem[]> {
        try {
            return await apiItemService.getBySeller(seller);
        } catch (error) {
            console.error('Error getting items by seller:', error);
            return [];
        }
    }

    /**
     * Get items by category ID
     * TODO: Server API needs GET /items?category_id=:categoryId endpoint
     */
    async getItemsByCategoryId(categoryId: string): Promise<IItem[]> {
        // TODO: Implement getItemsByCategoryId endpoint in server-api
        // GET /items?category_id=:categoryId
        console.warn('getItemsByCategoryId not yet implemented via REST API');
        return [];
    }

    /**
     * Update an item
     * TODO: Server API needs PUT /items/:id endpoint
     */
    async update({
        itemId,
        name,
        description,
        price,
        imagesIds,
        location,
        category,
        status,
        path,
    }: {
        itemId: string;
        name: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
        path: string;
    }): Promise<boolean> {
        // TODO: Implement update item endpoint in server-api
        // PUT /items/:id
        console.warn('update item not yet implemented via REST API');
        throw new Error('Update item endpoint not yet implemented in REST API');
    }

    /**
     * Delete an item
     * TODO: Server API needs DELETE /items/:id endpoint
     */
    async delete({
        itemId,
        path,
    }: {
        itemId: string;
        path: string;
    }): Promise<boolean> {
        // TODO: Implement delete item endpoint in server-api
        // DELETE /items/:id
        console.warn('delete item not yet implemented via REST API');
        throw new Error('Delete item endpoint not yet implemented in REST API');
    }
}

const ItemService = new ItemServiceClass();
export default ItemService;
