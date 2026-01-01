import { IMedia } from '@/types/entites';
import { apiClient } from '../../../core/api/api-client';
import { API_ENDPOINTS } from '../../../core/api/endpoints';

export const uploadService = {
    /**
     * Upload image
     * Returns IMedia object with _id, url, publicId, etc.
     */
    uploadImage: (
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<IMedia> => {
        return apiClient.uploadFile<IMedia>(
            API_ENDPOINTS.UPLOAD.IMAGE,
            file,
            'image',
            onProgress
        );
    },

    /**
     * Upload video
     * Returns IMedia object with _id, url, publicId, etc.
     */
    uploadVideo: (
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<IMedia> => {
        return apiClient.uploadFile<IMedia>(
            API_ENDPOINTS.UPLOAD.VIDEO,
            file,
            'video',
            onProgress
        );
    },
};
