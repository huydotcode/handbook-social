import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';

export const imageService = {
    /**
     * Get image URL by ID
     */
    getById: (imageId: string) => {
        return apiClient.get<{ url: string }>(
            API_ENDPOINTS.IMAGES.BY_ID(imageId)
        );
    },

    /**
     * Delete image by URL
     */
    deleteByUrl: (imageUrl: string) => {
        return apiClient.delete<{ success: boolean }>(
            API_ENDPOINTS.IMAGES.DELETE,
            {
                params: { url: imageUrl },
            }
        );
    },
};
