import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface UploadResponse {
    url: string;
    publicId: string;
    secureUrl: string;
}

export const uploadService = {
    /**
     * Upload image
     */
    uploadImage: (
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<UploadResponse> => {
        return apiClient.uploadFile<UploadResponse>(
            API_ENDPOINTS.UPLOAD.IMAGE,
            file,
            'image',
            onProgress
        );
    },

    /**
     * Upload video
     */
    uploadVideo: (
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<UploadResponse> => {
        return apiClient.uploadFile<UploadResponse>(
            API_ENDPOINTS.UPLOAD.VIDEO,
            file,
            'video',
            onProgress
        );
    },
};
