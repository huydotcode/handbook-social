import { imageApi } from '../apis/image.api';

class ImageServiceClass {
    /**
     * Get image URL by image ID
     */
    async getUrlByImageId(imageId: string): Promise<string | null> {
        try {
            const response = await imageApi.getById(imageId);
            return response.url || null;
        } catch (error) {
            console.error('Error getting image URL by ID:', error);
            return null;
        }
    }

    /**
     * Remove an image
     */
    async removeImage(imageUrl: string): Promise<boolean> {
        try {
            const response = await imageApi.deleteByUrl(imageUrl);
            return response.success || false;
        } catch (error) {
            console.error('Error removing image:', error);
            return false;
        }
    }
}

export const ImageService = new ImageServiceClass();
