import { imageService } from '../api/services/image.service';

class ImageServiceClass {
    /**
     * Get image URL by image ID
     */
    async getUrlByImageId(imageId: string): Promise<string | null> {
        try {
            const response = await imageService.getById(imageId);
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
            const response = await imageService.deleteByUrl(imageUrl);
            return response.success || false;
        } catch (error) {
            console.error('Error removing image:', error);
            return false;
        }
    }
}

const ImageService = new ImageServiceClass();
export default ImageService;
